<template>
  <div class="container">
    <div class="flex justify-between">
      <ButtonBack />
    </div>
    <div v-show="store.state.comments.length == 0" class="text-center border">
      No comments yet !
    </div>
    <div class="flex flex-row flex-wrap justify-center">
      <Comment
        v-for="comment in store.state.comments"
        :key="comment._id"
        :comment="comment"
        class="md:w-5/12"
      />
    </div>
    <div class="inputeDiv flex flex-row w-full">
      <textarea
        v-model.trim="comment"
        class="bg-gray-500 w-4/5 rounded mx-2 p-2 h-10 text-white"
        placeholder="Write a reference..."
      ></textarea>
      <button
        :disabled="!comment"
        @click="submiteComment"
        class="bg-blue-700 hover:bg-blue-500 rounded px-2"
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
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
<style scoped>
.inputeDiv {
  position: fixed;
  bottom: 5px;
}
</style>
<script setup>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ref, onMounted } from 'vue'
import Comment from '../components/CommentShape.vue'
import ButtonBack from '../components/ButtonBack.vue'

const store = useStore()
const route = useRoute()
const id_Ref = route.params.id_Ref
const comments = ref([])
const comment = ref('')
onMounted(async () => {
  comments.value = await store.dispatch('getComments', id_Ref)
})
const submiteComment = () => {
  store.dispatch('addComment', { id_Ref, text: comment.value, id_User: store.state.user._id })
  comment.value = ''
}
</script>
