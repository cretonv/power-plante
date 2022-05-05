import './style.css'
import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Case} from "./Case";

const canvas = document.querySelector<HTMLDivElement>('canvas#webgl')!

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

/**
 * Sizes
 */
const sizes = {
    width: canvas.clientWidth,
    height: canvas.clientHeight,
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setClearColor(0x000000, 1)
renderer.setSize(sizes.width, sizes.height)

/**
* Camera
*/
const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
camera.position.z = 3
scene.add(camera)

/**
 * Controls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

/**
 * Objects
 */
const caseElement = new Case()
caseElement.init(() => {
    scene.add(caseElement.object)
}, camera, controls)

const light = new THREE.AmbientLight( 0x404040, 3.5 )
// light.position.set(0.8, 1.4, 1.0)
scene.add(light)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    // const elapsedTime = clock.getElapsedTime()

    // Check canvas size and resolution
    if (resizeRendererToDisplaySize()) {
        const aspect = canvas.clientWidth / canvas.clientHeight
        if (camera.isPerspectiveCamera || camera.isOrthographicCamera || camera.isCamera) {
            camera.aspect = aspect
            camera.updateProjectionMatrix()
        }
    }

    // Update controls
    controls.update()

    // if (modelReady) mixer.update(clock.getDelta())
    caseElement.anim(camera)

    // Render
    render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

function render() {
    renderer.render(scene, camera)
}

function resizeRendererToDisplaySize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.clientWidth !== sizes.width || canvas.clientHeight !== sizes.height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }

    return needResize
}

tick()
