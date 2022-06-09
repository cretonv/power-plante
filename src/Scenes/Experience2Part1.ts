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
import { EyedropperSupport } from '../EyedropperSupport';
import {  BlendFunction, EffectComposer, EffectPass, OutlineEffect, RenderPass } from 'postprocessing';
import * as TWEEN from "@tweenjs/tween.js";
import { CAB } from '../CAB';
import { Loupe } from '../Loupe';



export class Experience2Part1 extends ActivityScene {
    private controls: OrbitControls
    private camera: THREE.Camera
    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer
     //Postprocessing
     private outlineEffect:OutlineEffect
     private composer:EffectComposer
     //private selectedObject:Array<THREE.Object3D> = []
     private outlinePass:EffectPass
     private cab:CAB
     private loupe:Loupe
     private eyedropper:EyeDropper
     private testtube:TestTube
     private eyeDropperSupport:EyedropperSupport


    constructor() {
        super()


    }

    init(renderer, controls: OrbitControls, camera: THREE.Camera) {


        this.scene = new THREE.Scene()

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
         * Composer
         */
        this.composer = new EffectComposer(this.renderer);

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

        })



        const geometry = new THREE.BoxGeometry( 0.04, 0.1, 0.0001 );
        const material = new THREE.MeshBasicMaterial( {
            color: 0x000000,
            transparent: true,
            opacity: 0.0
        } );
        const testube_drop_zone = new THREE.Mesh( geometry, material );
        testube_drop_zone.visible = false
        testube_drop_zone.position.set(0.35,0.05,0)
        this.scene.add( testube_drop_zone );

        this.testtube  = new TestTube()
        this.testtube.init(() => {
            this.scene.add(this.testtube.object)
        }, camera,controls,new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),controls,testube_drop_zone)

        this.eyeDropperSupport= new EyedropperSupport()
        this.eyeDropperSupport.init(() => {
            this.scene.add(this.eyeDropperSupport.object)
        }, camera, controls)


        this.loupe = new Loupe()

        this.cab = new CAB()

        this.cab.init(()=>{
            this.cab.object.position.set(0.55, 0.0, -0.058)
            this.cab.object.rotation.set(0.55, 0.0, 0.0)
            this.scene.add(this.cab.object)
        },this.camera,this.loupe)


        this.loupe.init(() => {
            // loupe.object.position.set(0.7, 0.0, 0)
            this.loupe.object.rotation.set(0, 0, 0)
            this.scene.add(this.loupe.object)
        }, camera, new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),this.controls,this.cab.object.getObjectByName("GLASS_dome"))


        // Init pipette
        this.eyedropper = new EyeDropper()
        this.eyedropper.init(() => {
            this.scene.add(this.eyedropper.object)
        }, camera, new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), redDyeElement, alcoolBottle, this.testtube, controls, this.eyeDropperSupport,this.cab)

        GlobalLoader.getInstance().getGLTFLoaded('decor',(object)=>{
            object.scale.set(0.01,0.01,0.01)
            object.position.set(0.00,0.00,-0.1)
            this.scene.add(object)
        })







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
        this.initPostProcessing()
        this.outlineEffect.selection.add(testube_drop_zone);


    }
    initPostProcessing  = () => {
        this.outlineEffect = new OutlineEffect(this.scene, this.camera, {
            blendFunction: BlendFunction.ADD,
            edgeStrength: 1000,
            pulseSpeed: 0.64,
            visibleEdgeColor: 0xee00ee,
            hiddenEdgeColor: 0x550055,
            blur: true,

			//blur: false,
			//xRay: true
		});
        this.outlineEffect.resolution.width = GlobalLoader.getInstance().getSizes().width
        this.outlineEffect.resolution.height = GlobalLoader.getInstance().getSizes().height

		//this.outlineEffect.selection.add(this.testCube);

		//const smaaPass = new EffectPass(this.camera, this.smaaEffect);
		this.outlinePass = new EffectPass(this.camera, this.outlineEffect);

		//this.effect = outlineEffect;
        //this.composer.addPass(new EffectPass(this.camera,this.outlineEffect));
        //this.outlinePass.setEnabled(this.outlinePass.isEnabled())
        const renderPass = new RenderPass(this.scene, this.camera)
        this.composer.addPass(renderPass);
        this.composer.addPass(this.outlinePass);



    }
    setup(){
        //document.querySelector('body').classList.remove('active');
        this.camera.position.z = 0.6056062446915709;
        this.camera.position.y = 0.22947195647688093;
        this.camera.position.x = -0.05553105060454619;
        this.controls.minDistance = 0.35;
        this.controls.maxDistance = 0.65;
        this.controls.enableDamping = true;
        this.controls.enabled = true;
        this.controls.minPolarAngle = Math.PI-Math.PI/2-0.4;
        this.controls.maxPolarAngle = Math.PI/2-0.1;
        this.controls.minAzimuthAngle =-0.4;
        this.controls.maxAzimuthAngle = 0.4;
        this.controls.enablePan = false;
        console.log(this.controls.position)
        window.setTimeout(()=>{
            document.querySelector('body').classList.remove('active')
            GlobalLoader.getInstance().setMascotVisible()
            GlobalLoader.getInstance().setMascotChangeQuote(12)
            GlobalLoader.getInstance().setSelectedArray([this.eyedropper.object.children[1].children[0],this.eyeDropperSupport.object.children[0]])

        },1100)
        console.log(this.testtube)


    }

    anim() {
        TWEEN.update();
        // const elapsedTime = clock.getElapsedTime()

        // Check canvas size and resolution


        // Update controls
        this.controls.update()
        GlobalLoader.getInstance().getIndications().anim(this.camera, this.scene)
        //console.log(this.camera.position)


        // Render
        this.render()



        // Call tick again on the next frame
        //window.requestAnimationFrame(tick)

    }

    render() {
        //this.testtubeElement.anim(tick)
        this.composer.render();
        //this.renderer.render(this.scene, this.camera)
    }

    setAction() {

    }
    reloadSelectedLayer(){
        console.log("reload")
        this.outlineEffect.selection.set(GlobalLoader.getInstance().getSelectedArray())
        console.log(GlobalLoader.getInstance().getSelectedArray())
        console.log(this.outlineEffect.selection)
    }
    destroy() {
        console.log("destroy")
        //this.composer.removePass(this.outlinePass)
        this.cab.destroy()
        this.loupe.destroy()
        this.eyedropper.destroy()
        this.testtube.destroy()
        // this.scene.traverse((child) => {
        //     if(child instanceof THREE.Mesh){
        //         child.geometry.dispose()

        //         for(const key in child.material){
        //             const value = child.material[key]

        //             if (value && typeof value.dispose === 'function'){
        //                 value.dispose()
        //             }
        //         }
        //     }
        // })
    }
}
