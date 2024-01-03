import { createStore } from 'vuex'
// import axios from 'axios'
const api = 'http://localhost:3030'
import { feathers } from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import authentication from '@feathersjs/authentication-client'
//deathers client
const app = feathers()

// Connect to a different URL
const restClient = rest(api)

// Configure an AJAX library (see below) with that client
app.configure(restClient.fetch(window.fetch.bind(window)))

// Configure authentication
app.configure(authentication())
//define the services
const refsService = app.service('refs')
const userService = app.service('users')

// Create a new store instance.
export const store = createStore({
  state() {
    return {
      accessToken: localStorage.getItem('accessToken') || '',
      refs: [],
      user: JSON.parse(localStorage.getItem('user')) || {}
    }
  },
  getters: {
    getAccessToken(state) {
      return state.accessToken
    },
    getRefs(state) {
      return state.refs.sort((a, b) => b.likers.length - a.likers.length)
    }
  },
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token
      localStorage.setItem('accessToken', token)
    },
    setRefs(state, refs) {
      state.refs = refs
    },
    addRef(state, ref) {
      state.refs.push(ref)
    },
    setRefInRefs(state, ref) {
      const index = state.refs.findIndex((r) => r._id === ref._id)
      state.refs[index] = ref
    },
    setUser(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    logout(state) {
      state.accessToken = ''
      state.user = {}
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
    }
  },
  actions: {
    //login the user
    async login({ commit }, loginData) {
      const result = await app.authenticate({ ...loginData, strategy: 'local' })
      //set token in the store
      commit('setAccessToken', result.accessToken)
      //set user in the store
      commit('setUser', result.user)
      return result
    },
    async logout({ commit }) {
      await app.logout()
      commit('logout')
    },
    //register the user
    async register({ dispatch }, account) {
      //registering
      await userService.create(account)
      //login after registering
      const loginData = {
        email: account.email,
        password: account.password
      }
      //login
      await dispatch('login', loginData)
    },
    async updateUser({ state }, user) {
      const updatedUser = await userService.patch(state.user._id, user, {
        headers: {
          Authorization: `Bearer ${state.accessToken}`
        }
      })
      this.commit('setUser', updatedUser)
    },
    async getRefs({ state }) {
      const response = await refsService.find({
        headers: {
          Authorization: `Bearer ${state.accessToken}`
        }
      })
      // //set refs in the store
      this.commit('setRefs', response.data)
      return response.data
    },
    //add a reference
    async addRef({ state }, refData) {
      const adding = await refsService.create(refData, {
        headers: {
          Authorization: `Bearer ${state.accessToken}`
        }
      })
      this.commit('addRef', adding)
      return adding
    },
    //searching for a reference
    async searchRef({ state }, { searchKey, category }) {
      //search query depending on the category and the search key
      let query = {
        $and: [
          { category: category },
          {
            $or: [
              { title: { $regex: searchKey } },
              { details: { $regex: searchKey } },
              { category: { $regex: searchKey } }
            ]
          }
        ]
      }
      //if the category is all, search in all categories
      if (category === 'all') {
        query = {
          $or: [
            { title: { $regex: searchKey } },
            { details: { $regex: searchKey } },
            { category: { $regex: searchKey } }
          ]
        }
      }
      //if the search key is empty, search in the category
      if (searchKey === '') {
        query = {
          category: category.toLowerCase()
        }
      }
      console.log(query)
      const response = await refsService.find({
        query: query,
        headers: {
          Authorization: `Bearer ${state.accessToken}`
        }
      })
      console.log(response.data)
      this.commit('setRefs', response.data)
      return response.data
    },
    async likeRef({ state }, refId) {
      const liking = await refsService.patch(
        refId,
        { $addToSet: { likers: state.user._id } },
        {
          headers: {
            Authorization: `Bearer ${state.accessToken}`
          }
        }
      )
      if (liking) {
        this.commit('setRefInRefs', liking)
      }
      return liking
    },
    async dislikeRef({ state }, refId) {
      const disliking = await refsService.patch(
        refId,
        { $pull: { likers: state.user._id } },
        {
          headers: {
            Authorization: `Bearer ${state.accessToken}`
          }
        }
      )
      if (disliking) {
        this.commit('setRefInRefs', disliking)
      }
    }
  }
})
