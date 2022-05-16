import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import * as THREE from "three"
import * as TWEEN from "@tweenjs/tween.js";
import {Indication} from "./Indication";
import {ObjectViewModal} from "./ObjectViewModal";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Dye } from "./Dye";
import { TestTube } from "./TestTube";
import { AlcoolBottle } from "./AlcoolBottle";
import { transformMeshToGlass, transformMeshToPlastic } from "./Glassifier";
export class EyeDropper {
    private stateEnum = Object.freeze({
        Empty:"empty",
        RedDye:"redDye",
        Alcool:"alcool",
        YellowDye:"yellowDye",
        BlueDye:"blueDye"
    });
    private isMouseDownOnModel:boolean = false;
    private pointer  = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    public object:THREE.Group
    private modelFileName = 'eyedropper_animation_sam_v-2.fbx';
    private loader:GLTFLoader;
    private plane: THREE.Plane;
    private intersects = new THREE.Vector3();
    private camera: THREE.Camera
    private state = this.stateEnum.Empty
    private redDyeObject:Dye
    private mixer: THREE.AnimationMixer
    private activeAction : THREE.clipAction
    private alcoolBottle:AlcoolBottle
    private tubeObject:TestTube
    private cameraControler:OrbitControls

    constructor() {
        this.loader = new FBXLoader()
       
    }

    init(callback: Function,camera:THREE.Camera,plane:THREE.Plane,redDyeObject:Dye,alcoolBottle:AlcoolBottle,tubeObject:TestTube,cameraControler:OrbitControls) {
        this.camera = camera
        this.cameraControler = cameraControler
        this.plane = plane
        this.alcoolBottle = alcoolBottle
        this.redDyeObject = redDyeObject
        this.tubeObject = tubeObject

        // this.loader.load(
        //     // resource URL
        //     `assets/models/eyedropper/${this.modelFileName}`,
        //     // called when the resource is loaded
        //     (object: THREE.Group) => {
        //         this.object = object
        //         // this.object = objectt
        //         console.log(object)
        //         object.scene.children[0].scale.set(0.01, 0.01, -0.01)
                
        //         callback()
        //     },
        //     // called while loading is progressing
        //     function ( xhr ) {
        
        //         console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        
        //     },
        //     // called when loading has errors
        //     function ( error ) {
        
        //         console.log( 'An error happened' + error );
        
        //     }
        // );
        this.loader.load(
            `assets/models/eyedropper/${this.modelFileName}`,
            (object) => {
                this.object = object
                this.mixer = new THREE.AnimationMixer(object)

                // const animationAction = this.mixer.clipAction(
                //     (object as THREE.Object3D).animations[0]
                // )
                //this.activeAction = animationAction
                object.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        console.log(child)
                        if (child.name == "Pipette") {
                            transformMeshToPlastic(child, 'test.hdr')
                        }
                        else if (child.name.includes("L")) {
                            //this.liquidSample.push(child)
                            child.visible = false
                        }
                        else if (child.name.includes("bouchon")) {
                            
                            child.visible = false

                        }
                    
                    }
                })

                object.scale.set(0.01, 0.01, 0.01)

                object.position.set(0.1, 0.1, 0)
                callback()
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )


        window.addEventListener('mousedown', () => {
            console.log(this.state)
            this.raycaster.set( this.object.position, new THREE.Vector3(0,-1,0) );
            const intersectsDownRed = this.raycaster.intersectObject(this.redDyeObject.object);
            if(intersectsDownRed.length > 0 && this.redDyeObject.capacity>0 && this.state == this.stateEnum.Empty ){
                //triggerranim 
                if(this.redDyeObject.object.position.distanceTo(this.object.position)<0.12){
                this.state = this.stateEnum.RedDye
                this.redDyeObject.removeLiquid()
                this.colorContent(new THREE.MeshBasicMaterial( {color: 0x880000} ))
                }
            }
            this.raycaster.set( this.object.position, new THREE.Vector3(0,-1,0) );
            const intersectsAlcool = this.raycaster.intersectObject(this.alcoolBottle.object);
            
            if(intersectsAlcool.length > 0 && this.alcoolBottle.capacity>0 && this.state == this.stateEnum.Empty ){
                //triggerranim 
                if(this.alcoolBottle.object.position.distanceTo(this.object.position)<0.12){
                    this.state = this.stateEnum.Alcool
                    this.alcoolBottle.removeLiquid()
                    this.colorContent(new THREE.MeshBasicMaterial( {color: 0x000088} ))
                }
            }

            
            this.raycaster.set( this.object.position, new THREE.Vector3(0,-1,0) );
            const intersectsDownTube = this.raycaster.intersectObject(this.tubeObject.object);
            console.log(intersectsDownTube)
            if(intersectsDownTube.length > 0  && this.tubeObject.object.position.distanceTo(this.object.position)<0.12){
                //triggerranim 
                
                switch ( this.state) {
                    case this.stateEnum.RedDye:
                        this.tubeObject.addRed()
                        this.removeAllContent()

                        break
                    case this.stateEnum.Alcool:
                        this.tubeObject.addAlcool()
                        this.removeAllContent()
                        break

                    default:
                        console.log("pipette vide")
                  }
                  this.state = this.stateEnum.Empty
                  

            }

            this.raycaster.setFromCamera( this.pointer, this.camera );
            const intersects = this.raycaster.intersectObjects(this.object.children);
            if (intersects.length > 0 ){
                this.isMouseDownOnModel = true
                this.cameraControler.enabled = false
      
            }
            
        })

        window.addEventListener('mouseup', () => {
            this.isMouseDownOnModel =false
            this.cameraControler.enabled = true
        })

        window.addEventListener( 'pointermove', (e) => {
            // calculate pointer position in normalized device coordinates
            // (-1 to +1) for both components
            //console.log(this.camera)
            this.pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
            this.pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
            console.log()
            if(this.isMouseDownOnModel){
               
                this.raycaster.setFromCamera(this.pointer, this.camera);
                this.raycaster.ray.intersectPlane(this.plane, this.intersects); 
                //console.log(this.intersects)
                //console.log(this.pointer)
                //console.log(this.object.scene.children[0].position)
                // -0.4 is offset to grab on the 
                this.object.position.set(this.intersects.x, this.intersects.y-0.07, this.intersects.z);
            }
        });
    }


    anim() {
       
    }
    removeAllContent(){
        this.object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                console.log(child)
                if (child.name.includes("L")) {
                    //this.liquidSample.push(child)
                    child.visible = false
                }
                
            
            }
        })
    }
    colorContent(material){
        this.object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                console.log(child)
                if (child.name.includes("L")) {
                    //this.liquidSample.push(child)
                    child.visible = true
                    child.material = material
                }
                
            
            }
        })
    }

    setAction() {
    
    }

    destroy() {

    }
}
