import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export const init = (threeDom: HTMLCanvasElement):void=> {
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 3)

    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    // const material = new THREE.MeshBasicMaterial({color: '#00ff00'})

    // 创建着色器材质
    const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            void main() {
                gl_Position = projectionMatrix * viewMatrix * modelMatrix *  vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            void main() {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }
        `
    })
    // 创建平面
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1,64,64),
        shaderMaterial
    )

    scene.add(floor)

    const renderer = new THREE.WebGLRenderer()

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    renderer.setSize(window.innerWidth, window.innerHeight)
    threeDom.appendChild(renderer.domElement)


    function animate() {
        controls.update()
        renderer.render(scene, camera);
        // 更新动画
        requestAnimationFrame(animate);
    }
    animate()
}
