import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import * as THREE from "three"
import * as TWEEN from "@tweenjs/tween.js";
import {Indication} from "./Indication";
import {ObjectViewModal} from "./ObjectViewModal";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Dye } from "./Dye";
import { TestTube } from "./TestTube";
export class EyeDropper {
    private stateEnum = Object.freeze({
        Empty:"empty",
        RedDye:"redDye",
        YellowDye:"yellowDye",
        BlueDye:"blueDye"
    });
    private isMouseDownOnModel:boolean = false;
    private pointer  = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    public object:THREE.Group
    private modelFileName = 'eyedropper_sam_v-1.gltf';
    private loader:GLTFLoader;
    private plane: THREE.Plane;
    private intersects = new THREE.Vector3();
    private camera: THREE.Camera
    private state = this.stateEnum.Empty
    private redDyeObject:Dye
    private yellowDyeObject:Dye
    private blueDyeObject:Dye
    private tubeObject:TestTube
    private cameraControler:OrbitControls

    constructor() {
        this.loader = new GLTFLoader()
       
    }

    init(callback: Function,camera:THREE.Camera,plane:THREE.Plane,redDyeObject:Dye,yellowDyeObject:Dye,blueDyeObject:Dye,tubeObject:TestTube,cameraControler:OrbitControls) {
        this.camera = camera
        this.cameraControler = cameraControler
        this.plane = plane
        this.redDyeObject = redDyeObject
        this.yellowDyeObject = yellowDyeObject
        this.blueDyeObject = blueDyeObject
        this.tubeObject = tubeObject

        this.loader.load(
            // resource URL
            `assets/models/eyedropper/${this.modelFileName}`,
            // called when the resource is loaded
            (object: THREE.Group) => {
                this.object = object
                // this.object = objectt
                console.log(object)
                object.scene.children[0].scale.set(0.01, 0.01, -0.01)
                
                callback()
            },
            // called while loading is progressing
            function ( xhr ) {
        
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        
            },
            // called when loading has errors
            function ( error ) {
        
                console.log( 'An error happened' + error );
        
            }
        );



        window.addEventListener('mousedown', () => {
            console.log(this.state)
            this.raycaster.set( this.object.scene.children[0].position, new THREE.Vector3(0,-1,0) );
            const intersectsDownRed = this.raycaster.intersectObject(this.redDyeObject.object.scene.children[0]);
            if(intersectsDownRed.length > 0  ){
                //triggerranim 
                this.state = this.stateEnum.RedDye
            }
            this.raycaster.set( this.object.scene.children[0].position, new THREE.Vector3(0,-1,0) );
            const intersectsDownBlue = this.raycaster.intersectObject(this.blueDyeObject.object.scene.children[0]);
            if(intersectsDownBlue.length > 0 ){
                //triggerranim 
                this.state = this.stateEnum.BlueDye
            }
            this.raycaster.set( this.object.scene.children[0].position, new THREE.Vector3(0,-1,0) );
            const intersectsDownYellow = this.raycaster.intersectObject(this.yellowDyeObject.object.scene.children[0]);
            if(intersectsDownYellow.length > 0 ){
                //triggerranim 
                this.state = this.stateEnum.YellowDye

            }
            
            this.raycaster.set( this.object.scene.children[0].position, new THREE.Vector3(0,-1,0) );
            const intersectsDownTube = this.raycaster.intersectObject(this.tubeObject.object.scene.children[0]);
            if(intersectsDownTube.length > 0 ){
                //triggerranim 
                
                switch ( this.state) {
                    case this.stateEnum.RedDye:
                        this.tubeObject.addRed()
                        break
                    case this.stateEnum.YellowDye:
                        this.tubeObject.addYellow()
                        break

                    case this.stateEnum.BlueDye:
                        this.tubeObject.addBlue()                    
                        break

                    default:
                        console.log("pipette vide")
                  }
                  this.state = this.stateEnum.Empty
                  

            }

            this.raycaster.setFromCamera( this.pointer, this.camera );
            const intersects = this.raycaster.intersectObjects(this.object.scene.children);
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
            if(this.isMouseDownOnModel){
               
                this.raycaster.setFromCamera(this.pointer, this.camera);
                this.raycaster.ray.intersectPlane(this.plane, this.intersects); 
                //console.log(this.intersects)
                //console.log(this.pointer)
                //console.log(this.object.scene.children[0].position)
                // -0.4 is offset to grab on the 
                this.object.scene.children[0].position.set(this.intersects.x, this.intersects.y-0.07, this.intersects.z);
            }
        });
    }


    anim() {
       
    }

    setAction() {
    
    }

    destroy() {

    }
}
