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
import { GlobalLoader } from "./GlobalLoader";
export class EyedropperSupport {

    private isMouseDownOnModel:boolean = false;
    private pointer  = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    public object:THREE.Group
    private loader:GLTFLoader;
    private plane: THREE.Plane;
    private intersects = new THREE.Vector3();
    private camera: THREE.Camera
    private redDyeObject:Dye
    private mixer: THREE.AnimationMixer
    private activeAction : THREE.clipAction
    private alcoolBottle:AlcoolBottle
    private tubeObject:TestTube
    private cameraControler:OrbitControls

    constructor() {
        this.loader = new FBXLoader()
       
    }

    init(callback: Function,camera:THREE.Camera,cameraControler:OrbitControls) {
        this.camera = camera
        this.cameraControler = cameraControler
    
       
        GlobalLoader.getInstance().getGLTFLoaded("support", (object) => {
  
            this.object = object
            this.mixer = new THREE.AnimationMixer(object)

            // const animationAction = this.mixer.clipAction(
            //     (object as THREE.Object3D).animations[0]
            // )
            //this.activeAction = animationAction
            object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    console.log(child)
                    if (child.name == "Pipette_2") {
                        child.visible = false
                    }
                    else if (child.name.includes("L")) {
                        //this.liquidSample.push(child)
                        child.visible = false
                    }
                   
                
                }
            })

            object.scale.set(0.01, 0.01, 0.01)

            object.position.set(0.2, 0.0, 0)
            callback()
        })
    }


    anim() {
       
    }
    

    setAction() {
    
    }

    destroy() {

    }
}
