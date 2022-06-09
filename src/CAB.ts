import * as THREE from "three"
import {transformMeshToGlass, transformMeshToLed} from "./Glassifier";
import {GlobalLoader} from "./GlobalLoader";
import {Loupe} from "./Loupe";
import * as TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


export class CAB {


    public object: THREE.Group
    public is_oppened
    private camera: THREE.Camera
    private pointer = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    public capacity = 4
    private liquidSample: Array<THREE.Mesh> = []
    private liquidIndex: number = 0
    private isFilled = false
    private controls: OrbitControls


    private buttonMouseClickEvent:Function
    private clickHandler
    private mouseMoveEvent:Function
    private moveHandler
    private loupe:Loupe


    constructor() {
        this.buttonMouseClickEvent = () => {

            if(this.isFilled == false){
                this.raycaster.setFromCamera( this.pointer, this.camera );
                //console.log(this.object.getObjectByName("uranium"))
                const intersects = this.raycaster.intersectObjects(this.object.children);
                console.log(intersects)
                intersects.forEach(element => {
                    if(element.object.name == "button_2"){
                        this.filled()
                        GlobalLoader.getInstance().setSelectedArray([])
                        this.isFilled = true
                        this.loupe.isEnabled = true
                        const targetCoords = {
                            x: 0.7538687283149133,
                            y: 0.21759561301318526,
                            z: 0.4551694646181694
                        }
                        const coords = { x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z};
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
                            .to({ x: targetCoords.x, y: targetCoords.y, z: targetCoords.z })
                            .onUpdate(() => {
                                this.camera.position.set(coords.x, coords.y, coords.z)
                                this.camera.lookAt( 0.8038687283149133, this.object.position.y, this.object.position.z)
                            })
                            .easing(TWEEN.Easing.Sinusoidal.InOut)
                            .onComplete(() => {
                                console.log(this.camera.position)
                                window.setTimeout(() => {
                                    console.log(this.camera.position)
                                })
                                console.log(this.object.position)
                                this.camera.lookAt( 2.8038687283149133, 0.3, 0.1)
                            })
                            .start();
                    }
            });
            //console.log('alo') // this line runs ..

            }
        }

        this.mouseMoveEvent = (e) => {
            this.pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
            this.pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
        }

    }

    init(callback: Function, camera: THREE.Camera,loupe:Loupe,controls:OrbitControls) {
        this.loupe = loupe
        this.camera = camera
        this.controls = controls

        GlobalLoader.getInstance().getFBXLoaded("cab", (object) => {
            this.object = object

            // const animationAction = this.mixer.clipAction(
            //     (object as THREE.Object3D).animations[0]
            // )
            //this.activeAction = animationAction
            object.traverse((child) => {
            //console.log(child)

                if (child instanceof THREE.Mesh) {
                    //console.log(child)
                    if (child.name == "GLASS_tube" || child.name == "GLASS_dome") {

                        transformMeshToGlass(child, 'test.hdr')

                    }
                    else if (child.name.includes("led")) {

                        transformMeshToLed(child, 'test.hdr')

                    }
                    else if (child.name.includes("battery")) {

                        child.visible = false

                    }
                    else if (child.name.includes("GLASS_liquid")) {
                        this.liquidSample.push(child)
                        child.visible = false
                    }

                }
            })

            object.scale.set(0.01, 0.01, 0.01)
            callback()
        })

    }

    //Reverse ( empty instead of fill)

    anim() {
        if(this.isFilled){

        }
    }
    filled(){

        const mesh = this.object.getObjectByName(  this.liquidSample[this.liquidSample.length - this.liquidIndex-1].name)
        //console.log(mesh)
        mesh.visible = true
        GlobalLoader.getInstance().playSound("bloup")

        //this.liquidSample.push(child)
        mesh.material = new THREE.MeshBasicMaterial({color: 0x880088})
        this.liquidIndex = this.liquidIndex + 1
        //console.log(this)
        if(this.liquidIndex < 6){
            setTimeout(() => {this.filled()}, 800);
        }
        else{
            this.loupe.isEnabled = true
            GlobalLoader.getInstance().setMascotVisible()
            GlobalLoader.getInstance().setMascotChangeQuote(8)
            GlobalLoader.getInstance().setSelectedArray(this.loupe.object.children)
        }



    }


    enableButton(){
        GlobalLoader.getInstance().setMascotHidden()
        this.clickHandler = this.buttonMouseClickEvent.bind(this);

        window.addEventListener('click', this.clickHandler)
        this.moveHandler = this.mouseMoveEvent.bind(this);
        window.addEventListener( 'pointermove',this.moveHandler);

    }

    setAction() {


    }

    destroy() {
        window.removeEventListener('click', this.clickHandler)
        window.removeEventListener( 'pointermove',this.moveHandler);
        //console.log("cab destroyed")
    }

}
