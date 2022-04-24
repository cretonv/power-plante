import './style.css'
import * as THREE from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const canvas = document.querySelector<HTMLDivElement>('canvas#webgl')!

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

let activeAction: THREE.AnimationAction
let lastAction: THREE.AnimationAction
let mixer: THREE.AnimationMixer

let modelReady = false




const pointer = new THREE.Vector2();


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


const loader = new FBXLoader()


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


var listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
var sound = new THREE.Audio( listener );
//trigger sound
document.querySelector<HTMLDivElement>('.btn-default')?.addEventListener('click', (e) => {
  sound.play();
})
var audioLoader = new THREE.AudioLoader();

//Load a sound and set it as the Audio object's buffer
audioLoader.load( 'assets/sounds/tick.mp3', function( buffer ) {
    sound.setBuffer( buffer );
    sound.setLoop(false);
    sound.setVolume(0.5);
    //sound.play();
},
            // onProgress callback
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },

            // onError callback
            function ( err ) {
                console.log( 'Un error ha ocurrido' );
            }

);

var sound2 = new THREE.Audio( listener );
//trigger sound
document.querySelector<HTMLDivElement>('.btn-default')?.addEventListener('click', (e) => {
  sound.play();
})
var audioLoader = new THREE.AudioLoader();

//Load a sound and set it as the Audio object's buffer
audioLoader.load( 'assets/sounds/sample1.ogg', function( buffer ) {
    sound2.setBuffer( buffer );
    sound2.setLoop(true);
    sound2.setVolume(0.1);
    sound2.play();
},
            // onProgress callback
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },

            // onError callback
            function ( err ) {
                console.log( 'Un error ha ocurrido' );
            }

);
// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    // const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // if (modelReady) mixer.update(clock.getDelta())

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
    renderer.render(scene, camera)
}

document.querySelector<HTMLDivElement>('#webgl')?.addEventListener('mousemove', (event) => {
    // console.log(event.clientX / 500)
    // console.log(activeAction.getClip().duration)
    // console.log(event.target?.clienWidth)

    if (modelReady) mixer.setTime((event.clientX * activeAction.getClip().duration) / (event.target as HTMLCanvasElement).clientWidth )
})

function onPointerMove( event ) {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

tick()
