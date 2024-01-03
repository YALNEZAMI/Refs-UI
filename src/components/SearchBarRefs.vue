<template>
  <main>
    <input
      class="border-black border-2 rounded-md p-2 w-full"
      type="text"
      v-model.trim="searchKey"
      placeholder="Searching for..."
    />
  </main>
</template>

<style scoped>
/* Your scoped styles here */
</style>

<script setup>
import { ref, defineEmits, watch } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
// import { useStore } from 'vuex'
// const store = useStore()
const emit = defineEmits(['search'])
// Declare a reactive reference for the search key
const searchKey = ref(store.state.searchKey)
//watching to modification of searchKey
watch(searchKey, (newValue) => {
  store.commit('setSearchKey', newValue)
  search()
})
// Function to update the search key when input changes
const search = () => {
  emit('search', searchKey.value)
}
</script>
