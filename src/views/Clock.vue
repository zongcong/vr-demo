<script setup lang="ts">
import {ref, onMounted} from "vue";
import * as THREE from "three";

const threeRef = ref()
let isMove = false

const handleMoveCamera = ():void=>{
  isMove = true
}

const init = (): void => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 1
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
  const clock = new THREE.Clock();

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  const cube = new THREE.Mesh(geometry, material);
  // 当需要第一人称的时候，可以把相机添加为模型的子对象，这样相机会跟随模型移动
  // cube.add(camera)
  scene.add(cube);

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  threeRef.value.appendChild(renderer.domElement)

  const moveCamera = ():void=>{
    const targetPosition = new THREE.Vector3(10, 0, 8); // 指定的目标位置
    // 计算物体当前位置到目标位置的向量
    const direction = new THREE.Vector3().subVectors(targetPosition, camera.position.clone());

    if (direction.lengthSq() > 0.001) { // 使用 lengthSq() 检查长度的平方来判断是否到达目标位置
      // 将当前相机位置与目标位置进行线性插值，0.05 是插值的速度因子，可以调整这个值来改变移动速度
      camera.position.lerp(targetPosition, 0.05);
      // camera.lookAt(scene.position); // 确保相机一直看向场景中心
    }
  }

  const moveCube = ():void=>{
    const targetPosition = new THREE.Vector3(10, 5, 8); // 指定的目标位置
    const speed = 2; // 移动速度
    const delta = clock.getDelta();

    const direction = new THREE.Vector3().subVectors(targetPosition, cube.position.clone());


    // 计算移动距离，根据速度和时间间隔调整
    const distanceToTarget = direction.length();
    const moveDistance = speed * delta;

    // 如果移动距离小于等于目标距离，移动物体到目标位置
    if (moveDistance <= distanceToTarget) {
      // 根据移动距离和方向调整物体位置
      direction.normalize();
      direction.multiplyScalar(moveDistance);
      cube.position.add(direction);
    } else {
      // 如果移动距离大于目标距离，直接设置物体位置为目标位置
      cube.position.copy(targetPosition);
      // 可以在这里停止动画或进行其他操作
      isMove = false
    }
  }

  function animate() {
    if(isMove) {
      moveCube()
      moveCamera()
      camera.lookAt(cube.position.clone())
    }
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
  <div>
    <button type="button" class="btn" @click="handleMoveCamera">移动相机</button>
    <div ref="threeRef"></div>
  </div>
</template>
<style scoped>
.btn {
  position: absolute;
  z-index: 1;
  top: 0;
}
</style>