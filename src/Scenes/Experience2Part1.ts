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
            redDyeElement.object.position.set(-0.1, 0.0, 0.0)
            this.scene.add(redDyeElement.object)
        }, camera, dyeColorEnum.RedDye)

        const alcoolBottle = new AlcoolBottle()
        alcoolBottle.init(() => {
            this.scene.add(alcoolBottle.object)

        }, camera)


        const testtubeElement = new TestTube()
        testtubeElement.init(() => {
            this.scene.add(testtubeElement.object)
        }, camera)

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


        /**
         * Lights
         */
        const light = new THREE.AmbientLight(0x404040, 3.4)
        //light.position.set(0.8, 1.4, 1.0)
        this.scene.add(light)
         const light2 = new THREE.SpotLight(0xffffff, 0.4)
         light2.position.set(0.8, 4, 0.20)
         this.scene.add(light2)
        // const light3 = new THREE.SpotLight(0xffffff, 3.4)
        // light3.position.set(-0.8, 4, 4.0)
        // this.scene.add(light3)
       // this.scene.add(new THREE.PlaneHelper(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), 1, 0xffff00));
        // Animate
    }
    setup(){
        this.camera.position.z = 0.5
        this.camera.position.y = 0.1
        this.controls.minDistance = 0.35;
        this.controls.maxDistance = 0.65;
        this.controls.enableDamping = true
        this.controls.enabled = true
        this.controls.minPolarAngle = Math.PI-Math.PI/2-0.4; // radians
        this.controls.maxPolarAngle = Math.PI/2-0.1; // radians
        this.controls.minAzimuthAngle =-0.4 // radians
        this.controls.maxAzimuthAngle = 0.4; // radians
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
