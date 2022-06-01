import * as THREE from "three"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { transformMeshToGlass } from "./Glassifier";
import { GlobalLoader } from "./GlobalLoader";

export class AlcoolBottle {


    public object: THREE.Group
    public is_oppened
    private modelFileName: string = "alcohol_animation_sam_v-2.fbx";
    private camera: THREE.Camera
    private pointer = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    private mixer: THREE.AnimationMixer
    private activeAction: THREE.clipAction
    public capacity = 4
    private liquidSample: Array<THREE.Mesh> = []
    private liquidIndex: number = 0


    constructor() {


    }

    init(callback: Function, camera: THREE.Camera) {

        this.camera = camera
        // instantiate a loader
        const textureLoader = new THREE.TextureLoader();
        const loader = new FBXLoader()
   
        GlobalLoader.getInstance().getFBXLoaded("alcoolbottle", (object) => {
            this.object = object
            this.mixer = new THREE.AnimationMixer(object)

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




        // window.addEventListener('mousedown', () => {
        //     //console.log("down")

        //     this.raycaster.setFromCamera( this.pointer, this.camera );
        //     const intersects = this.raycaster.intersectObjects(this.object);


        //     //Trigger first anim( bottle oppenning here)

        // })


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
