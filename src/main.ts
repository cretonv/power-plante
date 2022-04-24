import './style.css'
import * as THREE from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

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
 * Built-in arrows
 */

const dir = new THREE.Vector3( -1, 4, 1 );

//normalize the direction vector (convert to vector of length 1)
dir.normalize();

const origin = new THREE.Vector3( 0, 0, 0 );
const length = 3;
const hex = 0xffff00;

const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
scene.add( arrowHelper );

/**
 * Built-in Line
 */

const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x000000
});

const points = [];
points.push( new THREE.Vector3( 0, 0, 0 ) );
points.push( new THREE.Vector3( 1, 1, -2 ) );
points.push( new THREE.Vector3( 3, 2, 0 ) );

const geometry = new THREE.BufferGeometry().setFromPoints( points );

const line = new THREE.Line( geometry, lineMaterial );
scene.add( line );

const circleGeometry = new THREE.CircleGeometry( 0.2,  30);
const circleMaterial = new THREE.MeshBasicMaterial( { color: 'blue', transparent: true } );
const circle = new THREE.Mesh( circleGeometry, circleMaterial );
circle.position.setX(1)
circle.position.setY(1)
scene.add( circle );

/**
 * Shape geometry
 */

const square = new THREE.Shape();
square.moveTo(0.2, 0.2);
square.lineTo(0.2, -0.2);
square.lineTo(-0.2, -0.2);
square.lineTo(-0.2, 0.2);
const squareGeometry = new THREE.ShapeGeometry(square);
const squareMaterial = new THREE.MeshBasicMaterial({
    color: 'purple',
    side: THREE.DoubleSide,
    depthWrite: false
});
const squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
scene.add(squareMesh);

const diamond = new THREE.Shape();
diamond.moveTo(0, 1.2);
diamond.lineTo(0.2, 1);
diamond.lineTo(0, 0.8);
diamond.lineTo(-0.2, 1);
const diamondGeometry = new THREE.ShapeGeometry(diamond);
const diamondMaterial = new THREE.MeshBasicMaterial({
    color: 'red',
    side: THREE.DoubleSide,
    depthWrite: false
});
const diamondMesh = new THREE.Mesh(diamondGeometry, diamondMaterial);
scene.add(diamondMesh);

/**
 * Text
 */

const fontLoader = new FontLoader();

fontLoader.load( 'assets/fonts/test_font.json', function ( font ) {

    const textGeometry = new TextGeometry( 'Hello three.js!', {
        font: font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
    } );
    const textMaterial = new THREE.MeshBasicMaterial({
        color: 'black',
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    textMesh.scale.set(0.001, 0.001, 0.001)
    textMesh.position.setX(0.3)
    scene.add(textMesh)
} );

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
        // scene.add(object)
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

document.querySelector<HTMLDivElement>('.btn-default')?.addEventListener('click', () => {
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
