import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GlobalLoader} from "./GlobalLoader";

export class EyedropperSupport {

    public object:THREE.Group
    // @ts-ignore
    private camera: THREE.Camera
    // @ts-ignore
    private mixer: THREE.AnimationMixer
    // @ts-ignore
    private cameraControler:OrbitControls

    constructor() {

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
