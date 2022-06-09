import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Dye} from "./Dye";
import {TestTube} from "./TestTube";
import {AlcoolBottle} from "./AlcoolBottle";
import {transformMeshToPlastic} from "./Glassifier";
import {GlobalLoader} from "./GlobalLoader";
import {EyedropperSupport} from "./EyedropperSupport";
import {CAB} from "./CAB";

export class EyeDropper {
    private stateEnum = Object.freeze({
        Empty:"empty",
        RedDye:"redDye",
        Alcool:"alcool",
        YellowDye:"yellowDye",
        BlueDye:"blueDye",
        Violet:"violet"
    });
    private isMouseDownOnModel:boolean = false;
    private pointer  = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    public object:THREE.Group
    private plane: THREE.Plane;
    private intersects = new THREE.Vector3();
    private camera: THREE.Camera
    private state = this.stateEnum.Empty
    private redDyeObject:Dye

    private alcoolBottle:AlcoolBottle
    private tubeObject:TestTube
    private cameraControler:OrbitControls
    private support:EyedropperSupport
    private cab:CAB
    private isPart3 =false
    private isFirstClick = true

    private buttonMouseClickEvent:Function
    private clickHandler
    private buttonMouseReleaseEvent:Function
    private clickReleaseHandler
    private mouseMoveEvent:Function
    private moveHandler


    constructor() {

         //mousedowxn
         this.buttonMouseClickEvent = () => {

            this.raycaster.set( this.object.position.add(new THREE.Vector3(0,0.5,0)), new THREE.Vector3(0,-1,0) );
            const intersectsDownRed = this.raycaster.intersectObject(this.redDyeObject.object);
            if(intersectsDownRed.length > 0 && this.redDyeObject.capacity>0 && this.state == this.stateEnum.Empty ){
                //triggerranim
                if(this.redDyeObject.object.position.distanceTo(this.object.position)<0.12){
                this.state = this.stateEnum.RedDye
                this.redDyeObject.removeLiquid()
                GlobalLoader.getInstance().playSound("bloup")

                this.colorContent(new THREE.MeshBasicMaterial( {color: 0x880000} ))
                }
                if(!this.tubeObject.hasBeenHiglightedOnce){
                    GlobalLoader.getInstance().setSelectedArray([this.tubeObject.object.children[1].children[1]])
                    this.tubeObject.hasBeenHiglightedOnce = true
                }
            }
            this.raycaster.set( this.object.position.add(new THREE.Vector3(0,0.5,0)), new THREE.Vector3(0,-1,0) );
            const intersectsAlcool = this.raycaster.intersectObject(this.alcoolBottle.object);

            if(intersectsAlcool.length > 0 && this.alcoolBottle.capacity>0 && this.state == this.stateEnum.Empty ){
                //triggerranim
                if(this.alcoolBottle.object.position.distanceTo(this.object.position)<0.12){
                    this.state = this.stateEnum.Alcool
                    this.alcoolBottle.removeLiquid()
                GlobalLoader.getInstance().playSound("bloup")

                    this.colorContent(new THREE.MeshBasicMaterial( {color: 0x000088} ))
                }
                if(!this.tubeObject.hasBeenHiglightedOnce){
                    GlobalLoader.getInstance().setSelectedArray([this.tubeObject.object.children[1].children[1]])
                    this.tubeObject.hasBeenHiglightedOnce = true
                }


            }
            this.raycaster.set( this.object.position.add(new THREE.Vector3(0,0.5,0)), new THREE.Vector3(0,-1,0) );
            const intersectsCabPipe = this.raycaster.intersectObject(this.cab.object.getObjectByName("Valve"));
            console.log(intersectsCabPipe)
            if(intersectsCabPipe.length > 0  ){
                //triggerranim

               if( this.stateEnum.Violet == this.state){

                //TODO higlight button
                this.cab.enableButton()
                GlobalLoader.getInstance().setMascotVisible()
                GlobalLoader.getInstance().setMascotChangeQuote(9)
                GlobalLoader.getInstance().setSelectedArray([this.cab.object.getObjectByName("button_2")])
                
                GlobalLoader.getInstance().playSound("bloup")

                this.removeAllContent()
                //GlobalLoader.getInstance().setSelectedArray(this.support.object.children[0].children)
               }
            }

            this.raycaster.set( this.object.position.add(new THREE.Vector3(0,0.5,0)), new THREE.Vector3(0,-1,0) );
            const intersectsDownTube = this.raycaster.intersectObject(this.tubeObject.object);
            console.log(intersectsDownTube)

            if(intersectsDownTube.length > 0  && this.tubeObject.object.position.distanceTo(this.object.position)<0.12){
                GlobalLoader.getInstance().setSelectedArray([])

                if (this.isPart3 && this.tubeObject.shakeEnded){
                    //console.log("onéla")
                    this.state = this.stateEnum.Violet
                    this.tubeObject.removeAllContent()
                GlobalLoader.getInstance().playSound("bloup")

                    this.colorContent(new THREE.MeshBasicMaterial({color: 0x880088}))
                    GlobalLoader.getInstance().setSelectedArray([this.cab.object.getObjectByName("Valve")])
                }
                else{
                    switch ( this.state) {
                        case this.stateEnum.RedDye:
                            this.tubeObject.addRed(()=>{
                                this.isPart3 = true
                                GlobalLoader.getInstance().setSelectedArray(this.support.object.children[0].children)
                                GlobalLoader.getInstance().setMascotVisible()
                                GlobalLoader.getInstance().setMascotChangeQuote(11)
                            })
                            this.removeAllContent()
                            GlobalLoader.getInstance().playSound("bloup")

                            break
                        case this.stateEnum.Alcool:
                            this.tubeObject.addAlcool(()=>{
                                this.isPart3 = true
                                GlobalLoader.getInstance().setSelectedArray(this.support.object.children[0].children)
                                GlobalLoader.getInstance().setMascotVisible()
                                GlobalLoader.getInstance().setMascotChangeQuote(11)
                            })
                            this.removeAllContent()
                             GlobalLoader.getInstance().playSound("bloup")

                            break

                        default:
                            console.log("pipette vide")
                      }
                      this.state = this.stateEnum.Empty
                }

            }
            this.raycaster.setFromCamera( this.pointer, this.camera );
            const intersects = this.raycaster.intersectObjects(this.object.children);
            if (intersects.length > 0 ){
                if(this.isFirstClick){
                 GlobalLoader.getInstance().setSelectedArray([this.alcoolBottle.object.children[1].children[1],this.redDyeObject.object.children[1].children[0]])
                 this.isFirstClick = false
                }

                this.isMouseDownOnModel = true
                this.cameraControler.enabled = false
                this.tubeObject.isEnabled = false

            }

        }
        //mouseup
        this.buttonMouseReleaseEvent = () => {
            this.isMouseDownOnModel =false
            this.cameraControler.enabled = true

            this.raycaster.set( this.object.position.add(new THREE.Vector3(0,0.5,0)), new THREE.Vector3(0,-1,0) );
            const intersectsSupport = this.raycaster.intersectObject(this.support.object);
            if(intersectsSupport.length>0){

                this.object.position.set(0.2, 0.0, 0)
                if(this.tubeObject.shakeEnded){
                    GlobalLoader.getInstance().setSelectedArray([this.cab.object.getObjectByName("button_2")])         
                }
                else {
                    GlobalLoader.getInstance().setSelectedArray([])   

                }
                    
         

                   
                // }




                //TODO destroy drag & drop listener
                //Todo set
               
                this.tubeObject.isEnabled=true


            }

        }
        //pointermove
        this.mouseMoveEvent = (e) => {
                        // calculate pointer position in normalized device coordinates
            // (-1 to +1) for both components
            //console.log(this.camera)
            this.pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
            this.pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
            if(this.isMouseDownOnModel){

                this.raycaster.setFromCamera(this.pointer, this.camera);
                this.raycaster.ray.intersectPlane(this.plane, this.intersects);
                //console.log(this.intersects)
                //console.log(this.pointer)
                //console.log(this.object.scene.children[0].position)
                // -0.4 is offset to grab on the
                if(this.intersects.y > 0.06 ){
                    this.object.position.set(this.intersects.x, this.intersects.y-0.07, this.intersects.z);
                }

            }

        }


    }

    init(callback: Function,camera:THREE.Camera,plane:THREE.Plane,redDyeObject:Dye,alcoolBottle:AlcoolBottle,tubeObject:TestTube,cameraControler:OrbitControls,support:EyedropperSupport,cab:CAB,) {
        this.camera = camera
        this.cameraControler = cameraControler
        this.plane = plane
        this.alcoolBottle = alcoolBottle
        this.redDyeObject = redDyeObject
        this.tubeObject = tubeObject
        this.support = support
        this.cab = cab


        GlobalLoader.getInstance().getFBXLoaded("eyedropper", (object) => {

            this.object = object

            // const animationAction = this.mixer.clipAction(
            //     (object as THREE.Object3D).animations[0]
            // )
            //this.activeAction = animationAction
            object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    //console.log(child)
                    if (child.name == "Pipette") {
                        transformMeshToPlastic(child, 'test.hdr')
                    }
                    else if (child.name.includes("L")) {
                        //this.liquidSample.push(child)
                        child.visible = false
                    }
                    else if (child.name.includes("bouchon")) {

                        child.visible = false

                    }

                }
            })

            object.scale.set(0.01, 0.01, 0.01)

            object.position.set(0.2, 0.0, 0)

            callback()
        })

        this.clickHandler = this.buttonMouseClickEvent.bind(this);
        window.addEventListener('mousedown', this.clickHandler)
        this.clickReleaseHandler = this.buttonMouseReleaseEvent.bind(this);
        window.addEventListener('mouseup', this.clickReleaseHandler)
        this.moveHandler = this.mouseMoveEvent.bind(this);
        window.addEventListener( 'pointermove',this.moveHandler);
    }


    anim() {

    }
    removeAllContent(){
        this.object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                console.log(child)
                if (child.name.includes("L")) {
                    //this.liquidSample.push(child)
                    child.visible = false
                }


            }
        })
    }
    colorContent(material){
        this.object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                console.log(child)
                if (child.name.includes("L")) {
                    //this.liquidSample.push(child)
                    child.visible = true
                    child.material = material
                }


            }
        })
    }

    setAction() {

    }

    destroy() {
        window.removeEventListener('mousedown', this.clickHandler)
        window.removeEventListener( 'pointermove',this.moveHandler)
        window.removeEventListener('mouseup', this.clickReleaseHandler)

    }
}
