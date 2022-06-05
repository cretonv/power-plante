import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import * as THREE from "three"
import * as TWEEN from "@tweenjs/tween.js";
import { Indication } from "./Indication";
import { ModalViewport } from "./ModalViewport";
import { transformMeshToGlass, transformMeshToLed, transformMeshToLedLight } from "./Glassifier";
import { Mascot } from "./Mascot";
import { GlobalLoader, exp2Part1Name, landingName } from "./GlobalLoader";
import { FirstScene } from "./Scenes/FirstScene";

export class Exp1Assembly {

    private mixer: THREE.AnimationMixer

    public object: THREE.Group

    private clock: THREE.Clock
    private rotateUranium = false   
    private camera: THREE.Camera
    private indications: Indication
    private loader: FBXLoader;
    private activeAction: THREE.AnimationAction;
    private lastAction: THREE.AnimationAction;
    private animationActions: THREE.AnimationAction[];
    private modelReady: boolean;
    private isMouseDownOnModel = false

    // Animations and interactions attributes
    private mouseDown: boolean
    private pointer = THREE.Vector2
    private raycaster = THREE.Raycaster

    // Animations blocker var
    private animpart1 = false
    private animpart2 = false
    private animpart3 = false
    private state = "start"

    // private modelFileName = 'case_flo_v-14.fbx';

    // Other scene elements
    public caseSelectedObject: Array<THREE.Object3D> = []

    // Temporary attributes waiting refacto of main.ts
    private controls: THREE.OrbitControls
    private selectedObjectCallback: Function
    private isMouseOnModel = false


    private buttonMouseClickEvent: Function
    private clickHandler
    private mouseMoveEvent: Function
    private moveHandler
    private buttonMouseReleaseEvent: Function
    private clickReleaseHandler
    private plane: THREE.Mesh
    private batterymaterial: THREE.material
    private batteryStickersMaterial: THREE.material

    private uranium : THREE.Mesh



    constructor() {
        this.animationActions = []
        this.modelReady = false
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2(-1000000, -1000000);
        this.mouseDown = false
        this.clock = new THREE.Clock()

        this.buttonMouseClickEvent = (e) => {
            this.raycaster.setFromCamera(this.pointer, this.camera);
            const intersects = this.raycaster.intersectObjects(this.object.children);
            console.log(intersects)
            if (intersects.length > 0) {
                intersects.forEach(element => {
                    //console.log(element)
                    switch (element.object.name) {
                        
                        case "support_cab":
                            if (!this.animpart1) {
                                this.activeAction = this.animationActions[1]
                                this.animpart1 = true
                            }
                            else {
                                console.log("wrong")
                            }
                            break;
                        case "GLASS_dome":
                            if (!this.animpart3 && this.animpart2) {
                                const targetCoords = {
                                    x: 0.5084644805746876,
                                    y: 0.17242656592455635,
                                    z: 0.05116099495563462,
                                    xf: 0.0,
                                    yf: 0.1,
                                    zf: -0.1,
                                }
                                this.activeAction = this.animationActions[3]
                                this.animpart3 = true
                                window.setTimeout(() => {

                                    let camPosition = new THREE.Vector3()
                                    this.camera.getWorldPosition(camPosition);


                                    const coords = { x: camPosition.x, y: camPosition.y, z: camPosition.z, xf: 0, yf: 0, zf: 0 };
                                    this.controls.enabled = false
                                    this.controls.minDistance = -Infinity;
                                    this.controls.maxDistance = Infinity;
                                    this.controls.enableDamping = true;
                                    this.controls.minPolarAngle = -Infinity;
                                    this.controls.maxPolarAngle = Infinity;
                                    this.controls.minAzimuthAngle = -Infinity;
                                    this.controls.maxAzimuthAngle = Infinity;
                                    this.controls.enablePan = true;
                                    new TWEEN.Tween(coords)
                                        .to({ x: targetCoords.x, y: targetCoords.y, z: targetCoords.z, xf: targetCoords.xf, yf: targetCoords.yf, zf: targetCoords.zf })
                                        .onUpdate(() => {
                                            this.camera.position.set(coords.x, coords.y, coords.z)
                                            //this.camera.lookAt(dirVector)
                                            // this.camera.lookAt(coords.x, coords.y, coords.z)
                                            this.controls.target.set(coords.xf, coords.yf, coords.zf)
                                            //console.log(this.controls.enabled)
                                        })
                                        .easing(TWEEN.Easing.Back.InOut)
                                        .onComplete(() => {
                                            console.log(this.controls.target)
                                            this.controls.enabled = true;

                                            this.controls.minDistance = 0.35;
                                            this.controls.maxDistance = 0.65;
                                            this.controls.enableDamping = true;
                                            this.controls.enabled = true;
                                            this.controls.minPolarAngle = Math.PI - Math.PI / 2 - 0.4;
                                            this.controls.maxPolarAngle = Math.PI / 2 - 0.1;
                                            this.controls.minAzimuthAngle = 0.9;
                                            this.controls.maxAzimuthAngle = 1.7;
                                            this.controls.enablePan = false;
                                        })
                                        .start();
                                }, 1600)
                            }
                            else {
                                console.log("wrong")
                            }
                            break;
                        case "GLASS_Boiteplexy":
                        case "uranium":
                            if (!this.animpart2 && this.animpart1) {
                                this.activeAction = this.animationActions[2]
                                this.animpart2 = true
                                this.state = "opencase"
                            }
                            else {
                                console.log("wrong")
                            }
                            break;
                        case  "button":
                            if(this.state == "pilecharged"){
                                this.ledanim()
                                this.rotateUranium = true
                            }
                            break
                        default:
                            break;
                    }
                    if (element.object.name == "cache") {
                        if (this.animpart3 == true) {

                            this.isMouseDownOnModel = true
                            this.controls.enabled = false

                        }
                    }

                    this.activeAction.setLoop(THREE.LoopOnce)
                    this.activeAction.clampWhenFinished = true
                    this.activeAction.play()


                });
            }
        }

        this.buttonMouseReleaseEvent = () => {
            this.isMouseDownOnModel = false
            this.controls.enabled = true
        }
        this.mouseMoveEvent = (e) => {
            this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;
            if (this.isMouseDownOnModel) {
                this.raycaster.setFromCamera(this.pointer, this.camera);
                const intersects = this.raycaster.intersectObject(this.object.getObjectByName("cache"));
                if (intersects.length > 0 && this.object.getObjectByName("cache").position.z < 14 && this.state == "opencase") {
                    if (this.object.getObjectByName("cache").position.z + intersects[0].distance < 13.5) {
                        this.object.getObjectByName("cache").position.z = this.object.getObjectByName("cache").position.z + intersects[0].distance * 2
                    }
                    else {
                        this.object.getObjectByName("cache").position.z = 14
                        this.state = "rangelespilesfdp"
                        //this.setBatteryLessTransparent()
                        GlobalLoader.getInstance().setSelectedArray([this.object.getObjectByName("battery")])
                    }

                }
                else if (intersects.length > 0 && this.object.getObjectByName("cache").position.z > 0 && this.state == "closepile") {
                    if (this.object.getObjectByName("cache").position.z - intersects[0].distance > -0.012989381115526565) {
                        this.object.getObjectByName("cache").position.z = this.object.getObjectByName("cache").position.z - intersects[0].distance * 2

                    }
                    else {
                        this.object.getObjectByName("cache").position.z = -0.012989381115526565
                        this.state = "pilecharged"
                        console.log("onélà")

                    }
                }

                // this.raycaster.ray.intersectPlane(this.plane, this.intersects);
                // this.object.position.set(this.intersects.x, this.intersects.y - 0.01, this.intersects.z);

            }
        }


    }

    init(
        callback: Function,
        camera,
        controls,
    ) {

        this.camera = camera
        this.controls = controls

        GlobalLoader.getInstance().getFBXLoaded("cabAnim", (object) => {
            this.object = object
            //console.log(object)
            this.mixer = new THREE.AnimationMixer(this.object)
            for (let i = 0; i < (this.object as THREE.Object3D).animations.length; i++) {
                const animationAction = this.mixer.clipAction(
                    (this.object as THREE.Object3D).animations[i]
                )
                this.animationActions.push(animationAction)
            }
            this.activeAction = this.animationActions[0]
            this.activeAction.setLoop(THREE.LoopOnce)
            this.activeAction.clampWhenFinished = true
          

            const tempArray: { [name: string]: THREE.Object3D } = {}
            object.traverse((child) => {
                
                if ((child as THREE.Mesh).isMesh) {
                    //console.log(child)
                    tempArray[child.name] = child
                    if (child.name.includes("GLASS_")) {

                        transformMeshToGlass(child, 'hdri_power_plante_flo_v-1.hdr')

                    }
                    else if (child.name.includes("led")) {

                        transformMeshToLed(child, 'hdri_power_plante_flo_v-1.hdr')

                    }
                    else if (child.name == "uranium") {
                        //console.log("aaaaaaaaaaaaa")
                        this.uranium = child
                    }
                    else if (child.name == "battery") {
                        const material = new THREE.MeshBasicMaterial({
                            color: 0x000000,
                            transparent: true,
                            opacity: 1.0
                        });
                        this.batterymaterial = child.material
                        child.material = material

                    }
                    else if (child.name == "battery_sticker") {
                        const material = new THREE.MeshBasicMaterial({
                            color: 0x000000,
                            transparent: true,
                            opacity: 1.0
                        });

                        this.batteryStickersMaterial = child.material
                        child.material = material

                    }
                    this.modelReady = true

                }
            })

            this.activeAction.play()

            object.scale.set(0.01, 0.01, 0.01)
            object.rotation.set(0.0, -0.25, 0.0)
            object.position.set(0, 0, -0.1)
            callback()
            this.clickHandler = this.buttonMouseClickEvent.bind(this);
            window.addEventListener('mousedown', this.clickHandler)
            this.clickReleaseHandler = this.buttonMouseReleaseEvent.bind(this);
            window.addEventListener('mouseup', this.clickReleaseHandler)
            this.moveHandler = this.mouseMoveEvent.bind(this);
            window.addEventListener('pointermove', this.moveHandler);
        })
    }
    ledanim(){
        let count = 300
        this.object.traverse((child) => {
            
            if(child.name.includes("led")){
                window.setTimeout(()=>{
                    transformMeshToLedLight(child, 'hdri_power_plante_flo_v-1.hdr')
                }, count)
                count += 900 
               

            }
        })  
        window.setTimeout(()=>{
            document.querySelector('body').classList.add('active');
            GlobalLoader.getInstance().setNextScene(landingName)
            setTimeout(() => { 
                this.controls.enabled = false
                this.controls.minDistance = -Infinity;
                this.controls.maxDistance = Infinity;
                this.controls.enableDamping = true;
                this.controls.minPolarAngle = -Infinity;
                this.controls.maxPolarAngle = Infinity;
                this.controls.minAzimuthAngle = -Infinity;
                this.controls.maxAzimuthAngle = Infinity;
                this.controls.enablePan = true;
                this.controls.target.set(0,0,0)
                GlobalLoader.getInstance().notifyTransitionDone() }, 1100)
        },14000)
    }

    anim() {
        if(this.rotateUranium && this.modelReady){
            
            const speed = 4
            const sizeFactor =40 
            console.log(this.uranium)
            this.uranium.rotation.set(this.uranium.rotation.x+0.001,this.uranium.rotation.y+0.008,this.uranium.rotation.z+0.025) 
      
        }
        //console.log(this.object)
        if (this.modelReady && (this.animpart1 || this.animpart2 || this.animpart3 || true)) {
            this.mixer.update(this.clock.getDelta())
        }
        //console.log(this.camera)
    }

    setAction(toAction: THREE.AnimationAction) {
        if (toAction != this.activeAction) {
            this.lastAction = this.activeAction
            this.activeAction = toAction
            this.lastAction.stop()

            this.activeAction.reset()
            
            this.activeAction.play()
        }
    }

    setBatteryLessTransparent() {
        if (this.state = "rangelespilesfdp") {
            this.state = "closepile"
            this.object.getObjectByName("battery").material = this.batterymaterial
            this.object.getObjectByName("battery_sticker").material = this.batteryStickersMaterial
            GlobalLoader.getInstance().setSelectedArray([])
        }
    }
    destroy() {
        window.removeEventListener('mousedown', this.clickHandler)
        window.removeEventListener('pointermove', this.moveHandler)
        window.removeEventListener('mouseup', this.clickReleaseHandler)
    }

}
