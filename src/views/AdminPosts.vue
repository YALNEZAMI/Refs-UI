<template>
  <div class="container">
    <ButtonBack />
    <!--refs array-->
    <div class="flex flex-wrap justify-center w-full p-0 mt-1">
      <RefEntity
        @dislike="onDislike"
        @like="onLike"
        @delete="onDelete($event)"
        class="md:w-5/12 md:mx-16 mt-1"
        v-for="ref in refs"
        :key="ref._id"
        :reference="ref"
      />
    </div>
  </div>
</template>
<style scoped></style>

<script setup>
import RefEntity from '../components/RefEntity.vue'
import ButtonBack from '../components/ButtonBack.vue'

import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const refs = ref([])
onMounted(() => {
  refs.value = store.state.refs.filter((refIt) => {
    return refIt.id_User === store.state.user._id
  })
  console.log(refs.value)
})
</script>
