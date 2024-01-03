<template>
  <main>
    <div class="w-full max-w-xs">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username"> Email </label>
          <input
            v-model.trim="email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            placeholder="email"
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Password
          </label>
          <input
            v-model.trim="password"
            class="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
          />
        </div>
        <p class="bg-red-100 text-center p-1 mb-2 rounded" v-if="alert">{{ alertMessage }}cc</p>

        <div class="flex items-center justify-between">
          <button
            @click="signIn"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Sign In
          </button>

          <!-- <a
            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#"
          >
            Forgot Password?
          </a>-->
        </div>
        <p class="mt-2 text-center">
          Not member yet ? <router-link to="/authentication/register">Register !</router-link>
        </p>
      </form>
      <p class="text-center text-gray-500 text-xs">&copy;2024 Refs. All rights reserved.</p>
    </div>
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
let email = ref('test@.')
let password = ref('12345')
const store = useStore()
//alert
let alert = ref(false)
let alertMessage = ref('')
const lanceAlert = (msg) => {
  alert.value = true
  alertMessage.value = msg
  setTimeout(() => {
    alert.value = false
    alertMessage.value = ''
  }, 3000)
}
const signIn = async () => {
  try {
    if (!email.value || !password.value) {
      lanceAlert('Please fill all fields')
      return
    }
    await store.dispatch('login', {
      email: email.value,
      password: password.value
    })

    router.push('/admin/refs')
  } catch (error) {
    lanceAlert('Wrong email or password')
  }
}
</script>
