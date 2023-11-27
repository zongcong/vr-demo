<script lang="ts" setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'

const {push} = useRouter()

const routerList = ref([
  {name: 'VR', menuName: '自定义VR控制器的demo'},
  {name: 'FirstController', menuName: '第一人称+碰撞检测（Octree）demo'},
  {name: 'Cannon', menuName: 'Cannon物理引擎demo（未实现）'},
  {name: 'RawShader', menuName: '着色器demo'},
  {name: 'CSS2dDemo', menuName: 'CSS2DRenderer-demo'},
])

const handleView = (name: string): void => {
  push({ name })
}
</script>

<template>
  <div class="home-view">
    <div v-for="(item, index) in routerList"
         :key="item.name"
         @click="handleView(item.name)">{{index+1}}：{{ item.menuName }}</div>
  </div>
</template>

<style scoped>
.home-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.home-view div {
  cursor: pointer;
  color: #3A89FE;
  line-height: 40px;
}
</style>
