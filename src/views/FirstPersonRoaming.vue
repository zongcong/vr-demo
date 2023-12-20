<script setup lang="ts">
import {ref, onMounted} from "vue";
import * as THREE from "three";

const threeRef = ref()
let leftButtonBool = false;// 记录鼠标左键状态

const init = (): void => {
  const speed = 12;// 加速度：调节按键加速快慢
  const vMax = 5;// 限制玩家角色最大速度
  const damping = -0.04; // 阻尼参数
  // 上下俯仰角度范围
  const angleMin = THREE.MathUtils.degToRad(-15);// 角度转弧度
  const angleMax = THREE.MathUtils.degToRad(15);

  const scene = new THREE.Scene()
  scene.background = new THREE.Color( 0xf0f0f0 );
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 1.6, -4.3); // 玩家角色后面一点
  camera.lookAt(0, 1.6, 0); // 对着人身上某个点  视线大致沿着人的正前方
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
  const clock = new THREE.Clock();
  // 用三维向量表示玩家角色(人)运动漫游速度
  // 按下W键对应的人运动速度
  const v = new THREE.Vector3(0, 0, 0);
  // const geometry = new THREE.BoxGeometry(0.5, 1.6, 0);
  // const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  // const player = new THREE.Mesh(geometry, material);
  const geometry = new THREE.CapsuleGeometry(0.25, 1.6, 4, 8);
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  const player = new THREE.Mesh(geometry, material);
  player.position.set(0, 1.1, 0)
  // 层级关系：player <—— cameraGroup <—— camera
  const cameraGroup = new THREE.Group();
  cameraGroup.add(camera);
  player.add(cameraGroup)
  scene.add(player)

  const gridHelper = new THREE.GridHelper(100, 100);
  scene.add( gridHelper );

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  threeRef.value.appendChild(renderer.domElement)

  const keyStates = {
    W: false,
    A: false,
    S: false,
    D: false,
  }

  let viewBool = true;//true表示第三人称，false表示第一人称
  document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyW') keyStates.W = true;
    if (event.code === 'KeyA') keyStates.A = true;
    if (event.code === 'KeyS') keyStates.S = true;
    if (event.code === 'KeyD') keyStates.D = true;
    if (event.code === 'KeyV') {
      if (viewBool) {
        // 切换到第一人称
        camera.position.z = 1;//相机在人前面一点 看不到人模型即可
        // camera.lookAt(0, 1.6, 2); // 对着人身上某个点  视线大致沿着人的正前方
      } else {
        // 切换到第三人称
        camera.position.z = -4.3;//相机在人后面一点
        // camera.lookAt(0, 1.6, 0)
      }
      viewBool = !viewBool;
    }
  })
  document.addEventListener('keyup', (event) => {
    if (event.code === 'KeyW') keyStates.W = false;
    if (event.code === 'KeyA') keyStates.A = false;
    if (event.code === 'KeyS') keyStates.S = false;
    if (event.code === 'KeyD') keyStates.D = false;
  })
  document.addEventListener('mousedown', () => {
    // document.body.requestPointerLock();// body页面指针锁定
    leftButtonBool = true;
  })
  document.addEventListener('mouseup', () => {
    leftButtonBool = false;
  })
  document.addEventListener('mousemove', (event) => {
    // 注意rotation.y += 与 -= 区别，左右旋转时候方向相反
    // event.movementX缩小一定倍数改变旋转控制的灵敏度
    // 鼠标左键按下时候，才旋转玩家角色
    // 进入指针模式后，才能根据鼠标位置控制人旋转 document.pointerLockElement === document.body
    // 退出指针模式 document.exitPointerLock()
    if(leftButtonBool){
      player.rotation.y -= event.movementX / 600;
      // 玩家角色绕x轴旋转  视角上下俯仰
      cameraGroup.rotation.x -= event.movementY / 600;

      // 一旦判断.rotation.x小于-15，就设置为-15，大于15，就设置为15
      if (cameraGroup.rotation.x < angleMin) {
        cameraGroup.rotation.x = angleMin;
      }
      if (cameraGroup.rotation.x > angleMax) {
        cameraGroup.rotation.x = angleMax
      }
    }
  });

  function animate() {
    const deltaTime = clock.getDelta();
    if (v.length() < vMax) {
      if (keyStates.W) {
        const front = new THREE.Vector3();
        // 获取玩家角色(相机)正前方
        player.getWorldDirection(front);
        v.add(front.multiplyScalar(speed * deltaTime))
      }
      if (keyStates.S) {
        // 与W按键相反方向
        const front = new THREE.Vector3();
        player.getWorldDirection(front);
        v.add(front.multiplyScalar(-speed * deltaTime))
      }
      if (keyStates.A) {// 向左运动
        const front = new THREE.Vector3();
        player.getWorldDirection(front);
        const up = new THREE.Vector3(0, 1, 0);// y方向

        const left = up.clone().cross(front);
        v.add(left.multiplyScalar(speed * deltaTime));
      }
      if (keyStates.D) {//向右运动
        const front = new THREE.Vector3();
        player.getWorldDirection(front);
        const up = new THREE.Vector3(0, 1, 0);// y方向
        // 叉乘获得垂直于向量up和front的向量 左右与叉乘顺序有关,可以用右手螺旋定则判断，也可以代码测试结合3D场景观察验证
        const right = front.clone().cross(up);
        v.add(right.multiplyScalar(speed * deltaTime));
      }
    }
    // v*(1 + damping) = v* (1 - 0.04) = v * 0.96
    // 多次循环乘以0.96(v*0.96*0.96*0.96...),v就会无限逼近于0。
    // v*(1 + damping) = v + v * damping
    v.addScaledVector(v, damping); // 阻尼减速

    // 在间隔deltaTime时间内，玩家角色位移变化计算(速度*时间)
    const deltaPos = v.clone().multiplyScalar(deltaTime);
    player.position.add(deltaPos); // 更新玩家角色的位置

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
    <div class="tips">
      <p>键盘 wsad 控制方向</p>
      <p>键盘 v 切换第一第三人称</p>
    </div>
  </div>
</template>
<style scoped>
.tips {
  position: fixed;
  left: 0;
  top: 0;
  line-height: 24px;
  font-size: 12px;
  color: #fff;
  padding: 10px 20px;
  border-radius: 2px;
  background-color: rgba(0,0,0,0.2);
}
</style>