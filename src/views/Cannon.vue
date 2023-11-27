<script setup lang="ts">
import {onMounted} from 'vue'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
import {Capsule} from 'three/examples/jsm/math/Capsule'
import * as THREE from 'three'

let renderer, camera, scene, container;
let clock;
// 是否在地面上
let playerOnFloor = false
const keyStates = {} as any

// new Capsule(下球心（vector3），上球心（vector3），半径)
let player = {
  geometry: new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35),
  velocity: new THREE.Vector3(),
  direction: new THREE.Vector3()
}

const init = () => {
  // renderer
  container = document.getElementById('container');
  renderer = new THREE.WebGLRenderer({antialias: true})  // antialias:true 开启抗锯齿
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  // camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 0)
  camera.rotation.order = 'YXZ'

  // scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x88ccee)
  scene.fog = new THREE.Fog(0x88ccee, 0, 50)
  scene.add(new THREE.GridHelper(10))

  // light
  const fillLight1 = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
  fillLight1.position.set(2, 1, 1);
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

  // clock
  clock = new THREE.Clock()

  // controls
  // const controls = new OrbitControls(camera, renderer.domElement)

  window.addEventListener("resize", onResize)

  loadModel()
}

const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const loadModel = () => {
  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath(`./draco/`)
  dracoLoader.setDecoderConfig({type: 'js'})
  dracoLoader.preload()
  loader.setDRACOLoader(dracoLoader)
  // https://threejs.org/examples/models/gltf/collision-world.glb
  loader.load('./model/1806.glb', gltf => {
    scene.add(gltf.scene)
    animate()
  })
}

const addListenerFn = () => {
  let isMouseDown = false;
  let previousMouseX = 0;
  let previousMouseY = 0;
  // 鼠标摁下，锁定鼠标
  document.addEventListener('mousedown', e => {
    isMouseDown = true
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
  }, false)

  // 鼠标移动
  document.addEventListener('mouseup', (e) => {
    isMouseDown = false
  }, false)

  document.addEventListener('mousemove', (e) => {
    // 当鼠标在锁定状态时，我们调整相机镜头旋转
    if (isMouseDown) {
      const movementSpeed = 500; // 调整旋转速度的缩放因子
      const movementX = e.clientX - previousMouseX;
      const movementY = e.clientY - previousMouseY;
      camera.rotation.y -= movementX / movementSpeed;
      camera.rotation.x -= movementY / movementSpeed;
      camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    }
  }, false);

  document.addEventListener('keydown', e => {
    keyStates[e.code] = true
  })
  document.addEventListener('keyup', e => {
    keyStates[e.code] = false
  })
}

const handleControls = (deltaTime: number) => {
  // 如果player在地面上，速度为25
  const speedDelta = deltaTime * (playerOnFloor ? 25 : 8);

  if (keyStates['KeyW']) {
    // 摁下W，获取当前水平向量，与这个值相乘，获得player速度改变
    player.velocity.add(getForwardVector().multiplyScalar(speedDelta));

  }

  if (keyStates['KeyS']) {

    player.velocity.add(getForwardVector().multiplyScalar(-speedDelta));

  }

  if (keyStates['KeyA']) {

    player.velocity.add(getSideVector().multiplyScalar(-speedDelta))
  }

  if (keyStates['KeyD']) {

    player.velocity.add(getSideVector().multiplyScalar(speedDelta));

  }

  if (playerOnFloor) {

    if (keyStates['Space']) {

      player.velocity.y = 8;

    }

  }
}

// 获得前进方向向量
const getForwardVector = () => {
  camera.getWorldDirection(player.direction);
  player.direction.y = 0;
  // 转化为单位向量
  player.direction.normalize();

  return player.direction;
}

const getSideVector = () => {
  // Camera.getWorldDirection ( target : Vector3 ) : Vector3 调用该函数的结果将赋值给该Vector3对象。
  camera.getWorldDirection(player.direction);
  player.direction.y = 0;

  // 将该向量转换为单位向量（unit vector）， 也就是说，将该向量的方向设置为和原向量相同，但是其长度（length）为1。
  player.direction.normalize();
  player.direction.cross(camera.up);

  return player.direction;
}

// 更新位置
const updatePlayer = (deltaTime: number): void => {

  let damping = Math.exp(-4 * deltaTime) - 1;

  player.velocity.addScaledVector(player.velocity, damping);

  // 位移距离
  const deltaPosition = player.velocity.clone().multiplyScalar(deltaTime);
  player.geometry.translate(deltaPosition);

  // 相机的位置，拷贝player的位置
  camera.position.copy(player.geometry.end);
}


const animate = () => {
  const deltaTime = Math.min(0.05, clock.getDelta())
  // 控制player移动
  handleControls(deltaTime)


  // 更新player的位置
  updatePlayer(deltaTime)

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

onMounted(() => {
  init()
  // loadModel()
  addListenerFn()
})
</script>
<template>
  <div id="container"></div>
</template>
<style scoped></style>