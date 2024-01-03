<template>
  <h1 class="text-center bg-gray-500 p-2 rounded text-white font-bold">
    Create an account and get all refs you need !
  </h1>

  <main>
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
        @click="register"
        type="button"
        class="bg-blue-500 p-2 rounded hover:bg-blue-700 text-white"
      >
        Register
      </button>
      <p class="text-center mt-2">
        Already member ? <router-link to="/authentication/login">Login !</router-link>
      </p>
    </form>
  </main>
</template>
<style scoped>
main {
  height: 100vh;
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
let firstName = ref('d')
let lastName = ref('b')
let email = ref('cd@g.com')
let password = ref('11111')
let confirmPassword = ref('11111')
//alert
let alert = ref(false)
let alertMessage = ref('')

const store = useStore()
const register = async () => {
  //validation
  if (!firstName.value || !lastName.value || !email.value || !password.value) {
    alert.value = true
    alertMessage.value = 'Please fill all fields'
    return
  }
  if (password.value.length < 5) {
    alert.value = true
    alertMessage.value = 'Please choose a password with 5 carateres minimum.'
    return
  }
  if (password.value !== confirmPassword.value) {
    alert.value = true
    alertMessage.value = 'Password and confirm password must be the same.'
    return
  }
  if (!email.value.includes('@') || !email.value.includes('.')) {
    alert.value = true
    alertMessage.value = 'Please enter a valid email.'
    return
  }
  //create account
  const account = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value
  }
  await store.dispatch('register', account)
  router.push('/admin/refs')
}
</script>
