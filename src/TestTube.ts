import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import * as THREE from "three"
import * as TWEEN from "@tweenjs/tween.js";
import {Indication} from "./Indication";
import {ObjectViewModal} from "./ObjectViewModal";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EyeDropper } from "./Eyedropper";
import { EventDispatcher } from "three/src/core/EventDispatcher";
import { AppLiveParameter } from './AppLiveParameter'
export class TestTube extends EventDispatcher {
  
   
    public object:THREE.Group
    private modelFileName:string = "testtube_animation_blue_in_sam_v-1.gltf";
    private intersects = new THREE.Vector3();
    private camera: THREE.Camera
    private pointer  = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    private mixer: THREE.AnimationMixer
    private modelReady = false
    private animationActions: THREE.AnimationAction[] = []
    private activeAction: THREE.AnimationAction
    private lastAction: THREE.AnimationAction
    private content= {'Blue':0,'Red':0,'Yellow':0}
    public isFilled = false
    constructor() {
        super()
    }

    init(callback: Function,camera:THREE.Camera) {
        
        
 
        this.camera = camera
        // instantiate a loader
        const textureLoader = new THREE.TextureLoader();
        const loader = new GLTFLoader();
        loader.load(
            // resource URL²
            `assets/models/testtube/${this.modelFileName}`,
            // called when the resource is loaded
            (object: THREE.Group) => {

                this.mixer = new THREE.AnimationMixer(object.scene)

                const animationAction = this.mixer.clipAction((object as any).animations[0])
                this.animationActions.push(animationAction)
                this.activeAction = this.animationActions[0]
                console.log( this.activeAction)
                
                
                this.object = object
                object.scene.children[0].scale.set(0.01, 0.01, -0.01)
                //object.scene.children[0].position.set(0.01, 0.01, -0.01)
                callback()
                this.modelReady = true
               //this.activeAction.play()
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
      

       
    }
    checkIfCompleted(){
        //console.log(activity_status)
        if (this.content["Blue"]>2 && this.content["Yellow"]>1){
            this.isFilled = true
            console.log("go to shake scene")
            AppLiveParameter.getInstance().setCurrentScene("scene2")
        } 
    }
    addRed(){
        this.content["Red"] += 1 
        console.log("triggeranimtuberouge")
        this.checkIfCompleted()
    }
    addBlue(){
        this.content["Blue"] += 1        
        console.log("triggeranimtubebleue")
        this.checkIfCompleted()
    }
    addYellow(){
        this.content["Yellow"] += 1 
        console.log("triggeranimyellow")
        this.checkIfCompleted()
    }

    anim(delta) {
        if (this.modelReady) this.mixer.update(delta)
    }

    setAction() {
    
    }

    destroy() {

    }
}
