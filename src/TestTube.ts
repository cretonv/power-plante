import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import * as THREE from "three"
import * as TWEEN from "@tweenjs/tween.js";
import { Indication } from "./Indication";
import { ObjectViewModal } from "./ObjectViewModal";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EyeDropper } from "./Eyedropper";
import { EventDispatcher } from "three/src/core/EventDispatcher";
import { transformMeshToGlass } from "./Glassifier";
import { exp2Part2Name, GlobalLoader } from "./GlobalLoader";
export class TestTube extends EventDispatcher {


    public object: THREE.Group
    private shakeamount = 0;
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
    private blueMaterial = new THREE.MeshBasicMaterial({ color: 0x000088 })
    private redMaterial = new THREE.MeshBasicMaterial({ color: 0x880000 })
    private isMouseDownOnModel:boolean = false;
    private plane: THREE.Plane;
    private cameraControler:OrbitControls
    constructor() {
        super()
    }

    init(callback: Function, camera: THREE.Camera,plane:THREE.Plane,cameraControler:OrbitControls) {
        this.cameraControler = cameraControler
        this.plane = plane



        this.camera = camera
        // instantiate a loader
        this.camera = camera
        // instantiate a loader
        const textureLoader = new THREE.TextureLoader();
        const loader = new FBXLoader()

        GlobalLoader.getInstance().getFBXLoaded("testtube", (object) => {
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
            object.position.set(0.1, 0.005, 0)
            callback()
        })





    }
    checkIfCompleted() {
        //console.log(activity_status)
        if (this.content["Red"] > 1 && this.content["Alcool"] > 1) {
            this.isFilled = true
            console.log("go to shake part")
            //GlobalLoader.getInstance().setNextScene(exp2Part2Name)
            this.object.getObjectByName("bouchon").visible = true
           // AppLiveParameter.getInstance().setCurrentScene("scene2")
               window.addEventListener('mousedown', () => {
          

            this.raycaster.setFromCamera( this.pointer, this.camera );
            const intersects = this.raycaster.intersectObjects(this.object.children);
            if (intersects.length > 0 ){
                this.isMouseDownOnModel = true
                this.cameraControler.enabled = false
      
            }
            
        })

        window.addEventListener('mouseup', () => {
            this.isMouseDownOnModel =false
            this.cameraControler.enabled = true
        })

        window.addEventListener( 'pointermove', (e) => {
            // calculate pointer position in normalized device coordinates
            // (-1 to +1) for both components
            //console.log(this.camera)
            this.pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
            this.pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
            if(this.isMouseDownOnModel){
                this.updateMaterial()
                this.shakeamount+=1
                this.raycaster.setFromCamera(this.pointer, this.camera);
                this.raycaster.ray.intersectPlane(this.plane, this.intersects); 
                //console.log(this.intersects)
                //console.log(this.pointer)
                //console.log(this.object.scene.children[0].position)
                // -0.4 is offset to grab on the 
                this.object.position.set(this.intersects.x, this.intersects.y-0.07, this.intersects.z);
                
            }
        });
        }
    }
    addRed() {
        this.content["Red"] += 1
        console.log("triggeranimtuberouge")
        this.checkIfCompleted()
        this.liquidSetNextLayer(true)
    }
    // addBlue() {
    //     this.content["Blue"] += 1
    //     console.log("triggeranimtubebleue")
    //     this.checkIfCompleted()
    // }
    // addYellow() {
    //     this.content["Yellow"] += 1
    //     console.log("triggeranimyellow")
    //     this.checkIfCompleted()
    // }
    addAlcool() {
        this.content["Alcool"] += 1
        console.log("triggeranimalcool")
        
        this.liquidSetNextLayer(false)
        this.checkIfCompleted()
    }
    liquidSetNextLayer(isDye:Boolean){
        
        const mesh = this.object.getObjectByName(  this.liquidSample[this.liquidSample.length - this.liquidIndex-1].name)
        //console.log(mesh)
        mesh.visible = true
                    //this.liquidSample.push(child) 
        if(isDye){
            mesh.material = this.redMaterial
        }
        else
        {
            mesh.material = this.blueMaterial
        }
        this.liquidIndex = this.liquidIndex + 1
        //console.log(this)
    }

    updateMaterial(){
        
      
        if ( this.redMaterial.color.getHex() != this.blueMaterial.color.getHex()){
            if(this.shakeamount%5 == 0){
                if( this.redMaterial.color.getHex() == "0x880044" ){
                    console.log("alo")
                    //AppLiveParameter.getInstance().setNextScene("exp2Part3Name")
                }
                this.redMaterial.color = this.redMaterial.color.add(new THREE.Color( 0x000001 ))
                this.blueMaterial.color =  this.blueMaterial.color.add(new THREE.Color( 0x010000 ))

            }

        } 
        else{
            //AppLiveParameter.getInstance().notifyTransitionDone()
            console.log("fini")

        }

        
    }

    anim(delta) {
        if (this.modelReady) this.mixer.update(delta)
    }

    setAction() {

    }

    destroy() {

    }
}
