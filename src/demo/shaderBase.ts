import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export const init = (threeDom: HTMLCanvasElement):void=> {
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 10)

    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

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
