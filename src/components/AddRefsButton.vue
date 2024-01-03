<template>
  <main>
    <button
      @click="addRef"
      class="text-white rounded-full bg-green-700 hover:bg-green-500 p-3 px-5 text-lg"
    >
      +
    </button>
  </main>
</template>
<style scoped></style>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const addRef = () => {
  router.push('/admin/addRef')
}
</script>
