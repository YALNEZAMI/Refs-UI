<template>
  <div class="ref w-full rounded p-1 bg-gray-700 text-white h-32">
    <h1 class="text-center text-xl">{{ reference.title }}</h1>
    <p class="h-16 overflow-y-auto p-1">
      <span class="underline">{{ reference.category }}</span
      >: {{ reference.details }}
    </p>
    <div class="flex justify-between px-16">
      <!--like-->
      <button
        v-if="!reference.likers.includes(store.state.user._id)"
        @click="like"
        class="min-w-20 text-green-700 hover:text-green-500 flex flex-row space-x-2"
        :disabled="reference.likers.includes(store.state.user._id)"
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
        @click="dislike"
        class="min-w-20 text-orange-700 hover:text-orange-500 flex flex-row space-x-2"
        :disabled="!reference.likers.includes(store.state.user._id)"
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
      <!--comment-->
      <button
        @click="$router.push(`/admin/comments/${reference._id}`)"
        class="min-w-20 text-blue-700 hover:text-blue-500 flex flex-row space-x-2"
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
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
          />
        </svg>
        <span>comment</span>
      </button>
      <!--delete-->
      <button
        v-if="store.state.user._id == reference.id_User"
        @click="confirmDelete = true"
        class="min-w-20 text-red-700 hover:text-red-500"
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
      </button>
    </div>
    <div v-if="confirmDelete" class="confirmDelete">
      <div class="rounded bg-white p-5">
        <p class="text-black">Are you sure you want to delete this reference ?</p>
        <div class="flex justify-between px-10 mt-3">
          <button
            class="rounded bg-green-700 hover:bg-green-500 text-white p-2"
            @click="confirmDelete = false"
          >
            No
          </button>
          <button class="rounded bg-red-700 hover:bg-red-500 text-white p-2" @click="deleteRef">
            Yes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.confirmDelete {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { useStore } from 'vuex'
const confirmDelete = ref(false)
const store = useStore()
const emit = defineEmits(['like', 'dislike'])
const { reference } = defineProps(['reference'])

const deleteRef = async () => {
  const deleting = await store.dispatch('deleteRef', reference._id)
  if (deleting) {
    emit('delete', reference._id)
  }
}
const like = async () => {
  const liking = await store.dispatch('likeRef', reference._id)
  if (liking) {
    emit('like')
  }
}
const dislike = async () => {
  const dislinking = await store.dispatch('dislikeRef', reference._id)
  if (dislinking) {
    emit('dislike')
  }
}
</script>
