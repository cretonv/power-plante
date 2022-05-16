import './style.css'
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Case } from "./Case";
import { Indication } from "./Indication";
import { transformMeshToGlass } from "./Glassifier";
import { ObjectViewModal } from "./ObjectViewModal";
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { EyeDropper } from './Eyedropper';
import { Dye, dyeColorEnum } from './Dye';
import { loadSceneBackgroundFromHDR } from './SceneBackgroundLoader';
import { TestTube } from './TestTube';
import { FBXTest } from './FBXTest';



export class Experience2Part3 {
    private controls: OrbitControls
    private camera: THREE.Camera
    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer
    private clock: THREE.Clock
    private test:FBXTest
    


    constructor() {


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
        this.camera.position.z = 1.3563360735759848
        this.scene.add(this.camera)

        /**
         * Controls
         */
        this.controls = controls
        this.controls.enableDamping = false
        this.controls.enabled = true

        /**
         * Objects
         */
        loadSceneBackgroundFromHDR('test.hdr', this.scene)
        this.test = new FBXTest()
        this.test.init(() => {
            //const cubecontrols = new DragControls(eyeDropperElement.object.scene.children, camera, renderer.domElement)
            //console.log(test.object)
           
            //transformMeshToGlass(test.object,'test.hdr')


            // this.scene.add(this.test.object)
            // window.onclick = (event)=>{
            //     const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
            //     this.test.liquidSetNextLayer(()=>{},material)
               
            // }

        }, camera, "/models/alcohol_animation_sam_v-4.fbx")

        /**
         * Lights
         */
        const light = new THREE.AmbientLight(0x404040, 3.4)
        //light.position.set(0.8, 1.4, 1.0)
        this.scene.add(light)
        const light2 = new THREE.SpotLight(0xffffff, 3.4)
        light2.position.set(0.8, 4, 4.0)
        this.scene.add(light2)
        const light3 = new THREE.SpotLight(0xffffff, 3.4)
        light3.position.set(-0.8, 4, 4.0)
        this.scene.add(light3)
        //this.scene.add(new THREE.PlaneHelper(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), 1, 0xffff00));
        // Animate
    }


    anim(tick) {
        // const elapsedTime = clock.getElapsedTime()
        this.test.anim()
        // Check canvas size and resolution

        // Update controls
        this.controls.update()


        // Render
        this.render()

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)

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
