import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import vertex from '@/shaders/raw/vertex.glsl?raw'
import fragment from '@/shaders/raw/fragment.glsl?raw'

export const init = (threeDom: HTMLCanvasElement):void=> {
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 3)

    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    const clock = new THREE.Clock()

    const textureLoader = new THREE.TextureLoader()
    const texture =textureLoader.load('/0.jpg')

    // const material = new THREE.MeshBasicMaterial({color: '#00ff00'})
    // 创建着色器材质
    const rawShaderMaterial = new THREE.RawShaderMaterial({
        // gl_Position 投影矩阵 * 视图矩阵 * 模型矩阵 * 顶点坐标
        vertexShader: vertex,
        fragmentShader: fragment,
        side: THREE.DoubleSide,
        uniforms: {
            uTime: {
                value: 0
            },
            uTexture: {
                value: texture
            }
        }
    })
    // 创建平面
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1,64,64),
        rawShaderMaterial
    )

    scene.add(floor)

    const renderer = new THREE.WebGLRenderer()

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    renderer.setSize(window.innerWidth, window.innerHeight)
    threeDom.appendChild(renderer.domElement)


    function animate() {
        const time = clock.getElapsedTime();
        rawShaderMaterial.uniforms.uTime.value = time
        controls.update()
        renderer.render(scene, camera);
        // 更新动画
        requestAnimationFrame(animate);
    }
    animate()
}
