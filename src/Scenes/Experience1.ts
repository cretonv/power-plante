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
import { Exp1Assembly } from '../Exp1Assembly';
import { Battery } from '../Battery';



export class Experience1 extends ActivityScene {
    private clock:THREE.Clock 
    private controls: OrbitControls
    private camera: THREE.Camera
    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer
    private outlineEffect:OutlineEffect
    private composer:EffectComposer
    private outlinePass:EffectPass
    private exp1assembly:Exp1Assembly
    private battery:Battery


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
         * Composer
         */
        const parameters = { format: THREE.RGBAFormat };
        const renderTarget = new THREE.WebGLRenderTarget( GlobalLoader.getInstance().getSizes().width,  GlobalLoader.getInstance().getSizes().height, parameters );
        this.composer = new EffectComposer(this.renderer);
        const plane = new THREE.Plane(new THREE.Vector3(1,0,0.2 ), -0.06)
        //plane.position.set(0.06,0,0)
       this.scene.add(plane);
        /**
         * Objects
         */
        this.exp1assembly = new Exp1Assembly()
        this.exp1assembly.init(() => {
            this.scene.add(this.exp1assembly.object)

        },this.camera, this.controls)

        this.battery =  new Battery()
        this.battery.init(
            ()=>{
                this.scene.add(this.battery.object)

            },
            this.camera,
            plane,
            this.controls,
            this.exp1assembly,
            )
        

        
        loadSceneBackgroundFromHDR('hdri_flo_v-2.hdr', this.scene)  
        
        GlobalLoader.getInstance().getGLTFLoaded('decor',(object)=>{
            object.scale.set(0.01,0.01,0.01)
            object.position.set(0.00,0.00,-0.1)
            this.scene.add(object)
        })

        /**
         * Lights
         */
        const light = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(light)
        const light2 = new THREE.SpotLight(0xffffff, 0.1)
        light2.position.set(0.8, 4, 0.20)
        this.scene.add(light2)

        // Animate
        this.initPostProcessing()
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
        this.outlineEffect.selection
		//const smaaPass = new EffectPass(this.camera, this.smaaEffect);
		this.outlinePass = new EffectPass(this.camera, this.outlineEffect);

		//this.effect = outlineEffect;
        //this.composer.addPass(new EffectPass(this.camera,this.outlineEffect));
        //this.outlinePass.setEnabled(this.outlinePass.isEnabled())
        const renderPass = new RenderPass(this.scene, this.camera)
        this.composer.addPass(renderPass);
        this.composer.addPass(this.outlinePass);
        

    }
    reloadSelectedLayer(){
        console.log("reload")
        this.outlineEffect.selection.set(GlobalLoader.getInstance().getSelectedArray())
    }
    setup(){
        
        this.camera.position.z = 0.6056062446915709;
        this.camera.position.y = 0.22947195647688093;
        this.camera.position.x = -0.05553105060454619;
        this.controls.minDistance = 0.45;
        this.controls.maxDistance = 0.75;
        this.controls.enableDamping = true;
        this.controls.enabled = true;
        this.controls.minPolarAngle = Math.PI-Math.PI/2-0.4; 
        this.controls.maxPolarAngle = Math.PI/2-0.1; 
        this.controls.minAzimuthAngle =-0.4;
        this.controls.maxAzimuthAngle = 0.4; 
        this.controls.enablePan = false;    
        console.log(this.controls.position)
        console.log("setupexp1")
        window.setTimeout(()=>{document.querySelector('body').classList.remove('active');},1000)
        
    }

    anim(tick) {
        TWEEN.update();
        // const elapsedTime = clock.getElapsedTime()

        // Check canvas size and resolution
        this.exp1assembly.anim()

        // Update controls
        this.controls.update()
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

    destroy() {
        console.log("destroy")
        //this.composer.removePass(this.outlinePass)
        // this.exp1assembly.destroy()
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
