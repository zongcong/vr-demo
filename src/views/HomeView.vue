<script setup lang="ts">
import {ref, onMounted} from 'vue'
import * as THREE from "three";
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import TWEEN from "three/examples/jsm/libs/tween.module";
import {VRController} from "@/vr/controller/VRController";

const threeRef = ref()

const  init = () => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
  const axesHelper = new THREE.AxesHelper(5)

  scene.add(axesHelper)

  // camera.position.set(0, 0, 0.01)//相机位置

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  threeRef.value.appendChild(renderer.domElement)
  // const controls = new OrbitControls(camera, renderer.domElement)
  const controls = new VRController(camera, renderer.domElement)
  // 根据需要设置控制器的属性或事件监听器
  controls.rotateSpeed = 0.1; // 设置旋转速度
  controls.dampingFactor = 0.86; // 设置旋转速度
  // controls.enableDamping = true; // 设置旋转速度
  controls.enabled = true; // 启用控制器

  const sphereGeometry = new THREE.SphereGeometry(1, 256, 256)//节点数量越大，需要计算的三角形就越多，影响性能
  sphereGeometry.scale(1, 1, -1)
  const texture = new THREE.TextureLoader().load('./3.jpg')
  texture.encoding = THREE.sRGBEncoding

  const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff })
  sphereMaterial.map.encoding = THREE.sRGBEncoding;

  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  scene.add(sphere)

  // 定义初始相机位置和目标相机位置
  const initialCameraPosition = new THREE.Vector3(0, 0, 0); // 初始位置
  const targetCameraPosition = new THREE.Vector3(10, 0, 0); // 目标位置
  // 创建 Tween.js 动画实例
  let cameraAnimation = new TWEEN.Tween(initialCameraPosition)
      .to(targetCameraPosition, 15000) // 动画持续时间
      .easing(TWEEN.Easing.Quadratic.InOut) // 缓动函数
  // 处理动画的更新
  cameraAnimation.onUpdate(res => {
    camera.position.copy(res)
  })
  // setTimeout(() => {
  //   cameraAnimation.start()
  // }, 2000)


  function animate() {
    TWEEN.update()
    controls.update()
    renderer.render(scene, camera);
    // 更新动画
    requestAnimationFrame(animate);
  }
  animate()
}

onMounted(() => {
  init()
})
</script>

<template>
  <div ref="threeRef"></div>
</template>
