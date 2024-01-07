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
const commentsService = app.service('comments')

// Create a new store instance.
export const store = createStore({
  state() {
    return {
      accessToken: localStorage.getItem('feathers-jwt') || '',
      refs: [],
      comments: [].sort((a, b) => b.likers.length - a.likers.length),
      user: JSON.parse(localStorage.getItem('user')) || {},
      category: 'all',
      searchKey: ''
    }
  },
  getters: {},
  mutations: {
    setCategory(state, category) {
      state.category = category
    },
    setSearchKey(state, searchKey) {
      state.searchKey = searchKey
    },

    setAccessToken(state, token) {
      state.accessToken = token
      localStorage.setItem('feathers-jwt', token)
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
    },
    deleteRefInRefs(state, refId) {
      state.refs = state.refs.filter((ref) => ref._id !== refId)
    },
    setComments(state, comments) {
      state.comments = comments
    },
    addComment(state, comment) {
      state.comments.push(comment)
    },
    deleteCommentInComments(state, commentId) {
      state.comments = state.comments.filter((comment) => comment._id !== commentId)
    },
    setCommentInComments(state, comment) {
      const index = state.comments.findIndex((c) => c._id === comment._id)
      state.comments[index] = comment
    }
  },
  actions: {
    //login with google
    async loginWithGoogle({ commit }) {
      const result = await app.authenticate({
        strategy: 'google'
      })
      console.log(result.accessToken, result.user)
      //set token in the store
      commit('setAccessToken', result.accessToken)
      //set user in the store
      commit('setUser', result.user)
      return result
    },
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
      response.data = response.data.sort((a, b) => b.likers.length - a.likers.length)

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
    //delete a reference
    async deleteRef({ state }, refId) {
      const deleting = await refsService.remove(refId, {
        headers: {
          Authorization: `Bearer ${state.accessToken}`
        }
      })
      if (deleting) {
        this.commit('deleteRefInRefs', refId)
      }
      return deleting
    },
    //searching for a reference
    async searchRef({ state }, { searchKey, category }) {
      //search query without any filter
      let query = {}
      //search depending on the category and the search key
      if (category !== 'all' && searchKey !== '') {
        query = {
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
      }

      //search just depending on the search key
      if (category === 'all' && searchKey !== '') {
        query = {
          $or: [
            { title: { $regex: searchKey } },
            { details: { $regex: searchKey } },
            { category: { $regex: searchKey } }
          ]
        }
      }
      //search just depending on the category
      if (searchKey === '' && category !== 'all') {
        query = {
          category: category.toLowerCase()
        }
      }
      const response = await refsService.find({
        query: query,
        headers: {
          Authorization: `Bearer ${state.accessToken}`
        }
      })
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
    },
    //get comments of a reference
    async getComments({ state }, id_Ref) {
      const response = await commentsService.find({
        query: {
          id_Ref: id_Ref
        },
        headers: {
          Authorization: `Bearer ${state.accessToken}`
        }
      })
      //sort comments by likes
      response.data = response.data.sort((a, b) => b.likers.length - a.likers.length)
      this.commit('setComments', response.data)
      return response.data
    },
    //add a comment
    async addComment({ state }, commentData) {
      const ref = await refsService.get(commentData.id_Ref, {
        headers: {
          Authorization: `Bearer ${state.accessToken}`
        }
      })
      commentData.id_User_Of_Ref = ref.id_User
      const adding = await commentsService.create(commentData, {
        headers: {
          Authorization: `Bearer ${state.accessToken}`
        }
      })
      this.commit('addComment', adding)
      return adding
    },
    //delete a comment
    async deleteComment({ state }, commentId) {
      const deleting = await commentsService.remove(commentId, {
        headers: {
          Authorization: `Bearer ${state.accessToken}`
        }
      })
      if (deleting) {
        this.commit('deleteCommentInComments', commentId)
      }
      return deleting
    },
    //like a comment
    async likeComment({ state }, id_comment) {
      const liking = await commentsService.patch(
        id_comment,
        { $addToSet: { likers: state.user._id } },
        {
          headers: {
            Authorization: `Bearer ${state.accessToken}`
          }
        }
      )
      if (liking) {
        this.commit('setCommentInComments', liking)
      }
      return liking
    },
    //dislike a comment
    async dislikeComment({ state }, id_comment) {
      const disliking = await commentsService.patch(
        id_comment,
        { $pull: { likers: state.user._id } },
        {
          headers: {
            Authorization: `Bearer ${state.accessToken}`
          }
        }
      )
      if (disliking) {
        this.commit('setCommentInComments', disliking)
      }
    },
    //delete account
    async deleteAccount({ state }) {
      //delete all comments of the user or of the refs of the user
      // await commentsService.remove(null, {
      //   query: {
      //     $or: [{ id_User: state.user._id }, { id_User_Of_Ref: state.user._id }]
      //   },
      //   headers: {
      //     Authorization: `Bearer ${state.accessToken}`
      //   }
      // })
      // //delete all refs of the user
      // await refsService.remove(null, {
      //   query: {
      //     id_User: state.user._id
      //   },
      //   headers: {
      //     Authorization: `Bearer ${state.accessToken}`
      //   }
      // })
      const deleting = await userService.remove(state.user._id, {
        headers: {
          Authorization: `Bearer ${state.accessToken}`
        }
      })
      const refsUser = await refsService.find({
        query: {
          id_User: state.user._id
        },
        headers: {
          Authorization: `Bearer ${state.accessToken}`
        }
      })
      for (let i = 0; i < refsUser.length; i++) {
        const ref = refsUser[i]
        await refsService.remove(ref._id, {
          headers: {
            Authorization: `Bearer ${state.accessToken}`
          }
        })
      }
      const commentsUser = await commentsService.find({
        query: {
          $or: [{ id_User: state.user._id }, { id_User_Of_Ref: state.user._id }]
        },
        headers: {
          Authorization: `Bearer ${state.accessToken}`
        }
      })
      for (let i = 0; i < commentsUser.length; i++) {
        const comment = commentsUser[i]
        await commentsService.remove(comment._id, {
          headers: {
            Authorization: `Bearer ${state.accessToken}`
          }
        })
      }

      if (deleting) {
        this.commit('logout')
      }
      return deleting
    }
  }
})
