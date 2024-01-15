<template>
  <div class="container mt-1">
    <!--button add-->
    <div id="addButton"><AddRefsButton /></div>

    <!--search bar-->
    <div class="flex flex-row space-x-1">
      <!--profile button-->
      <button
        @click="$router.push('/admin/profile')"
        class="profile px-1 min-w-16 text-center hover:bg-gray-100 flex flex-col items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
        <span class="text-xs text-center">{{ store.state.user.firstName }}</span>
      </button>
      <!--my posts button-->
      <button
        @click="$router.push('/admin/posts')"
        class="postsBtn px-1 min-w-16 text-center hover:bg-gray-100 flex flex-col items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9"
          />
        </svg>

        <span class="text-xs text-center">My posts</span>
      </button>
      <select
        v-model="category"
        name="category"
        class="h-11 cursor-pointer block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="all">All</option>
        <option value="programming">Programming</option>
        <option value="design">Design</option>
        <option value="business">Business</option>
        <option value="marketing">Marketing</option>
        <option value="music">Music</option>
        <option value="cinema">Cinema</option>
        <option value="art">Art</option>
        <option value="other">Other</option>
      </select>
      <SearchBarRefs class="w-full" @search="search" />
    </div>
    <!--refs array-->
    <div class="flex flex-wrap justify-center w-full p-0 mt-1">
      <RefEntity
        @dislike="onDislike"
        @like="onLike"
        @delete="onDelete($event)"
        class="md:w-5/12 md:mx-16 mt-1"
        v-for="ref in refs"
        :key="ref._id"
        :reference="ref"
      />
    </div>
  </div>
</template>
<style scoped>
#addButton {
  position: fixed;
  bottom: 30px;
  right: 30px;
}
</style>
<script setup>
import AddRefsButton from '../components/AddRefsButton.vue'
import SearchBarRefs from '../components/SearchBarRefs.vue'
import RefEntity from '../components/RefEntity.vue'

import { useStore } from 'vuex'
import { ref, onMounted, watch } from 'vue'
const store = useStore()

const refs = ref([])
const category = ref(store.state.category)
onMounted(async () => {
  refs.value = await store.dispatch('searchRef', {
    searchKey: store.state.searchKey,
    category: category.value
  })

  //reset comments in store when user quite the comments page
  store.commit('setComments', [])
})
const search = async (searchKey) => {
  if (searchKey === '') {
    refs.value = await store.dispatch('getRefs')
  } else {
    refs.value = await store.dispatch('searchRef', {
      searchKey: searchKey,
      category: category.value
    })
  }
}
const onLike = () => {
  refs.value = refs.value.sort((a, b) => b.likers.length - a.likers.length)
}
const onDislike = () => {
  refs.value = refs.value.sort((a, b) => b.likers.length - a.likers.length)
}
const onDelete = async (refId) => {
  refs.value = refs.value.filter((ref) => ref._id !== refId)
}
//watch category change
watch(category, async (newValue) => {
  //set in the store
  store.commit('setCategory', newValue)

  refs.value = await store.dispatch('searchRef', {
    searchKey: store.state.searchKey,
    category: category.value
  })
})
</script>
