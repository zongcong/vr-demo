import * as THREE from "three";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import TWEEN from 'three/examples/jsm/libs/tween.module';
import vertex from '@/shaders/flylight/vertex.glsl?raw'
import fragment from '@/shaders/flylight/fragment.glsl?raw'

export const init = (threeDom: HTMLCanvasElement): void => {
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 3)

    // const axesHelper = new THREE.AxesHelper(5)
    // scene.add(axesHelper)

    const clock = new THREE.Clock()

    // 加载环境纹理
    const rgbELoader = new RGBELoader()
    rgbELoader.loadAsync('/1k.hdr').then((texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
    })

    // const material = new THREE.MeshBasicMaterial({color: '#00ff00'})
    // 创建着色器材质
    const shaderMaterial = new THREE.ShaderMaterial({
        // gl_Position 投影矩阵 * 视图矩阵 * 模型矩阵 * 顶点坐标
        vertexShader: vertex,
        fragmentShader: fragment,
        side: THREE.DoubleSide,
        // transparent: true,
        uniforms: {
            uTime: {
                value: 0
            }
        }
    })


    // 加载灯笼
    let lightBox = null
    const lightGroup = new THREE.Group()
    const gltfLoader = new GLTFLoader()
    gltfLoader.load('/model/fly.glb', (gltf) => {
        console.log(gltf.scene)
        gltf.scene.scale.set(0.2, 0.2, 0.2);
        // scene.add(gltf.scene);
        lightGroup.add(gltf.scene);
        lightAnimate(gltf.scene);
        lightBox = gltf.scene.children[0] as THREE.Mesh
        lightBox.material = shaderMaterial


        for (let i = 0; i < 150; i++) {
            const lightObject = gltf.scene.clone(true);
            const x = (Math.random() - 0.5) * 150;
            const y = Math.random() * 50;
            const z = (Math.random() - 0.5) * 150;
            lightObject.position.set(x, y, z);
            lightAnimate(lightObject);
            lightGroup.add(lightObject);
        }
        scene.add(lightGroup)
    })

    // 孔明灯动画函数
    const lightAnimate = (lightObjet: THREE.Group): void=> {
        // 旋转动画
        new TWEEN.Tween(lightObjet.rotation)
            .to({
                y: lightObjet.rotation.y + Math.random() * 30
            }, 10000 + Math.random() * 20000)
            .repeat(Infinity)
            .start()

        // 位置的动画
        new TWEEN.Tween(lightObjet.position)
            .to({
                x: lightObjet.position.x + Math.random() * 10,
                y: lightObjet.position.y + Math.random() * 20
            }, 5000 + Math.random() * 20000)
            .yoyo(true)
            .repeat(Infinity)
            .start()
    }

    const renderer = new THREE.WebGLRenderer();
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.09;
    // renderer.outputColorSpace = THREE.SRGBColorSpace;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.1;
    controls.maxPolarAngle = Math.PI / 4 * 3;
    controls.minPolarAngle = Math.PI / 4;
    controls.update()

    renderer.setSize(window.innerWidth, window.innerHeight)
    threeDom.appendChild(renderer.domElement)


    function animate(time1) {
        const time = clock.getElapsedTime();
        shaderMaterial.uniforms.uTime.value = time;
        controls.update()
        renderer.render(scene, camera);
        TWEEN.update(time1)
        // 更新动画
        requestAnimationFrame(animate);
    }

    animate()
}
