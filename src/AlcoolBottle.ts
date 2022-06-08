import * as THREE from "three"
import { transformMeshToGlass } from "./Glassifier";
import { GlobalLoader } from "./GlobalLoader";

export class AlcoolBottle {


    public object: THREE.Group
    public is_oppened
    public capacity = 4
    private liquidSample: Array<THREE.Mesh> = []
    private liquidIndex: number = 0


    constructor() {


    }

    init(callback: Function) {

        GlobalLoader.getInstance().getFBXLoaded("alcoolbottle", (object) => {
            this.object = object

            // const animationAction = this.mixer.clipAction(
            //     (object as THREE.Object3D).animations[0]
            // )
            //this.activeAction = animationAction
            console.log(this.object)
            this.object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    if (child.name == "Alcoolhelix" || child.name == "Alcoolbase") {

                        transformMeshToGlass(child, 'test.hdr')

                    }
                    if (child.name.includes("Liquide")) {
                        this.liquidSample.push(child)
                        child.material = new THREE.MeshBasicMaterial({ color: 0x000088 })
                        child.visible = true

                    }
                }
            })

            object.scale.set(0.01, 0.01, 0.01)

            object.position.set(-0.150, 0, 0)
            callback()
        })

    }

    //Reverse ( empty instead of fill)
    removeLiquid() {
        this.capacity -= 1
        console.log("çaremouveleliquid")
        //const mesh = this.object.getObjectByName( this.liquidSample[this.liquidIndex].name)
        let mesh = this.liquidSample[this.liquidIndex]
        //console.log(mesh)
        mesh.visible = false
        //this.liquidSample.push(child)
        this.liquidIndex = this.liquidIndex + 1
        mesh = this.liquidSample[this.liquidIndex]
        //console.log(mesh)
        mesh.visible = false
        //this.liquidSample.push(child)
        this.liquidIndex = this.liquidIndex + 1

    }

    anim() {

    }

    setAction() {

    }

    destroy() {

    }
}
