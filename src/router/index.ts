import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/vr',
      name: 'VR',
      component: () => import('../views/VR.vue')
    },
    {
      path: '/firstController',
      name: 'FirstController',
      component: () => import('../views/FirstController.vue')
    },
    {
      path: '/cannon',
      name: 'Cannon',
      component: () => import('../views/Cannon.vue')
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import('../views/Test.vue')
    },
    {
      path: '/rawShader',
      name: 'RawShader',
      component: () => import('../views/RawShader.vue')
    },
    {
      path: '/css2dDemo',
      name: 'CSS2dDemo',
      component: () => import('../views/CSS2dDemo.vue')
    },
    {
      path: '/CSS3dDemo',
      name: 'CSS3dDemo',
      component: () => import('../views/CSS3dDemo.vue')
    },
    {
      path: '/Clock',
      name: 'Clock',
      component: () => import('../views/Clock.vue')
    },
    {
      path: '/FirstPersonRoaming',
      name: 'FirstPersonRoaming',
      component: () => import('../views/FirstPersonRoaming.vue')
    },
    {
      path: '/OrbitControls',
      name: 'OrbitControls',
      component: () => import('../views/OrbitControls.vue')
    },
    {
      path: '/ThreeMeshBvhDemo',
      name: 'ThreeMeshBvhDemo',
      component: () => import('../views/ThreeMeshBvhDemo.vue')
    },
    {
      path: '/ShaderMaterial',
      name: 'ShaderMaterial',
      component: () => import('../views/ShaderMaterial.vue')
    },
    {
      path: '/FlyLight',
      name: 'FlyLight',
      component: () => import('../views/FlyLight.vue')
    }
  ]
})

export default router
