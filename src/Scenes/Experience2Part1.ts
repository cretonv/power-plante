import '../style.css'
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { EyeDropper } from '../Eyedropper';
import { Dye, dyeColorEnum } from '../Dye';
import { loadSceneBackgroundFromHDR } from '../SceneBackgroundLoader';
import { TestTube } from '../TestTube';
import { AlcoolBottle } from '../AlcoolBottle';
import { GlobalLoader } from '../GlobalLoader';
import { ActivityScene } from './ActivityScene';



export class Experience2Part1 extends ActivityScene {
    private controls: OrbitControls
    private camera: THREE.Camera
    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer
    private clock: THREE.Clock
  


    constructor() {
        super()


    }

    init(renderer, controls: OrbitControls, camera: THREE.Camera, clock: THREE.Clock) {


        this.scene = new THREE.Scene()
        this.clock = clock

        /**
         * Renderer
         */
        this.renderer = renderer
        /**
        * Camera
        */
        this.camera = camera
       
        this.scene.add(this.camera)

        /**
         * Controls
         */
        this.controls = controls


        /**
         * Objects
         */
        loadSceneBackgroundFromHDR('hdri_flo_v-2.hdr', this.scene)




        const redDyeElement = new Dye()
        redDyeElement.init(() => {
            redDyeElement.object.position.set(-0.05, 0.0, 0.0)
            this.scene.add(redDyeElement.object)
        }, camera, dyeColorEnum.RedDye)

        const alcoolBottle = new AlcoolBottle()
        alcoolBottle.init(() => {
            this.scene.add(alcoolBottle.object)

        }, camera)


        const testtubeElement = new TestTube()
        testtubeElement.init(() => {
            this.scene.add(testtubeElement.object)
        }, camera,new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),controls)

        // Init pipette
        const eyeDropperElement = new EyeDropper()
        eyeDropperElement.init(() => {
            this.scene.add(eyeDropperElement.object)
        }, camera, new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), redDyeElement, alcoolBottle, testtubeElement, controls)
        
        GlobalLoader.getInstance().getGLTFLoaded('decor',(object)=>{
            object.scale.set(0.005,0.005,0.005)
            object.position.set(0.00,0.00,-0.1)
            this.scene.add(object)
        })


        const geometry = new THREE.BoxGeometry( 0.04, 0.17, 0.0001 );
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.set(-0.15,0.05,0)
        this.scene.add( cube );


        /**
         * Lights
         */
        const light = new THREE.AmbientLight(0xffffff, 1)
        //light.position.set(0.8, 1.4, 1.0)
        this.scene.add(light)
         const light2 = new THREE.SpotLight(0xffffff, 0.1)
         light2.position.set(0.8, 4, 0.20)
         this.scene.add(light2)
        // const light3 = new THREE.SpotLight(0xffffff, 3.4)
        // light3.position.set(-0.8, 4, 4.0)
        // this.scene.add(light3)
       // this.scene.add(new THREE.PlaneHelper(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), 1, 0xffff00));
        // Animate
    }
    setup(){
        this.camera.position.z = 0.4;
        this.camera.position.y = 0.8;
        this.controls.minDistance = 0.35;
        this.controls.maxDistance = 0.65;
        this.controls.enableDamping = true;
        this.controls.enabled = true;
        this.controls.minPolarAngle = Math.PI-Math.PI/2-0.4; 
        this.controls.maxPolarAngle = Math.PI/2-0.1; 
        this.controls.minAzimuthAngle =-0.4;
        this.controls.maxAzimuthAngle = 0.4; 
        this.controls.enablePan = false;    
    }

    anim(tick) {
        // const elapsedTime = clock.getElapsedTime()

        // Check canvas size and resolution


        // Update controls
        this.controls.update()


        // Render
        this.render()

        // Call tick again on the next frame
        //window.requestAnimationFrame(tick)

    }

    render() {
        //this.testtubeElement.anim(tick)
        this.renderer.render(this.scene, this.camera)
    }

    setAction() {

    }

    destroy() {

    }
}
