<script setup lang="ts">
import {ref, onMounted} from "vue";
import * as THREE from "three";
import TWEEN from "three/examples/jsm/libs/tween.module";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const threeRef = ref()
let isMove = false

const init = (): void => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(-4, 8, 4)
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)


  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  const cube = new THREE.Mesh(geometry, material);
  cube.name = 'test'
  cube.position.set(4,0,4)
  scene.add(cube);

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  threeRef.value.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.update()
  // controls.target.set(5,0,5)
  // 相机动画函数，从A点飞行到B点，A点表示相机当前所处状态
// pos: 三维向量Vector3，表示动画结束相机位置
// target: 三维向量Vector3，表示相机动画结束lookAt指向的目标观察点
  function createCameraTween(endPos, endTarget) {
    new TWEEN.Tween({
      // 不管相机此刻处于什么状态，直接读取当前的位置和目标观察点
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
      tx: controls.target.x,
      ty: controls.target.y,
      tz: controls.target.z,
    })
        .to({
          // 动画结束相机位置坐标
          x: endPos.x,
          y: endPos.y,
          z: endPos.z,
          // 动画结束相机指向的目标观察点
          tx: endTarget.x,
          ty: endTarget.y,
          tz: endTarget.z,
        }, 2000)
        .onUpdate(function (obj) {
          // 动态改变相机位置
          camera.position.set(obj.x, obj.y, obj.z);
          // 动态计算相机视线
          controls.target.set(obj.tx, obj.ty, obj.tz);
        })
        .start();
  }

  document.querySelector('#reset').addEventListener('click', function () {
    // 相机从当前位置camera.position回到整体预览状态
    // 相机整体预览对应的位置和观察目标
    const cameraPos0 = new THREE.Vector3(-4, 8, 4)
    const target0 = new THREE.Vector3(0, 0, 0);
    createCameraTween(cameraPos0, target0)
  })

  document.querySelector('#move').addEventListener('click', function () {
    const testObj = scene.getObjectByName('test');
    const pos = new THREE.Vector3();
    testObj.getWorldPosition(pos); //获取三维场景中某个对象世界坐标
    // 相机飞行到的位置和观察目标拉开一定的距离
    const pos2 = pos.clone().addScalar(2);
    createCameraTween(pos2, pos)
  })

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
  <div>
    <div ref="threeRef"></div>
    <div class="btn">
      <button type="button" id="move">相机移动到正方体</button>
      <button type="button" id="reset">重置相机</button>
    </div>
  </div>
</template>
<style scoped>
.btn {
  position: fixed;
  left: 10px;
  top: 10px;
}

.btn button {
  background-color: #999;
  border: none;
  padding: 5px 10px;
  color: #fff;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 2px;
}
</style>