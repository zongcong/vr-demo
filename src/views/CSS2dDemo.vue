<script setup lang="ts">
import * as THREE from 'three'
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer'
import {ref, onMounted} from 'vue'


const threeRef = ref()

const init = (): void => {
  // Create a scene
  const scene = new THREE.Scene();

// Create a camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 10;

  const axesHelper = new THREE.AxesHelper(100)
  scene.add(axesHelper)

  // 创建一个 CSS3DRenderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  threeRef.value.appendChild(renderer.domElement);

  const css2dRenderer = new CSS2DRenderer();
  css2dRenderer.setSize(window.innerWidth, window.innerHeight);
  css2dRenderer.domElement.style.position = 'absolute';
  css2dRenderer.domElement.style.top = '0px';
  threeRef.value.appendChild(css2dRenderer.domElement);


  // 创建一个包含文本的 DOM 元素
  const textElement = document.createElement('div');
  textElement.textContent = 'Hello, CSS2DObject!';
  textElement.style.color = 'white';

  const geometry = new THREE.BoxGeometry(1, 1, 8);
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // light
  const fillLight1 = new THREE.HemisphereLight(0x8dc1de, 0x00668d, 0.5);
  fillLight1.position.set(1, 1, 1);
  scene.add(fillLight1);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(-5, 25, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.near = 0.01;
  directionalLight.shadow.camera.far = 500;
  directionalLight.shadow.camera.right = 30;
  directionalLight.shadow.camera.left = -30;
  directionalLight.shadow.camera.top = 30;
  directionalLight.shadow.camera.bottom = -30;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.radius = 4;
  directionalLight.shadow.bias = -0.00006;
  scene.add(directionalLight);

  // 创建一个 CSS2DObject
  const textObject = new CSS2DObject(textElement);
  textObject.position.set(0, 0, 4); // 在二维空间中设置位置
  scene.add(textObject);

  // Render the scene
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    css2dRenderer.render(scene, camera);
  }

  animate();
}

onMounted(() => {
  init()
})
</script>
<template>
  <div ref="threeRef"></div>
</template>
<style scoped></style>