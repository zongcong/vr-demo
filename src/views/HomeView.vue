<script lang="ts" setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'

const {push} = useRouter()

const routerList = ref([
  {name: 'VR', menuName: '自定义VR控制器的demo'},
  {name: 'FirstController', menuName: '第一人称+碰撞检测（Octree）demo'},
  {name: 'Cannon', menuName: 'Cannon物理引擎demo（未实现）'},
  {name: 'RawShader', menuName: '着色器demo'},
  {name: 'ShaderMaterial', menuName: '着色器ShaderMaterial-demo'},
  {name: 'FlyLight', menuName: '着色器孔明灯'},
  {name: 'CSS2dDemo', menuName: 'CSS2DRenderer-demo-无法被模型遮挡(可以用作弹窗信息展示)'},
  {name: 'CSS3dDemo', menuName: 'CSS3DRenderer-demo-无法被模型遮挡(可以用作弹窗信息展示，通过设置lookAt(camera.position)始终朝向相机位)'},
  {name: 'Clock', menuName: '使用Clock对象方法getDelta移动物体（相机等）'},
  {name: 'FirstPersonRoaming', menuName: '第一人称漫游'},
  {name: 'OrbitControls', menuName: 'OrbitControls 相机动画'},
  {name: 'ThreeMeshBvhDemo', menuName: 'three-mesh-bvh 碰撞检测'},
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
