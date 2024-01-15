<template>
  <h1 class="text-center bg-gray-200 text-3xl p-1">Sign in to Refs</h1>

  <div class="container">
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
        <p class="bg-red-100 text-center p-1 mb-2 rounded" v-if="alert">{{ alertMessage }}</p>

        <div class="flex items-center justify-between">
          <button
            @click="signIn"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Sign in
          </button>

          <!-- <a
            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#"
          >
            Forgot Password?
          </a>-->
        </div>
        <!--
        <div class="text-center">Or</div>
        <div class="flex justify-center my-3 space-x-1">
          <span  @click="googleOauth" class="bg-blue-500 cursor-pointer text-white rounded p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-google"
              viewBox="0 0 16 16"
            >
              <path
                d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"
              /></svg
          ></span>
          <span @click="githubOauth" class="bg-blue-500 cursor-pointer text-white rounded p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-github"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"
              /></svg
          ></span>
        </div>
        -->
        <p class="mt-2 text-center">
          Not member yet ? <router-link to="/authentication/register">Register !</router-link>
        </p>
      </form>
      <p class="text-center text-gray-500 text-xs">&copy;2024 Refs. All rights reserved.</p>
    </div>
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
import { useStore } from 'vuex'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()
const router = useRouter()
let email = ref('')
let password = ref('')
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
// const googleOauth = async () => {
//   window.location.href = 'http://localhost:3030/oauth/google'
//   // store.dispatch('loginWithGoogle')
// }
// const githubOauth = async () => {
//   window.location.href = 'http://localhost:3030/oauth/github'
// }
// import axios from 'axios'

// const getUserInfoFromGoogle = async (accessToken) => {
//   try {
//     const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`
//       }
//     })

//     return response.data // This contains user information from Google
//   } catch (error) {
//     console.error('Error fetching user info:', error.message)
//     return null
//   }
// }

onMounted(async () => {
  const url = route.fullPath
  if (url.includes('=')) {
    const accessToken = url.split('=')[1]
    store.commit('setAccessToken', accessToken)
    // router.push('/admin/refs')
    // console.log('Access token from Google:', accessToken) // This will log the access token from Google);

    // Usage example
    // const userInfo = await getUserInfoFromGoogle(accessToken)
    // console.log('User info from Google:', userInfo) // This will log the user information from Google
  }
})
</script>
