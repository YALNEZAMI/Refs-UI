<template>
  <div class="container p-3">
    <div class="flex justify-between">
      <button
        @click="$router.back"
        class="rounded p-2 text-yellow-700 hover:bg-yellow-500 hover:text-white"
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
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>
      </button>
      <button @click="logout" class="rounded p-2 text-red-700 hover:bg-red-500 hover:text-white">
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
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
          />
        </svg>
      </button>
    </div>
    <div class="form-container">
      <form class="w-full max-w-lg">
        <div class="flex flex-wrap -mx-3 mb-5">
          <div class="w-full md:w-1/2 px-3 mb-3 md:mb-0">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-first-name"
            >
              First Name
            </label>
            <input
              v-model.trim="firstName"
              class="appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:bg-white"
              id="grid-first-name"
              type="text"
              placeholder="Jane"
            />
          </div>
          <div class="w-full md:w-1/2 px-3 mb-3 md:mb-0">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-last-name"
            >
              Last Name
            </label>
            <input
              v-model.trim="lastName"
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              type="text"
              placeholder="Doe"
            />
          </div>
        </div>

        <div class="flex flex-wrap -mx-3 mb-5">
          <div class="w-full px-3 mb-3 md:mb-0">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-last-name"
            >
              Email
            </label>
            <input
              v-model.trim="email"
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              type="email"
              placeholder="Doe"
            />
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full md:w-1/2 px-3">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-password"
            >
              Password
            </label>
            <input
              v-model="password"
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-password"
              type="password"
              placeholder="******************"
            />
            <p class="text-gray-600 text-xs italic">Minimum 5 caracters .</p>
          </div>
          <div class="w-full md:w-1/2 px-3">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-password"
            >
              Confirm password
            </label>
            <input
              v-model.trim="confirmPassword"
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-password"
              type="password"
              placeholder="******************"
            />
          </div>
        </div>
        <p class="bg-red-100 text-center p-1 mb-1 rounded" v-if="alert">{{ alertMessage }}</p>
        <button
          @click="update"
          type="button"
          class="bg-green-700 p-2 rounded hover:bg-green-500 text-white"
        >
          update
        </button>
      </form>
    </div>
  </div>
</template>
<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<script setup>
import { useStore } from 'vuex'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const store = useStore()
const user = store.state.user
const email = ref(user.email)
const firstName = ref(user.firstName)
const lastName = ref(user.lastName)
let password = ref('')
let confirmPassword = ref('')
let alert = ref(false)
let alertMessage = ref('')

const update = () => {
  if (password.value !== confirmPassword.value) {
    lanceAlert('passwords do not match')
    return
  }

  if (firstName.value === '' || lastName.value === '' || email.value === '') {
    lanceAlert('Please fill all the fields')
    return
  }
  if (!email.value.includes('@') || !email.value.includes('.')) {
    lanceAlert('Please enter a valid email')
    return
  }
  const user = {
    email: email.value,
    firstName: firstName.value,
    lastName: lastName.value,
    password: password.value
  }
  if (password.value === '') {
    delete user.password
  }
  store.dispatch('updateUser', user)

  router.back()
}
function lanceAlert(msg) {
  alert.value = true
  alertMessage.value = msg
  setTimeout(() => {
    alert.value = false
    alertMessage.value = ''
  }, 3000)
}
const logout = () => {
  store.dispatch('logout')
  router.push('/authentication/login')
}
</script>
