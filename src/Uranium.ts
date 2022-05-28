import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import * as THREE from "three"
import * as TWEEN from "@tweenjs/tween.js";
import {Indication} from "./Indication";
import {ObjectViewModal} from "./ObjectViewModal";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { transformMeshToGlass } from "./Glassifier";
import { GlobalLoader } from "./GlobalLoader";

export class Uranium {
  
   
    public object:THREE.Group
    public clock:THREE.Clock 
    constructor() {

       
    }

    init(callback: Function,clock:THREE.Clock) {
        this.clock = clock
        GlobalLoader.getInstance().getGLTFLoaded('uranium',(object)=>{
           this.object = object

           
           object.scale.set(0.4,0.4,0.4)
           object.children[0].position.set(0.0,0.0,0)
           object.position.set(0.0,0.0,5)
           callback()
           console.log(this.object)
        })
    }

    anim() {
       console.log()
       const speed = 1
       const sizeFactor =40 
       this.object.rotation.set(this.object.rotation.x+0.001,this.object.rotation.y+0.008,this.object.rotation.z+0.025) 
       this.object.scale.set(0.4+Math.sin(this.clock.getElapsedTime()/speed)/sizeFactor,0.4+Math.sin(this.clock.getElapsedTime()/speed)/sizeFactor,0.4+Math.sin(this.clock.getElapsedTime()/speed)/sizeFactor) 
    }

    setAction() {
    
    }

    destroy() {

    }
}
