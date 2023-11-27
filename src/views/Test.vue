<script setup lang="ts">
import {onMounted} from "vue";
import * as THREE from 'three'
import {World, Body, SAPBroadphase, Material, ContactMaterial, Box, Quaternion, Plane, Sphere, Vec3, Cylinder} from 'cannon-es'
import {Capsule} from "three/examples/jsm/math/Capsule";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
// import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
// import {OctreeHelper} from "three/examples/jsm/helpers/OctreeHelper";
import {createBoundingBoxShape, createCollisionShape, createConvexPolyhedron, createShapeFromMesh, test} from '@/utils'

let renderer, camera, scene, container;
let clock;

let world
const objects = []

// 是否在地面上
let playerOnFloor = false
const keyStates = {}

let player = {
  geometry: new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35),
  velocity: new THREE.Vector3(),
  direction: new THREE.Vector3()
}
// let player = {
//   geometry: new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35),
//   velocity: new THREE.Vector3(),
//   direction: new THREE.Vector3()
// }

const defaultMaterial = new Material('default')
const defalutContactMaterial = new ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.1,
      restitution: 0.4,
    }
)

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
  // scene.fog = new THREE.Fog(0x88ccee, 0, 50)

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

  // clock
  clock = new THREE.Clock()

  window.addEventListener("resize", onResize)

  createWorld()
}

const addGeometryWorld = (data: THREE.Object3D[]): void => {
  // 创建对应的碰撞形状
  data.forEach(child => {
    if (child?.children?.length) {
      addGeometryWorld(child.children)
    } else {
      const geometry = child.geometry;
      child.scale.set(1,1,1)
      if(geometry) {
        // const scale = new Vec3(child.scale.x, child.scale.y, child.scale.z); // 设置缩放
        const cposition = {
          x: child.position.clone().x,
          y: child.position.clone().y,
          z: child.position.clone().z,
        }

        const cquaternion = {
          x: child.quaternion.clone().x,
          y: child.quaternion.clone().y,
          z: child.quaternion.clone().z,
          w: child.quaternion.clone().w,
        }

        // 将模型的位置、旋转和缩放应用于刚体
        const position = new Vec3(cposition.x, cposition.y, cposition.z) // 设置初始位置
        const quaternion = new Quaternion(cquaternion.x, cquaternion.y, cquaternion.z, cquaternion.w); // 设置初始旋转

        // const shape = createCollisionShape(geometry);
        const shape = test(geometry);
        // modelMesh.position.copy(child.position)
        // modelMesh.quaternion.copy(child.quaternion)
        // 创建刚体并设置其位置、旋转等属性
        const body = new Body({
          mass: 1, // 设置质量为0，表示静态物体
          shape,
          // position,
          // quaternion,
          // material: defaultMaterial
        });

        // modelMesh.position.copy(body.position)
        // modelMesh.quaternion.copy(body.quaternion)

        // body.addShape(shape);
        // objects.push({
        //   mesh: modelMesh,
        //   body,
        // })
        // 将刚体添加到物理世界中
        world.addBody(body);
      }
    }
  })
}

const loadModel = (scene) => {
  const loader = new GLTFLoader()
  // https://threejs.org/examples/models/gltf/collision-world.glb
  loader.load('https://threejs.org/examples/models/gltf/collision-world.glb', gltf => {
    console.log(gltf.scene)
    scene.add(gltf.scene)
    const meshData = gltf.scene.children || []
    addGeometryWorld(meshData)

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0xffffff});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(2, 2.5, 0)
    scene.add(cube);

    const position = {
      x: cube.position.clone().x,
      y: cube.position.clone().y,
      z: cube.position.clone().z,
    }

    console.log(position)

    const shape = new Box(new Vec3(1/2, 1/2, 1/2))
    const body = new Body({
      mass: 1,
      shape,
      position: new Vec3(position.x, position.y, position.z),
      material: defaultMaterial
    })

    body.addShape(shape)
    world.addBody(body)

    objects.push({
      mesh: cube,
      body,
    })
    // gltf.scene.traverse(child => {
    //
    //   if (child.isMesh) {
    //     // 阴影效果
    //     child.castShadow = true;
    //     child.receiveShadow = true;
    //
    //   }
    //
    // })
  })
}

const createWorld = () => {
  world = new World()
  world.broadphase = new SAPBroadphase(world) //更好性能，travelling too fast
  world.allowSleep = true
  world.gravity.set(0, -9.82, 0)

  const planeG = new THREE.PlaneGeometry(100, 100)
  const planeM = new THREE.MeshStandardMaterial({color: 0x333333})
  const plane = new THREE.Mesh(planeG, planeM)
  plane.rotation.x = -0.5 * Math.PI
  plane.receiveShadow = true
  // scene.add(plane)

  world.addContactMaterial(defalutContactMaterial)

  const planeShape = new Plane()
  const planeBody = new Body({
    mass: 0,
    shape: planeShape,
    material: defaultMaterial,
  })
  planeBody.quaternion.setFromAxisAngle(
      new Vec3(-1, 0, 0),
      Math.PI * 0.5
  )
  // world.addBody(planeBody)

  loadModel(scene)

  const sphereG = new THREE.SphereGeometry(1, 32, 32)
  const sphereM = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.2,
    metalness: 0.1,
  })


  function createSphere(radius, position) {
    const mesh = new THREE.Mesh(sphereG, sphereM)
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    const shape = new Sphere(radius)
    const body = new Body({
      mass: 1,
      shape,
      position,
      material: defaultMaterial
    })
    body.addShape(shape)
    world.addBody(body)

    objects.push({
      mesh,
      body,
    })
  }

  let count = 0
  const interval = setInterval(() => {
    let z = Math.random() * 0.01
    let position = {x: 2, y: 15, z}
    let r = Math.random() * 0.2 + 0.1
    createSphere(r, position)
    count++
    if (count >= 200) {
      clearInterval(interval)
    }
  }, 1000)

}

const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
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

const getSideVector = () => {
  // Camera.getWorldDirection ( target : Vector3 ) : Vector3 调用该函数的结果将赋值给该Vector3对象。
  camera.getWorldDirection(player.direction);
  player.direction.y = 0;

  // 将该向量转换为单位向量（unit vector）， 也就是说，将该向量的方向设置为和原向量相同，但是其长度（length）为1。
  player.direction.normalize();
  player.direction.cross(camera.up);

  return player.direction;
}

// 获得前进方向向量
const getForwardVector = () => {
  camera.getWorldDirection(player.direction);
  player.direction.y = 0;
  // 转化为单位向量
  player.direction.normalize();

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

const handleControls = (deltaTime) => {
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


const animate = () => {
  const deltaTime = Math.min(0.05, clock.getDelta())

  world.step(1 / 60, deltaTime, 3)
  objects.forEach(e => {
    e.mesh.position.copy(e.body.position)
    e.mesh.quaternion.copy(e.body.quaternion)
  })

  // 控制player移动
  handleControls(deltaTime)

  // 更新player的位置
  updatePlayer(deltaTime)

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

onMounted(() => {
  init()
  addListenerFn()
  animate()
})

</script>
<template>
  <div id="container"></div>
</template>
<style scoped></style>