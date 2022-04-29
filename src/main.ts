import './style.css'
import * as THREE from "three"
import {Object3D} from "three/src/core/Object3D";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Proton from 'three.proton.js';
const sizes = {
  width: 800,
  height: 600
}
let is_intersecting = false
let display_cube = true
const canvas = document.querySelector<HTMLDivElement>('canvas#webgl')!
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  preserveDrawingBuffer: true,
   antialias: true 
})
var scene = new THREE.Scene();

// Make highly-transparent plane
var fadeMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.02
});
var fadePlane = new THREE.PlaneBufferGeometry(1, 1);
var fadeMesh = new THREE.Mesh(fadePlane, fadeMaterial);

// Create Object3D to hold camera and transparent plane
var camGroup = new THREE.Object3D();
var camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 1000);
camGroup.add(camera);
camGroup.add(fadeMesh);

// Put plane in front of camera
fadeMesh.position.z = -0.1;

// Make plane render before particles
fadeMesh.renderOrder = -1;

// Add camGroup to scene
scene.add(camGroup);

let targets: {[name: string]: THREE.Object3D} = {}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();


renderer.autoClearColor = false;
renderer.setSize(sizes.width, sizes.height);

document.addEventListener('DOMContentLoaded', function () {   
    document.body.appendChild(renderer.domElement);
});

var geometry = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial({color: 0xffffff});
var cube = new THREE.Mesh(geometry, material);
if (display_cube){
  scene.add(cube);
}

cube.position.z = -5;

var step = .03;
function animate(){
   // console.log(cube.position.x)
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.02;
    cube.position.x += step;
    cube.visible = display_cube
    if(Math.abs(cube.position.x) > 10.0)
    {
        step = -step;
    }
    raycaster.setFromCamera( pointer, camera );
    // calculate objects intersecting the picking ray
    // let intersects

    const intersects = raycaster.intersectObjects([cube]);
    if(intersects.length>0){
      is_intersecting = true
    }
    else{
      is_intersecting = false
    }
    console.log(display_cube)

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

animate();

window.addEventListener( 'pointermove', onPointerMove );
function onPointerMove( event ) {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    pointer.x = ( event.clientX / sizes.width ) * 2 - 1;
    pointer.y = - ( event.clientY / sizes.height ) * 2 + 1;

}

window.addEventListener( 'click', suppressParticle );
function suppressParticle( event ) {

    if(is_intersecting){
        display_cube=false
    }
}

