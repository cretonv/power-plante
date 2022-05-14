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



export class Experience2Part2 {
    private controls: OrbitControls
    private camera: THREE.Camera
    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer
    private clock: THREE.Clock


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
        this.controls.enabled = false

        /**
         * Objects
         */
        loadSceneBackgroundFromHDR('test.hdr', this.scene)




        const redDyeElement = new Dye()
        redDyeElement.init(() => {
            //const cubecontrols = new DragControls(eyeDropperElement.object.scene.children, camera, renderer.domElement)
            //transformMeshToGlass(eyeDropperElement.object.scene.children[0],'test.hdr')
            redDyeElement.object.scene.scale.set(0.1, 0.1, 0.1)
            redDyeElement.object.scene.position.set(-0.1, 0.0, 0.0)
            //this.scene.add(redDyeElement.object.scene)
        }, camera, dyeColorEnum.RedDye)

        const yellowDyeElement = new Dye()
        yellowDyeElement.init(() => {
            //const cubecontrols = new DragControls(eyeDropperElement.object.scene.children, camera, renderer.domElement)
            //transformMeshToGlass(eyeDropperElement.object.scene.children[0],'test.hdr')
            yellowDyeElement.object.scene.scale.set(0.1, 0.1, 0.1)
            yellowDyeElement.object.scene.position.set(0.2, 0.0, 0.0)
            //this.scene.add(yellowDyeElement.object.scene)
        }, camera, dyeColorEnum.YellowDye)

        const blueDyeElement = new Dye()
        blueDyeElement.init(() => {
            //const cubecontrols = new DragControls(eyeDropperElement.object.scene.children, camera, renderer.domElement)
            //transformMeshToGlass(eyeDropperElement.object.scene.children[0],'test.hdr')
            blueDyeElement.object.scene.scale.set(0.1, 0.1, 0.1)
            blueDyeElement.object.scene.position.set(-0.4, 0.0, 0.0)
            this.scene.add(blueDyeElement.object.scene)
        }, camera, dyeColorEnum.BlueDye)



        const testtubeElement = new TestTube()
        testtubeElement.init(() => {
            //const cubecontrols = new DragControls(eyeDropperElement.object.scene.children, camera, renderer.domElement)
            transformMeshToGlass(testtubeElement.object.scene.children[0].children[1], 'test.hdr')
            console.log(testtubeElement.object.scene.children[0].children[1])
            // redDyeElement.object.position.set(1.0,1.0,1.0)
            this.scene.add(testtubeElement.object.scene)
        }, camera)

        // Init eye
        const eyeDropperElement = new EyeDropper()
        eyeDropperElement.init(() => {
            //const cubecontrols = new DragControls(eyeDropperElement.object.scene.children, camera, renderer.domElement)
            transformMeshToGlass(eyeDropperElement.object.scene.children[0], 'test.hdr')
            this.scene.add(eyeDropperElement.object.scene)
        }, camera, new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), redDyeElement, yellowDyeElement, blueDyeElement, testtubeElement, controls)



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
        this.scene.add(new THREE.PlaneHelper(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), 1, 0xffff00));
        // Animate
    }


    anim(tick) {
        // const elapsedTime = clock.getElapsedTime()

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
