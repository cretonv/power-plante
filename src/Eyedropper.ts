import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import * as THREE from "three"
import * as TWEEN from "@tweenjs/tween.js";
import {Indication} from "./Indication";
import {ObjectViewModal} from "./ObjectViewModal";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
export class EyeDropper {
    const stateEnum = Object.freeze({
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

    constructor() {
        this.loader = new GLTFLoader()
       
    }

    init(callback: Function,camera:THREE.Camera,plane:THREE.Plane) {
        this.camera = camera
        this.plane = plane
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
            //console.log("down")
           
            this.raycaster.setFromCamera( this.pointer, this.camera );
            const intersects = this.raycaster.intersectObjects(this.object.scene.children);
            if (intersects.length > 0 ){
                this.isMouseDownOnModel = true
            }
            
        })

        window.addEventListener('mouseup', () => {
            this.isMouseDownOnModel =false
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
