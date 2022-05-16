import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import * as THREE from "three"
import * as TWEEN from "@tweenjs/tween.js";
import { Indication } from "./Indication";
import { ObjectViewModal } from "./ObjectViewModal";

import { EyeDropper } from "./Eyedropper";
import { EventDispatcher } from "three/src/core/EventDispatcher";
import { AppLiveParameter } from './AppLiveParameter'
import { transformMeshToGlass } from "./Glassifier";
export class TestTube extends EventDispatcher {


    public object: THREE.Group
    private modelFileName: string = "testtube_animation_v-2.fbx";
    private intersects = new THREE.Vector3();
    private camera: THREE.Camera
    private pointer = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    private mixer: THREE.AnimationMixer
    private modelReady = false
    private animationActions: THREE.AnimationAction[] = []
    private activeAction: THREE.AnimationAction
    private lastAction: THREE.AnimationAction
    private content = { 'Blue': 0, 'Red': 0, 'Yellow': 0, "Alcool": 0 }
    public isFilled = false
    private liquidSample: Array<THREE.Mesh> = []
    private liquidIndex: number = 0
    constructor() {
        super()
    }

    init(callback: Function, camera: THREE.Camera) {



        this.camera = camera
        // instantiate a loader
        this.camera = camera
        // instantiate a loader
        const textureLoader = new THREE.TextureLoader();
        const loader = new FBXLoader()
        loader.load(
            `assets/models/testtube/${this.modelFileName}`,
            (object) => {
                this.object = object
                this.mixer = new THREE.AnimationMixer(object)

                const animationAction = this.mixer.clipAction(
                    (object as THREE.Object3D).animations[0]
                )
                this.activeAction = animationAction
                object.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        //console.log(child)
                        if (child.name == "tube") {
                            transformMeshToGlass(child, 'test.hdr')
                        }
                        else if (child.name.includes("L")) {
                            this.liquidSample.push(child)
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





    }
    checkIfCompleted() {
        //console.log(activity_status)
        if (this.content["Red"] > 1 && this.content["Alcool"] > 1) {
            this.isFilled = true
            console.log("go to shake scene")
           // AppLiveParameter.getInstance().setCurrentScene("scene2")
        }
    }
    addRed() {
        this.content["Red"] += 1
        console.log("triggeranimtuberouge")
        this.checkIfCompleted()
        this.liquidSetNextLayer(new THREE.MeshBasicMaterial( {color: 0x880000} ))
    }
    addBlue() {
        this.content["Blue"] += 1
        console.log("triggeranimtubebleue")
        this.checkIfCompleted()
    }
    addYellow() {
        this.content["Yellow"] += 1
        console.log("triggeranimyellow")
        this.checkIfCompleted()
    }
    addAlcool() {
        this.content["Alcool"] += 1
        console.log("triggeranimalcool")
        
        this.liquidSetNextLayer(new THREE.MeshBasicMaterial( {color: 0x000088} ))
        this.checkIfCompleted()
    }
    liquidSetNextLayer(material:THREE.Mesh){
        
        const mesh = this.object.getObjectByName(  this.liquidSample[this.liquidSample.length - this.liquidIndex-1].name)
        //console.log(mesh)
        mesh.visible = true
                    //this.liquidSample.push(child) 
        mesh.material = material
        this.liquidIndex = this.liquidIndex + 1
        //console.log(this)
    }

    anim(delta) {
        if (this.modelReady) this.mixer.update(delta)
    }

    setAction() {

    }

    destroy() {

    }
}
