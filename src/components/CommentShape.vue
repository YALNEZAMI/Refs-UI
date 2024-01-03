<template>
  <div class="bg-gray-700 w-full mx-4 my-1 p-2 text-white text-center rounded h-20 overflow-y-auto">
    <div class="mb-2">
      {{ comment.text }}
    </div>
    <div class="flex justify-between px-16">
      <!--like-->
      <button
        v-if="!comment.likers.includes(store.state.user._id)"
        @click="likeComment"
        class="text-green-700 hover:text-green-500 flex flex-row space-x-2"
        :disabled="comment.likers.includes(store.state.user._id)"
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
            d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <span>like</span>
      </button>
      <!--dislike-->
      <button
        v-else
        @click="dislikeComment"
        class="text-orange-700 hover:text-orange-500 flex flex-row space-x-2"
        :disabled="!comment.likers.includes(store.state.user._id)"
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
            d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <span>dislike</span>
      </button>
      <!--delete-->
      <button
        v-if="store.state.user._id == comment.id_User"
        @click="deleteComment"
        class="text-red-700 hover:text-red-500 flex flex-row space-x-2"
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
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
        <span>delete</span>
      </button>
    </div>
  </div>
</template>
<style scoped></style>
<script setup>
import { defineProps } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const { comment } = defineProps(['comment'])
const deleteComment = () => {
  store.dispatch('deleteComment', comment._id)
}
const likeComment = () => {
  store.dispatch('likeComment', comment._id)
}
const dislikeComment = () => {
  store.dispatch('dislikeComment', comment._id)
}
</script>
