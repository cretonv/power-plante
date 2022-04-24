import './style.css'
import * as THREE from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Object3D} from "three/src/core/Object3D";

const canvas = document.querySelector<HTMLDivElement>('canvas#webgl')!

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

let activeAction: THREE.AnimationAction
let lastAction: THREE.AnimationAction
let mixer: THREE.AnimationMixer

let modelReady = false

let targets: {[name: string]: THREE.Object3D} = {}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

const light = new THREE.PointLight()
light.position.set(0.8, 1.4, 1.0)
scene.add(light)

const loader = new FBXLoader()
loader.load(
    'assets/models/capoeira.fbx',
    (object) => {

        mixer = new THREE.AnimationMixer(object)
        const animationAction = mixer.clipAction(
            (object as THREE.Object3D).animations[0]
        )
        activeAction = animationAction
        modelReady = true

        object.traverse(function (child) {
             if ((child as THREE.Mesh).isMesh) {
                 targets[child.name] = child
                 // (child as THREE.Mesh).material = material
                /* if ((child as THREE.Mesh).material) {
                    ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
                } */
            }
        })
        object.scale.set(0.01, 0.01, 0.01)

        object.position.set(0, 0, 0)
        scene.add(object)
        renderer.render(scene, camera)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setClearColor(0xffffff, 1)
renderer.setSize(sizes.width, sizes.height)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

document.querySelector<HTMLDivElement>('.btn-default')?.addEventListener('click', (e) => {
    activeAction.play()
})

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    // const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    if (modelReady) mixer.update(clock.getDelta())

    // Render
    render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

const setAction = (toAction: THREE.AnimationAction) => {
    if (toAction != activeAction) {
        lastAction = activeAction
        activeAction = toAction
        lastAction.stop()
        //lastAction.fadeOut(1)
        activeAction.reset()
        //activeAction.fadeIn(1)
        activeAction.play()
    }
}

function render() {
    raycaster.setFromCamera( pointer, camera );
    // calculate objects intersecting the picking ray
    // let intersects
    if (modelReady) {
        const intersects = raycaster.intersectObjects(Object.values(targets));
        console.log(intersects.length)
        for ( let i = 0; i < intersects.length; i ++ ) {
            ((intersects[ i ].object as THREE.Mesh).material as THREE.MeshPhongMaterial).color.set( 0xff0000 );
        }
    }
    renderer.render(scene, camera)
}

window.addEventListener( 'pointermove', onPointerMove );
function onPointerMove( event ) {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

tick()
