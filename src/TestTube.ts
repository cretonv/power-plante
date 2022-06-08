import * as THREE from "three"
import * as TWEEN from "@tweenjs/tween.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {EventDispatcher} from "three/src/core/EventDispatcher";
import {transformMeshToGlass} from "./Glassifier";
import {GlobalLoader} from "./GlobalLoader";

export class TestTube extends EventDispatcher {


    public object: THREE.Group
    private shakeamount = 0;
    private intersects = new THREE.Vector3();
    private camera: THREE.Camera
    private controls: OrbitControls
    private pointer = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    private mixer: THREE.AnimationMixer
    private modelReady = false
    private content = { 'Blue': 0, 'Red': 0, 'Yellow': 0, "Alcool": 0 }

    /**
     * State Management
     */
    public isFilled = false
    //to check if is user can shake the tube on part 2
    public isEnabled = false
    public shakeEnded = false
    private liquidSample: Array<THREE.Mesh> = []
    private liquidIndex: number = 0
    private blueMaterial = new THREE.MeshBasicMaterial({ color: 0x000088 })
    private redMaterial = new THREE.MeshBasicMaterial({ color: 0x880000 })
    private isMouseDownOnModel: boolean = false;
    private plane: THREE.Plane;
    private cameraControler: OrbitControls
    private dropzone: THREE.Mesh
    private buttonMouseClickEvent:Function
    private clickHandler
    private buttonMouseReleaseEvent:Function
    private clickReleaseHandler
    private mouseMoveEvent:Function
    private moveHandler
    public hasBeenHiglightedOnce = false

    constructor() {
        super()

        //mousedowxn
        this.buttonMouseClickEvent = () => {

            this.raycaster.setFromCamera(this.pointer, this.camera);
            const intersects = this.raycaster.intersectObjects(this.object.children);
            if (intersects.length > 0) {
                this.isMouseDownOnModel = true
                this.cameraControler.enabled = false

            }

        }
        //mouseup
        this.buttonMouseReleaseEvent = () => {

            this.isMouseDownOnModel = false
            this.cameraControler.enabled = true
            this.raycaster.setFromCamera( this.pointer, this.camera );
            const intersectsSupport = this.raycaster.intersectObject(this.dropzone);
            const intersectsObject = this.raycaster.intersectObject(this.object);
            console.log(intersectsSupport)
            console.log(intersectsObject)
            if (intersectsSupport.length > 0 && intersectsObject.length > 0) {

                this.object.position.set(this.dropzone.position.x, 0, 0)
                console.log("onélà")
                if (!this.shakeEnded) {

                    console.log("fini")
                    this.dropzone.visible = true
                    this.shakeEnded = true
                    this.isEnabled = false;
                    const targetCoords = {
                        x: 0.30,
                        y: this.camera.position.y,
                        z: this.camera.position.z,
                        xf: 0.40,
                        yf: 0.0,
                        zf: 0.0,
                    }
                    console.log(this.camera.rotation)
                    let camPosition = new THREE.Vector3()
                    let camRotation = new THREE.Euler()
                    this.camera.getWorldPosition(camPosition);
                    this.camera.getWorldQuaternion(camRotation);
                    //this.controls.target.set(dirVector.add(this.camera.position))
                    //console.log(dirVector)
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
                        .onComplete(() => {
                            console.log(this.controls.target)
                            this.controls.enabled = true;

                            this.controls.minDistance = 0.35;
                            this.controls.maxDistance = 0.65;
                            this.controls.enableDamping = true;
                            this.controls.enabled = true;
                            this.controls.minPolarAngle = Math.PI - Math.PI / 2 - 0.4;
                            this.controls.maxPolarAngle = Math.PI / 2 - 0.1;
                            this.controls.minAzimuthAngle = -0.4;
                            this.controls.maxAzimuthAngle = 0.4;
                            this.controls.enablePan = false;
                            this.dropzone.visible = false;

                            this.object.traverse((child) => {
                                if (child instanceof THREE.Mesh) {
                                    //console.log(child)

                                    if (child.name.includes("bouchon")) {

                                        child.visible = false


                                    }

                                }
                            })


                            //this.camera.getWorldDirection(this.lookDirection);
                            //this.controls.target.copy(this.camera.position).add(this.lookDirection.multiplyScalar(10));
                            //console.log(this.camera.position)
                        })
                        .start();
                }
                //TODO destroy drag & drop listener
                //Todo set
                //this.tubeObject.isEnabled=true

            }

        }
        //pointermove
        this.mouseMoveEvent = (e) => {

                // calculate pointer position in normalized device coordinates
                // (-1 to +1) for both components
                //console.log(this.camera)
                this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
                this.pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;
                if (this.isMouseDownOnModel && this.isEnabled ) {
                    this.updateMaterial()
                    this.shakeamount += 1
                    this.raycaster.setFromCamera(this.pointer, this.camera);
                    this.raycaster.ray.intersectPlane(this.plane, this.intersects);
                    //console.log(this.intersects)
                    //console.log(this.pointer)
                    //console.log(this.object.scene.children[0].position)
                    // -0.4 is offset to grab on the
                    if (this.intersects.y > 0.065) {
                        this.object.position.set(this.intersects.x, this.intersects.y - 0.065, this.intersects.z);
                        GlobalLoader.getInstance().setSelectedArray([this.dropzone])
                    }

                }

        }

    }

    init(callback: Function, camera: THREE.Camera, controls: OrbitControls, plane: THREE.Plane, cameraControler: OrbitControls, dropzone: THREE.Mesh) {

        this.cameraControler = cameraControler
        this.plane = plane
        this.dropzone = dropzone
        this.controls = controls

        this.camera = camera
        // instantiate a loader
        this.camera = camera

        GlobalLoader.getInstance().getFBXLoaded("testtube", (object) => {
            this.object = object
            this.mixer = new THREE.AnimationMixer(object)

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
    checkIfCompleted(param) {

        //console.log(activity_status)
        if (this.content["Red"] > 1 && this.content["Alcool"] > 1) {
            param()
            param = true
            this.isFilled = true
            console.log("go to shake part")
            //GlobalLoader.getInstance().setNextScene(exp2Part2Name)
            this.object.getObjectByName("bouchon").visible = true
            // AppLiveParameter.getInstance().setCurrentScene("scene2")

            this.clickHandler = this.buttonMouseClickEvent.bind(this);
            window.addEventListener('mousedown', this.clickHandler)
            this.clickReleaseHandler = this.buttonMouseReleaseEvent.bind(this);
            window.addEventListener('mouseup', this.clickReleaseHandler)
            this.moveHandler = this.mouseMoveEvent.bind(this);
            window.addEventListener( 'pointermove',this.moveHandler);



        }
    }
    addRed(param) {
        this.content["Red"] += 1
        console.log("triggeranimtuberouge")
        this.checkIfCompleted(param)
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
    addAlcool(param) {
        this.content["Alcool"] += 1
        console.log("triggeranimalcool")

        this.liquidSetNextLayer(false)
        this.checkIfCompleted(param)
    }
    liquidSetNextLayer(isDye: Boolean) {

        const mesh = this.object.getObjectByName(this.liquidSample[this.liquidSample.length - this.liquidIndex - 1].name)
        //console.log(mesh)
        mesh.visible = true
        //this.liquidSample.push(child)
        if (isDye) {
            mesh.material = this.redMaterial
        }
        else {
            mesh.material = this.blueMaterial
        }
        this.liquidIndex = this.liquidIndex + 1
        //console.log(this)
    }
    removeAllContent(){
        this.object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                //console.log(child)

                if (child.name.includes("L")) {

                    child.visible = false

                }

            }
        })
    }

    updateMaterial() {
        if (this.redMaterial.color.getHex() != this.blueMaterial.color.getHex()) {
            if (this.shakeamount % 1 == 0) {
                if (this.redMaterial.color.getHex() == "0x880044") {
                    console.log("alo")
                    //AppLiveParameter.getInstance().setNextScene("exp2Part3Name")
                }
                this.redMaterial.color = this.redMaterial.color.add(new THREE.Color(0x000001))
                this.blueMaterial.color = this.blueMaterial.color.add(new THREE.Color(0x010000))

            }

        }
        else {
            //AppLiveParameter.getInstance().notifyTransitionDone()

                console.log("fini")
                this.dropzone.visible = true


        }


    }

    anim(delta) {
        if (this.modelReady) this.mixer.update(delta)
    }

    setAction() {

    }

    destroy() {
        window.removeEventListener('mousedown', this.clickHandler)
        window.removeEventListener( 'pointermove',this.moveHandler)
        window.removeEventListener('mouseup', this.clickReleaseHandler)

    }
}
