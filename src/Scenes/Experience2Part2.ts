import '../style.css'
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { EyeDropper } from '../Eyedropper';
import { Dye, dyeColorEnum } from '../Dye';
import { loadSceneBackgroundFromHDR } from '../SceneBackgroundLoader';
import { TestTube } from '../TestTube';
import { AlcoolBottle } from '../AlcoolBottle';
import { GlobalLoader, landingName } from '../GlobalLoader';
import { ActivityScene } from './ActivityScene';
import { Uranium } from '../Uranium';
import { BlendFunction, BlendMode, EffectComposer, EffectMaterial, EffectPass, OutlineEffect, RenderPass } from 'postprocessing';
import { Particle } from '../Particle';
import {TestTube2D} from "../TestTube2D";



export class Experience2Part2 extends ActivityScene {
    private controls: OrbitControls
    private camera: THREE.Camera
    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer
    private clock: THREE.Clock
    private uranium: Uranium
    private pointer  = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    //private cube:THREE.Mesh
    private fadeMesh:THREE.Mesh
    private ParticleArray : Array<Particle> =[]
    private outlineEffect:OutlineEffect
    private composer:EffectComposer
    private camGroup: THREE.Object3D
    //private selectedObject:Array<THREE.Object3D> = []
    private outlinePass:EffectPass
    private step:number
    private particleColor1 = new THREE.MeshStandardMaterial({color: 0xffff58})
    private particleColor2 = new THREE.MeshStandardMaterial({color: 0xFF5858})
    private particleColor3 = new THREE.MeshStandardMaterial({color: 0xff58ee})
    private particuleClickedState =[0,0,0]
    private transiHasBeenDone = false
    private alphaTestTube: TestTube2D
    private betaTestTube: TestTube2D
    private gamaTestTube: TestTube2D


    constructor() {
        super()

    }

    init(renderer, controls: OrbitControls, camera: THREE.Camera, clock: THREE.Clock) {
        console.log("nouvellescene")
        this.controls =controls
        let is_intersecting = false
        let display_cube = true
        this.clock = clock
        this.renderer = renderer
        this.scene = new THREE.Scene();

        // Make highly-transparent plane
        var fadeMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.1
        });
        var fadePlane = new THREE.PlaneBufferGeometry(100, 100);
        var fadeMesh = new THREE.Mesh(fadePlane, fadeMaterial);

        // Create Object3D to hold camera and transparent plane
        this.camGroup = new THREE.Object3D();
        const sizes = {
            width: 800,
            height: 600
          }

            document.body.appendChild(this.renderer.domElement);


        this.camera =  camera
        this.camGroup.add(this.camera);
        this.camGroup.add(fadeMesh);

        // Put plane in front of camera
        fadeMesh.position.z = -9.1;

        // Make plane render before particles
        fadeMesh.renderOrder = -1;

        // Add camGroup to scene
        this.scene.add(this.camGroup);

        let targets: {[name: string]: THREE.Object3D} = {}

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        // Init Test Tube 2D for each component
        this.gamaTestTube = new TestTube2D()
        this.gamaTestTube.init('tube-gama')
        this.alphaTestTube = new TestTube2D()
        this.alphaTestTube.init('tube-alpha')
        this.betaTestTube = new TestTube2D()
        this.betaTestTube.init('tube-beta')

        //renderer.autoClearColor = false;

        // var geometry = new THREE.BoxGeometry(1,1,1);
        // var material = new THREE.MeshBasicMaterial({color: 0xf045ff});
        // this.cube = new THREE.Mesh(geometry, material);
        // if (display_cube){
        // this.scene.add(this.cube);
        // }

       // this.cube.position.z = -10;

        this.step = .03;
        //console.log(this.scene)
        this.uranium = new Uranium()
        this.uranium.init(()=>{
            this.scene.add(this.uranium.object)
            this.uranium.object.position.set(0.0,0.0,-5.0)

            this.uranium.object.children[0].material = new THREE.MeshStandardMaterial();
            this.uranium.object.children[0].material.color = new THREE.Color(0.293333333333334,1.0,0.15999999999999998)
                this.uranium.object.children[0].material.roughnessFactor = 0.5
                this.uranium.object.children[0].material.emissiveFactor = new THREE.Color(0.4179999999999997,1.0,0.030000000000000028)


        },this.clock)

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
           //this.scene.add(new THREE.PlaneHelper(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), 1, 0xffff00));
           // Animate
           this.createParticle()

           window.addEventListener('mousedown', () => {

            this.raycaster.setFromCamera( this.pointer, this.camera );
            const intersects = this.raycaster.intersectObjects(this.ParticleArray.map(x=>x.object));
            if(intersects.length > 0 ){
                
                intersects[0].object.visible =false
                switch(intersects[0].object.material) {
                    case this.particleColor1:
                        this.particuleClickedState[0]+=1
                        this.alphaTestTube.changeValue(this.particuleClickedState[0])
                        break;

                    case this.particleColor2:
                        this.particuleClickedState[1]+=1
                        this.betaTestTube.changeValue(this.particuleClickedState[1])
                        break;

                    case this.particleColor3:
                        this.particuleClickedState[2]+=1
                        this.gamaTestTube.changeValue(this.particuleClickedState[2])
                        break;


                }
            }
            if (this.particuleClickedState[0]>9 && this.particuleClickedState[1]>9 && this.particuleClickedState[2]>9 && !this.transiHasBeenDone){
                this.transiHasBeenDone = true
                window.setTimeout(() => {
                    document.querySelector('body').classList.add('active');
                    setTimeout(() => {
                        
                        document.querySelector('.tubes-line').classList.add('hidden')   
                        GlobalLoader.getInstance().setNextScene(landingName)
                        setTimeout(() => {
        
                            this.controls.enabled = false
                            this.controls.minDistance = -Infinity;
                            this.controls.maxDistance = Infinity;
                            this.controls.enableDamping = true;
                            this.controls.minPolarAngle = -Infinity;
                            this.controls.maxPolarAngle = Infinity;
                            this.controls.minAzimuthAngle = -Infinity;
                            this.controls.maxAzimuthAngle = Infinity;
                            this.controls.enablePan = true;
                            this.controls.target.set(0, 0, 0)
                            GlobalLoader.getInstance().notifyTransitionDone()
                            console.log("ontransi")
                            
                        }, 700)
                    }, 700)
                }, 10000)
            }
            console.log(this.particuleClickedState)
        })

        // window.addEventListener('mouseup', () => {
        //     this.isMouseDownOnModel =false
        //     this.cameraControler.enabled = true
        //

        window.addEventListener( 'pointermove', (e) => {
            // calculate pointer position in normalized device coordinates
            // (-1 to +1) for both components
            //console.log(this.camera)
            this.pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
            this.pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;


        });
    }


    setup(){
        this.camGroup.position.set(0,0,0)
        this.camera.position.set(0,0,0)
        this.controls.enabled = true
        //document.querySelector('body').classList.remove('active');
        //this.renderer.resetState()
        this.renderer.setClearColor(new THREE.Color( 0x00000 ),1.0)
        //this.renderer.preserveDrawingBuffer = true;
       // this.renderer.setClearAlpha(0.0)
        //this.renderer.autoClearDepth = false;
        //this.renderer.autoClearColor = false;

        window.setTimeout(()=>{
            document.querySelector('body').classList.remove('active');
            document.querySelector('.tubes-line').classList.remove('hidden')
        },1000)
        
    }

    anim() {
        this.uranium.anim()
        this.ParticleArray.forEach((e)=>{
            if(e.particleIsOnScreen){
                e.anim()
            }
            else{
                e.destroy()
                const index = this.ParticleArray.indexOf(e, 0);
                if (index > -1) {
                    this.ParticleArray.splice(index, 1);
                }
            }

        })

        // Render
        this.render()
        //console.log(this.renderer)

    }

    render() {
        //console.log("onélà")
        //this.testtubeElement.anim(tick)
        //console.log(this.renderer)
        this.renderer.clear()

        this.controls.update()
        this.renderer.render(this.scene, this.camera)

       //this.composer.render();
       //console.log(this.composer)
    }

    setAction() {

    }

    destroy() {


    }

    createParticle = () =>{
        //console.log("onélà")

        let particle = new Particle()
        particle.init(()=>{
            particle.object.position.set(0.0,0.0,-12.0)
            var r = Math.floor(Math.random() * 3);
            // console.log( particle.object)
            switch(r) {
                case 0:
                    particle.object.children[0].material = this.particleColor1
                    break;

                case 1:
                    particle.object.children[0].material = this.particleColor2

                    break;

                case 2:
                    particle.object.children[0].material = this.particleColor3

                    break;

            }
            particle.MoveVector = new THREE.Vector2(Math.round((Math.random()-0.5)/10*100)/100,Math.round((Math.random()-0.5)/10*100)/100)
            this.scene.add(particle.object)
        },this.clock)
        this.ParticleArray.push(particle)
        const myTimeout = setTimeout(this.createParticle, 850);

    }
}
