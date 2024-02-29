<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {init} from '@/demo/shader06'

const threeRef = ref()

onMounted(() =>{
  init(threeRef.value)
})
</script>
<template>
  <div ref="threeRef"></div>
</template>
<style scoped></style>
