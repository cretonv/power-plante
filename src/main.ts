import './style.css'
import '../assets/css/main.css'
import {FirstScene} from "./Scenes/FirstScene";
import { BlendFunction, EffectComposer, EffectPass, OutlineEffect, RenderPass } from 'postprocessing';
import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GlobalLoader } from './GlobalLoader';
const canvas = document.querySelector<HTMLDivElement>('canvas#webgl')!
const appGlobalParameters = GlobalLoader.getInstance()

startGame()
function startGame(){
    if (!appGlobalParameters.getLoadState()){
        console.log(appGlobalParameters.getLoadState())
        window.setTimeout(startGame, 400);
        
    }
    else{
        const firstScene = new FirstScene()
        firstScene.init(canvas)
    }

}

// const scene = new THREE.Scene()
// /**
//      * Renderer
//      */
//  const renderer = new THREE.WebGLRenderer({
//     canvas: canvas,
//     powerPreference: "high-performance",
//     antialias: false,
//     stencil: false
// })
// renderer.setClearColor(0xFFFF, 1)
// renderer.setSize(canvas.clientWidth, canvas.clientHeight)
// renderer.autoClear = false;
// renderer.outputEncoding = THREE.sRGBEncoding


// /**
//  * Composer
//  */
// const composer = new EffectComposer(renderer);
// /**
//  * Camera
//  */
// const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
// camera.position.z = 1.3563360735759848
// scene.add(camera)

// /**
//  * Controls
//  */
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true

// /**
//  * Lights
//  */
// const light = new THREE.AmbientLight(0xFFFFFF, 0.3)
// light.position.set(0.44, 0.18, 0.34)
// scene.add(light)




//    const outlineEffect = new OutlineEffect(scene, camera, {
//         blendFunction: BlendFunction.ADD,
//         edgeStrength: 1000,
//         pulseSpeed: 2.0,
//         visibleEdgeColor: 0xFF00FF,
//         hiddenEdgeColor: 0x222200,
//         blur: true,
//         //xRay: true
//     });
//     outlineEffect.resolution.width = canvas.clientWidth
//     outlineEffect.resolution.height = canvas.clientHeight

//     const geometry = new THREE.BoxGeometry( 0.01, 1, 1 );
//     const material = new THREE.MeshBasicMaterial( {color: 0xAA0000} );
//     const testCube = new THREE.Mesh( geometry, material );
//     scene.add( testCube );

//     outlineEffect.selection.add(testCube);
    
//     //const smaaPass = new EffectPass(this.camera, this.smaaEffect);
//     const outlinePass = new EffectPass(camera, outlineEffect);

//     //this.effect = outlineEffect;
//     //this.composer.addPass(new EffectPass(this.camera,this.outlineEffect));
//     //this.outlinePass.setEnabled(this.outlinePass.isEnabled())
//     composer.addPass(new RenderPass(scene, camera));
//     composer.addPass(outlinePass);

//     function tick(){
//         // const elapsedTime = clock.getElapsedTime()

      
//         // Update controls
//         controls.update()


//         // Render
//         composer.render();


//         // Call tick again on the next frame
//         window.requestAnimationFrame(tick)
        
//     }

// tick()
// console.log(composer)