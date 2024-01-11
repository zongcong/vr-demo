<script setup lang="ts">
import * as THREE from "three";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {MeshBVH, MeshBVHVisualizer, StaticGeometryGenerator, computeBoundsTree, disposeBoundsTree,} from 'three-mesh-bvh';

import Stats from 'stats.js';
import {onMounted, ref} from "vue";

const threeRef = ref()

let renderer, camera, scene, clock;
let controls, player, environment, collider, visualizer
let stats
let playerIsOnGround = false

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

const keyStates = {
  W: false,
  A: false,
  S: false,
  D: false,
}

const playerVelocity = new THREE.Vector3();

const init = (): void => {
  const bgColor = 0x263238 / 2
  scene = new THREE.Scene()
  // 用来指定场景的雾效
  // 设置了这个属性之后，场景中的物体会在远处逐渐变得模糊，从而产生一种雾化的视觉效果
  // scene.fog = new THREE.Fog(bgColor, 20, 70)

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(10, 10, -10);

  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  clock = new THREE.Clock();

  renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(bgColor, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  threeRef.value.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement);
  // stats setup
  stats = new Stats();
  document.body.appendChild(stats.dom);

  createLight()
  // 加载模型

  loadColliderEnvironment()

  cratePlayer()

  animate()
}

const cratePlayer = (): void => {
  // character
  player = new THREE.Mesh(
      new RoundedBoxGeometry(1.0, 2.0, 1.0, 10, 0.5),
      new THREE.MeshStandardMaterial()
  )
  player.geometry.translate(0, -0.5, 0);
  player.capsuleInfo = {
    radius: 0.5,
    segment: new THREE.Line3(new THREE.Vector3(), new THREE.Vector3(0, -1.0, 0.0))
  }
  // 是否投射阴影
  player.castShadow = true;
  // 对象是否接收阴影
  player.receiveShadow = true;
  // 背面不会投射阴影，只有正面才会投射阴影
  player.material.shadowSide = 2;
  scene.add(player)
  reset()
}

const loadColliderEnvironment = (): void => {
  new GLTFLoader()
      .load('./model/mesh-bvh/scene.gltf', res => {
        const gltfScene = res.scene;
        gltfScene.scale.setScalar(.01);

        const box = new THREE.Box3();
        box.setFromObject(gltfScene);
        box.getCenter(gltfScene.position).negate();
        gltfScene.updateMatrixWorld(true);
        console.log(gltfScene, 'gltfScene')

        // visual geometry setup
        const toMerge = {}
        gltfScene.traverse((c: THREE.Object3D):void => {
          // console.log(gltfScene, 'gltfScene')
          if (
              /Boss/.test(c.name) ||
              /Enemie/.test(c.name) ||
              /Shield/.test(c.name) ||
              /Sword/.test(c.name) ||
              /Character/.test(c.name) ||
              /Gate/.test(c.name) ||
              // spears
              /Cube/.test(c.name) ||
              // pink brick
              c.material && c.material.color.r === 1.0
          ) {
            return;
          }
          if (c.isMesh) {
            const hex = c.material.color.getHex();
            toMerge[hex] = toMerge[hex] || [];
            toMerge[hex].push(c);
          }
        });
        environment = new THREE.Group();
        for (const hex in toMerge) {
          const arr = toMerge[hex];
          const visualGeometries = [];
          arr.forEach(mesh => {
            if (mesh.material.emissive.r !== 0) {
              environment.attach(mesh);
            } else {
              const geom = mesh.geometry.clone();
              geom.applyMatrix4(mesh.matrixWorld);
              visualGeometries.push(geom);
            }
          });
          if (visualGeometries.length) {
            const newGeom = BufferGeometryUtils.mergeGeometries(visualGeometries);
            const newMesh = new THREE.Mesh(newGeom, new THREE.MeshStandardMaterial({
              color: parseInt(hex),
              shadowSide: 2
            }));
            newMesh.castShadow = true;
            newMesh.receiveShadow = true;
            newMesh.material.shadowSide = 2;4
            environment.add(newMesh);
          }
        }

        const staticGenerator = new StaticGeometryGenerator(environment);
        staticGenerator.attributes = ['position'];

        const mergedGeometry = staticGenerator.generate();
        mergedGeometry.boundsTree = new MeshBVH(mergedGeometry);

        collider = new THREE.Mesh(mergedGeometry);
        collider.material.wireframe = true;
        collider.material.opacity = 0.5;
        collider.material.transparent = true;
        collider.visible = false

        visualizer = new MeshBVHVisualizer(collider, 10);
        // visualizer.visible = false
        scene.add(visualizer);
        scene.add(collider);
        scene.add(environment);
        // scene.add(gltfScene)
      })
}

const createLight = (): void => {
  // lights
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1.5, 1).multiplyScalar(50);
  light.shadow.mapSize.setScalar(2048);
  light.shadow.bias = -1e-4;
  light.shadow.normalBias = 0.05;
  light.castShadow = true;

  const shadowCam = light.shadow.camera;
  shadowCam.bottom = shadowCam.left = -30;
  shadowCam.top = 30;
  shadowCam.right = 45;

  scene.add(light);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 0.4));
}

const reset = () => {
  playerVelocity.set(0, 0, 0);
  player.position.set(15.75, -3, 30);
  camera.position.sub(controls.target);
  controls.target.copy(player.position);
  camera.position.add(player.position);
  controls.update();
}

const animate = () => {
  stats.update();
  renderer.render(scene, camera);
  // 更新动画
  requestAnimationFrame(animate);
}

const onResize = (): void => {
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, false);
}

const onKeyFn = (): void => {
  window.addEventListener('keydown', function (e) {
    switch (e.code) {
      case 'KeyW':
        keyStates.W = true;
        break;
      case 'KeyS':
        keyStates.S = true;
        break;
      case 'KeyD':
        keyStates.D = true;
        break;
      case 'KeyA':
        keyStates.A = true;
        break;
      case 'Space':
        if (playerIsOnGround) {
          playerVelocity.y = 10.0;
          playerIsOnGround = false;
        }
        break;
    }
  });
  window.addEventListener('keyup', function (e) {
    switch (e.code) {
      case 'KeyW':
        keyStates.W = false;
        break;
      case 'KeyS':
        keyStates.S = false;
        break;
      case 'KeyD':
        keyStates.D = false;
        break;
      case 'KeyA':
        keyStates.A = false;
        break;
    }
  });
}

onMounted(() => {
  init()
  onResize()
})
</script>
<template>
  <div ref="threeRef"></div>
</template>
<style scoped></style>