<script setup lang="ts">
import {ref, onMounted} from 'vue'
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import rawVertex from "@/shaders/rawVertex.glsl?raw"
import rawFragment from "@/shaders/rawFragment.glsl?raw"

const threeRef = ref()

const init = ():void=>{
  const scene = new THREE.Scene()

  const clock = new THREE.Clock()

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 1)

  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  const renderer = new THREE.WebGLRenderer()

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.update()

  renderer.setSize(window.innerWidth, window.innerHeight)
  threeRef.value.appendChild(renderer.domElement)


  // 创建物体
  const geometry = new THREE.SphereGeometry(1, 32, 16);
  const count = geometry.attributes.position.count
  const randoms = new Float32Array(count)
// 使用随机数填充数组
  for(let i = 0; i < count; i++) {
    randoms[i] = Math.random()
  }
  // 添加到几何体的属性中
  // geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

  const textureLoader = new THREE.TextureLoader()

  const material = new THREE.ShaderMaterial({
    vertexShader: rawVertex,
    fragmentShader: rawFragment,
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
      uFrequency: { value: new THREE.Vector2(10, 5) },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('orange') },
      uTexture: { value: textureLoader.load('./0.jpg') }
    }
  })
  const plane = new THREE.Mesh( geometry, material);

  scene.add(plane);

  function animate() {
    controls.update()
    tick()
    renderer.render(scene, camera);
    // 更新动画
    requestAnimationFrame(animate);
  }

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;
    // ...
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
<style scoped></style>