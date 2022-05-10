import './style.css'
import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Case} from "./Case";
import {Indication} from "./Indication";
import {transformMeshToGlass} from "./Glassifier";
import {ObjectViewModal} from "./ObjectViewModal";
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { EyeDropper } from './Eyedropper';
import {loadSceneBackgroundFromHDR} from './SceneBackgroundLoader';



const canvas = document.querySelector<HTMLDivElement>('canvas#webgl')!

const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(5))

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
renderer.setClearColor(0xFFFFFF, 1)
renderer.setSize(sizes.width, sizes.height)

/**
* Camera
*/
const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
camera.position.z = 1.3563360735759848
scene.add(camera)

/**
 * Controls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = false
controls.enabled = false 

/**
 * Objects
 */

// Init 2D indications
const points =  [
    {
        position: new THREE.Vector3(-0.1, 0.05, 0.5),
        element: document.querySelector('.indication-0')
    },
    {
        position: new THREE.Vector3(-0.1, 0.11, 0.5),
        element: document.querySelector('.indication-1')
    }
]
const indications = new Indication()
indications.init(points)
loadSceneBackgroundFromHDR('test.hdr',scene)

// Init eye
const eyeDropperElement = new EyeDropper()
eyeDropperElement.init(() => {
    //const cubecontrols = new DragControls(eyeDropperElement.object.scene.children, camera, renderer.domElement)
    transformMeshToGlass(eyeDropperElement.object.scene.children[0],'test.hdr')
    scene.add(eyeDropperElement.object.scene)
},camera,new THREE.Plane(new THREE.Vector3(0, 0, 1), 0))

/**
 * Lights
 */
const light = new THREE.AmbientLight( 0x404040, 3.4 )
//light.position.set(0.8, 1.4, 1.0)
scene.add(light)
scene.add(new THREE.PlaneHelper( new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), 1, 0xffff00 ));
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
