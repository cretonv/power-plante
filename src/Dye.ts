import * as THREE from "three"
import {transformMeshToGlass} from "./Glassifier";
import {GlobalLoader} from "./GlobalLoader";

export const dyeColorEnum = Object.freeze({
    RedDye:"dyeRed_animation_sam_v-2.fbx",
    YellowDye:"dyeRed_animation_sam_v-2.fbx",
    BlueDye:"dyeRed_animation_sam_v-2.fbx"
});
export class Dye {


    public object:THREE.Group
    public is_oppened
    private camera: THREE.Camera
    private pointer  = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    public capacity = 4
    private liquidSample: Array<THREE.Mesh> = []
    private liquidIndex: number = 0
    constructor() {


    }

    init(callback: Function,camera:THREE.Camera,modelFileName:string) {
        console.log(modelFileName)
        this.camera = camera
        // instantiate a loader
        //const textureLoader = new THREE.TextureLoader();

        GlobalLoader.getInstance().getFBXLoaded("dye", (object) => {
            this.object = object

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
                        child.material = new THREE.MeshBasicMaterial( {color: 0x880000,side:THREE.DoubleSide,polygonOffset :true,polygonOffsetFactor:-0.1} )
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
        })




        window.addEventListener('mousedown', () => {
            //console.log("down")

            this.raycaster.setFromCamera( this.pointer, this.camera );
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
