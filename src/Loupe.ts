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
import { transformMeshToGlass } from "./Glassifier";
import { GlobalLoader } from "./GlobalLoader";
export class Loupe {

    private isMouseDownOnModel:boolean = false;
    private pointer  = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    public object:THREE.Group
    private modelFileName: string = "magnifyingglass_sam_v-2.gltf";
    private loader:GLTFLoader;
    private plane: THREE.Plane;
    private intersects = new THREE.Vector3();
    private camera: THREE.Camera
    private cameraControler:OrbitControls
    constructor() {
        this.loader = new GLTFLoader()
       
    }
    //true in initialarray stands for red otherwise blue
    init(callback: Function,camera:THREE.Camera,plane:THREE.Plane,cameraControler:OrbitControls) {
        this.camera = camera
        this.cameraControler = cameraControler
        this.plane = plane
        GlobalLoader.getInstance().getFBXLoaded("case", (object) => {
            this.object = object
            this.object.scale.set(0.006, 0.006, 0.006)
            callback()
   
        })

        window.addEventListener('mousedown', () => {
          

            this.raycaster.setFromCamera( this.pointer, this.camera );
            console.log(this.object)
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




    setAction() {
    
    }

    destroy() {

    }
}
