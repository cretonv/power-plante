import * as THREE from "three"
import {transformMeshToGlass, transformMeshToLed} from "./Glassifier";
import {GlobalLoader} from "./GlobalLoader";
import {Loupe} from "./Loupe";

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
                        this.isFilled = true
                        this.loupe.isEnabled = true
                        GlobalLoader.getInstance().setSelectedArray(this.loupe.object.children)
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

    init(callback: Function, camera: THREE.Camera,loupe:Loupe) {
        this.loupe = loupe
        this.camera = camera

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
        }



    }


    enableButton(){
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
