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
import { Uranium } from '../Uranium';
import { BlendFunction, BlendMode, EffectComposer, EffectMaterial, EffectPass, OutlineEffect, RenderPass } from 'postprocessing';



export class Experience2Part2 extends ActivityScene {
    private controls: OrbitControls
    private camera: THREE.Camera
    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer
    private clock: THREE.Clock
    private uranium: Uranium
    private cube:THREE.Mesh
    private fadeMesh:THREE.Mesh

    private outlineEffect:OutlineEffect
    private composer:EffectComposer
    //private selectedObject:Array<THREE.Object3D> = []
    private outlinePass:EffectPass
    


    constructor() {
        super()


    }

    init(renderer, controls: OrbitControls, camera: THREE.Camera, clock: THREE.Clock) {


        // renderer.dispose()
        // renderer = null
        // console.log(GlobalLoader.getInstance().getCanvas())
        // console.log(renderer)
        this.scene = new THREE.Scene()
        this.clock = clock


        var fadeMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.1,
            side:THREE.DoubleSide
        });
        var fadePlane = new THREE.PlaneGeometry(100, 100);
        var material = new THREE.MeshBasicMaterial({color: 0xfff00f,side:THREE.DoubleSide});

        this.fadeMesh = new THREE.Mesh(fadePlane, fadeMaterial);
        
        // Put plane in front of camera
        this.fadeMesh.position.z = -0.1;
        
        //this.fadeMesh.DoubleSide = true

        // Make plane render before particles
        this.fadeMesh.renderOrder = -1;
        /**
         * Renderer
         */
        // var canva = document.getElementById('webgl');
        // canva.remove()
        // var newcanva = document.createTextNode("Tutorix is the best e-learning platform");
        // document.appendChild(text);
        this.renderer = renderer
        //this.renderer.setAutoClearColor(false)
        
        /**
        * Camera
        */
        this.camera = new THREE.PerspectiveCamera(75,GlobalLoader.getInstance().getSizes().width/GlobalLoader.getInstance().getSizes().height, 0.01, 1000)

        var camGroup = new THREE.Object3D();
        camGroup.add(this.camera);
        camGroup.add(this.fadeMesh);
        //this.scene.add(this.camera)

        this.scene.add(camGroup);
        /**
         * Controls
         */
        this.controls = controls
        /**
         * Objects
         */
        //loadSceneBackgroundFromHDR('hdri_flo_v-2.hdr', this.scene)



        

        /**
         * Composer
         */
         this.composer = new EffectComposer(this.renderer);



        this.uranium = new Uranium()
        this.uranium.init(()=>{
            this.scene.add(this.uranium.object)
            this.uranium.object.position.set(0.0,0.0,-5.0)
            console.log(this.uranium.object.children[0].material)
            this.uranium.object.children[0].material = new THREE.MeshPhongMaterial();
            this.uranium.object.children[0].material.color = new THREE.Color(0.293333333333334,
                1.0,
                0.15999999999999998)
                this.uranium.object.children[0].material.roughnessFactor = 0.5
                this.uranium.object.children[0].material.emissiveFactor = new THREE.Color(0.4179999999999997,
                    1.0,
                    0.030000000000000028)


            console.log(this.uranium.object.children[0].material)

        },this.clock)
        this.initPostProcessing()
       
        //this.scene.add(this.cube)
      
        
        var geometry = new THREE.BoxGeometry(1,1,1);

        var material = new THREE.MeshBasicMaterial({color: 0xf00fff});
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.position.z = -5;
        this.cube.position.x = 0;
        this.cube.position.y = 0;
        this.scene.add(this.cube)

        /**
         * Lights
         */
        const light = new THREE.AmbientLight(0xfffffff, 0.2)
        light.position.set(0.8, 1.4, 1.0)
        this.scene.add(light)
         const light2 = new THREE.SpotLight(0xeeeeee, 0.8)
         light2.position.set(4, 4, 0.08)
        this.scene.add(light2)

        const light3 = new THREE.SpotLight(0xffffff, 0.4)
        light3.position.set(-0.8, -1, 4.0)
        this.scene.add(light3)
        this.scene.add(new THREE.PlaneHelper(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), 1, 0xffff00));
        // Animate
    }

    initPostProcessing  = () => {
        this.outlineEffect = new OutlineEffect(this.scene, this.camera, {
            blendFunction: BlendFunction.ADD,
            edgeStrength: 2,
            pulseSpeed: 0.1,
            visibleEdgeColor: 0x00ee00,
            hiddenEdgeColor: 0x00ee00,
            blur: true,
		
			//blur: false,
			//xRay: true
		});
        this.outlineEffect.resolution.width = GlobalLoader.getInstance().getSizes().width
        this.outlineEffect.resolution.height = GlobalLoader.getInstance().getSizes().height

		this.outlineEffect.selection.add(this.uranium.object.children[0]);
        
		//const smaaPass = new EffectPass(this.camera, this.smaaEffect);
		this.outlinePass = new EffectPass(this.camera, this.outlineEffect);

		//this.effect = outlineEffect;
        //this.composer.addPass(new EffectPass(this.camera,this.outlineEffect));
        //this.outlinePass.setEnabled(this.outlinePass.isEnabled())
        
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.composer.addPass(this.outlinePass);
        

    }
    setup(){
        //this.renderer.resetState()
        //this.renderer.setClearColor(new THREE.Color( 0x000000 ),1)
        //this.renderer.preserveDrawingBuffer = true;
        //this.renderer.setClearAlpha(0.0)
        //this.renderer.autoClearDepth = false;
        //this.renderer.autoClearColor = false;
        //this.renderer.forceContextLoss()
        //this.renderer.forceContextRestore()

        // this.renderer.clear(false,false,false)
        // this.renderer.resetGLState()
        // this.renderer.autoClearStencil = false;
        // this.renderer.clear.color = false
        // this.renderer.clear.depth = false
        // this.renderer.clear.stencil = false

        
        //this.renderer.autoClearColor = false;
        //this.renderer.autoClear = false
        //this.camera.position.z = -1.0;
        //this.camera.position.y = 0.0;
        //this.camera.position.x = 0.0;
       
        this.controls.enableDamping = false;
        this.controls.enabled = false;
        this.controls.enablePan = false;    
    }

    anim() {
        console.log(this.scene)
        this.cube.position.x += 0.05;
        // const elapsedTime = clock.getElapsedTime()

        // Check canvas size and resolution
        this.uranium.anim()

        // Update controls
        this.controls.update()


        // Render
        this.render()

        // Call tick again on the next frame
        //window.requestAnimationFrame(tick)

    }

    render() {
        //console.log("onélà")
        //this.testtubeElement.anim(tick)
        //console.log(this.renderer)
        this.renderer.render(this.scene, this.camera)
       
       //this.composer.render();
       //console.log(this.composer)
    }

    setAction() {

    }

    destroy() {

    }
}
