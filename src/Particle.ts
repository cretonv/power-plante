import * as THREE from "three"
import {GlobalLoader} from "./GlobalLoader";

export class Particle {


    public object:THREE.Group
    public clock:THREE.Clock
    public color: THREE.Color
    public MoveVector:THREE.Vector2 = new THREE.Vector2(0.01,0.01)
    public particleIsOnScreen = true
    constructor() {


    }

    init(callback: Function,clock:THREE.Clock) {
        this.clock = clock
        GlobalLoader.getInstance().getGLTFLoaded('uranium',(object)=>{
           this.object = object.clone()


           this.object.scale.set(0.4,0.4,0.4)
           this.object.children[0].position.set(0.0,0.0,0)
           this.object.position.set(0.0,0.0,5)
           callback()
           //console.log(this.object)
        })







    }

    anim() {
        this.object.position.x += this.MoveVector.x
        this.object.position.y += this.MoveVector.y
        //console.log("onélà")
       const speed = 1
       const sizeFactor =40
       this.object.rotation.set(this.object.rotation.x+0.01 ,this.object.rotation.x+0.8,this.object.rotation.x+0.15)
       this.object.scale.set(0.4+Math.sin(this.clock.getElapsedTime()/speed)/sizeFactor,0.4+Math.sin(this.clock.getElapsedTime()/speed)/sizeFactor,0.4+Math.sin(this.clock.getElapsedTime()/speed)/sizeFactor)
        if (this.object.position.x + this.object.position.y > 25 ){
            this.particleIsOnScreen = false
        }
    }

    setAction() {

    }

    destroy() {
        this.object.traverse((child) => {
            if(child instanceof THREE.Mesh){
                child.geometry.dispose()

                for(const key in child.material){
                    const value = child.material[key]

                    if (value && typeof value.dispose === 'function'){
                        value.dispose()
                    }
                }
            }
        })

    }
}
