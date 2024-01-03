<template>
  <div class="flex justify-between">
    <ButtonBack />
  </div>
  <div class="container">
    <form class="w-full max-w-lg">
      <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Title
          </label>
          <input
            v-model.trim="title"
            class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            type="text"
            placeholder="Mongoose and Springboot"
          />
        </div>
        <div class="w-full md:w-1/2 px-3">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Details
          </label>
          <input
            v-model.trim="details"
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            placeholder="How to link my mongodb cluster to my springboot app?"
          />
        </div>
      </div>

      <div class="flex flex-wrap -mx-3 mb-2">
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-state"
          >
            Topic
          </label>
          <div class="relative">
            <select
              v-model="category"
              class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-state"
            >
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="marketing">Marketing</option>
              <option value="music">Music</option>
              <option value="cinema">Cinema</option>
              <option value="art">Art</option>
              <option value="other">Other</option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
            >
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <!--alert-->
      <p v-show="alert" class="bg-red-100 rounded text-center mb-2 p-1">{{ alertMessage }}</p>
      <button
        @click="addRef"
        type="button"
        class="bg-green-700 hover:bg-green-500 text-white p-2 rounded mx-2"
      >
        Add
      </button>
    </form>
  </div>
</template>
<style scoped>
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useStore } from 'vuex'
import ButtonBack from '../components/ButtonBack.vue'

//alert
const alert = ref(false)
const alertMessage = ref('')
//store and router
const store = useStore()
const router = useRouter()

//ref
const title = ref('')
const details = ref('')
const category = ref('programming')
//add ref
const addRef = async () => {
  if (title.value === '' || details.value === '') {
    alert.value = true
    alertMessage.value = 'Please fill all the fields'
    setTimeout(() => {
      alert.value = false
      alertMessage.value = ''
    }, 3000)
    return
  }
  const ref = {
    id_User: store.state.user._id,
    title: title.value,
    details: details.value,
    category: category.value.toLowerCase()
  }
  const response = await store.dispatch('addRef', ref)
  if (response) {
    router.push('/admin/refs')
  } else {
    console.log('error', response)
  }
}
</script>
