import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import * as THREE from "three"
import * as TWEEN from "@tweenjs/tween.js";
import {Indication} from "./Indication";
import {ObjectViewModal} from "./ObjectViewModal";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { transformMeshToGlass } from "./Glassifier";
export const dyeColorEnum = Object.freeze({
    RedDye:"dyeRed_animation_sam_v-2.fbx",
    YellowDye:"dyeRed_animation_sam_v-2.fbx",
    BlueDye:"dyeRed_animation_sam_v-2.fbx"
});
export class Dye {
  
   
    public object:THREE.Group
    public is_oppened 
    private modelFileName:string;
    private intersects = new THREE.Vector3();
    private camera: THREE.Camera
    private pointer  = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    public capacity = 4
    private mixer: THREE.AnimationMixer
    private activeAction : THREE.clipAction
    private liquidSample: Array<THREE.Mesh> = []
    private liquidIndex: number = 0 
    constructor() {

       
    }

    init(callback: Function,camera:THREE.Camera,modelFileName:string) {
        console.log(modelFileName)
        this.modelFileName = modelFileName
        this.camera = camera
        // instantiate a loader
        //const textureLoader = new THREE.TextureLoader();
        const loader = new FBXLoader();
        loader.load(
            `assets/models/dye/${modelFileName}`,
            (object) => {
                this.object = object
                this.mixer = new THREE.AnimationMixer(object)

                // const animationAction = this.mixer.clipAction(
                //     (object as THREE.Object3D).animations[0]
                // )
                // this.activeAction = animationAction
                object.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        //console.log(child)
                        if (child.name == "HelixBouchon" || child.name == "ColorantBase") {
                            transformMeshToGlass(child, 'test.hdr')
                        }
                        else if (child.name.includes("L")) {
                            this.liquidSample.push(child)
                            child.material = new THREE.MeshBasicMaterial( {color: 0x880000} )
                            child.visible = true
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
            //console.log("down")
           
            this.raycaster.setFromCamera( this.pointer, this.camera );
            const intersects = this.raycaster.intersectObjects(this.object.children);
            //Trigger first anim( bottle oppenning here)
            
        })

       
    }
    removeLiquid(){
        this.capacity -=1 
        console.log("çaremouveleliquid")
        //const mesh = this.object.getObjectByName( this.liquidSample[this.liquidIndex].name)
        var mesh = this.liquidSample[this.liquidSample.length -this.liquidIndex-1]
        //console.log(mesh)
        mesh.visible = false
                    //this.liquidSample.push(child) 
        this.liquidIndex = this.liquidIndex + 1
         mesh = this.liquidSample[this.liquidSample.length -this.liquidIndex-1]
        //console.log(mesh)
        mesh.visible = false
                    //this.liquidSample.push(child) 
        this.liquidIndex = this.liquidIndex + 1
        //callback(mesh)
        //callback(mesh)
        //console.log(this)
    
   
   
}

    anim() {
       
    }

    setAction() {
    
    }

    destroy() {

    }
}
