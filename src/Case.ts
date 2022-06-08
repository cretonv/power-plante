import * as THREE from "three"
import * as TWEEN from "@tweenjs/tween.js";
import { Indication } from "./Indication";
import { ModalViewport } from "./ModalViewport";
import { transformMeshToGlass, transformMeshToLed } from "./Glassifier";
import { GlobalLoader} from "./GlobalLoader";
import { FirstScene } from "./Scenes/FirstScene";

export class Case {

    private mixer: THREE.AnimationMixer

    public object: THREE.Group

    private clock: THREE.Clock

    private camera: THREE.Camera

    private indications: Indication

    private activeAction: THREE.AnimationAction;
    private lastAction: THREE.AnimationAction;
    private animationActions: THREE.AnimationAction[];
    private modelReady: boolean;
    private hasBeenOpened: boolean

    // Animations and interactions attributes
    private mouseDown: boolean
    private pointer = THREE.Vector2
    private raycaster = THREE.Raycaster
    private targets: { [name: string]: THREE.Object3D } = {}
    private x0: number

    // Animations blocker var
    private blockLoop: boolean
    private runLastAnim: boolean
    private animEnded: boolean

    // private modelFileName = 'case_flo_v-14.fbx';

    // Other scene elements
    private scene: FirstScene
    private modalExp1: ModalViewport
    private modalExp1Open: boolean
    private modalExp2: ModalViewport
    private modalExp2Open: boolean
    public caseSelectedObject: Array<THREE.Object3D> = []

    // Temporary attributes waiting refacto of main.ts
    private controls: THREE.OrbitControls
    private selectedObjectCallback: Function

    //groups of objects
    private experience1ObjectsNames: Array<string> = ["Pipette", "ColorantBase", "ColorantBase_2", "ColorantBase_3", "Bouchon", "Bouchon_2", "Bouchon_3", "bouchon", "bouchon_2", "bouchon_3", "GLASS_tube", "GLASS_tube_2", "GLASS_tube_3", "GLASS_Alcoolbase", "BouchonAlcool"]
    private experience1Objects: Array<THREE.Mesh> = []
    private experience2ObjectsNames: Array<string> = ["Cloner", "bloc_cab", "base_top", "base_bottom", "dome_place", "plug_battery", "GLASS_dome", "GLASS_Boiteplexy", "battery", "GLASS_tube_4", "base_bottom", "ecroux_top"]
    private experience2Objects: Array<THREE.Mesh> = []
    //status of hover
    private selectedStatus: string = "none"


    //eventlisteners
    private buttonMouseClickEventDocument: Function
    private clickHandlerDocument
    private mouseMoveEventDocument: Function
    private moveHandlerDocument

    private buttonMouseClickEvent1: Function
    private buttonMouseClickEvent2: Function
    private buttonMouseClickEvent3: Function
    private clickHandler
    private buttonMouseReleaseEvent: Function
    private clickReleaseHandler
    private mouseMoveEvent: Function
    private moveHandler
    private isSecondAnimationDone = false

    constructor() {
        this.animationActions = []
        this.modelReady = false
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2(-1000000, -1000000);
        this.mouseDown = false
        this.blockLoop = false
        this.clock = new THREE.Clock()
        this.runLastAnim = false
        this.animEnded = false
        this.modalExp1Open = false
        this.modalExp2Open = false
        this.hasBeenOpened = false

        this.buttonMouseClickEvent1 = (e) => {
            console.log("buttonMouseClicked1")

            e.preventDefault()
            this.mouseDown = true
        }
        this.buttonMouseClickEvent2 = () => {
            console.log("buttonMouseClicked2")
            if (!this.animEnded) {
                this.raycaster.setFromCamera(this.pointer, this.camera);
                const intersects = this.raycaster.intersectObjects(Object.values(this.targets));
                const regex = /case_/g
                for (let i = 0; i < intersects.length; i++) {
                    if (regex.test(intersects[i].object.name) && (!this.modalExp1Open && !this.modalExp2Open)) {
                        this.runLastAnim = true
                        this.indications.points[2].element.classList.add('destroyed')
                        const targetCoords = {
                            x: 0,
                            y: 0.8343677459755188,
                            z: 0.49586116341112374
                        }
                        const coords = { x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z };
                        new TWEEN.Tween(coords)
                            .to({ x: targetCoords.x, y: targetCoords.y, z: targetCoords.z })
                            .onUpdate(() =>
                                this.camera.position.set(coords.x, coords.y, coords.z)
                            )
                            .onComplete(() => {
                                this.hasBeenOpened = true
                                if ((!this.modalExp1Open && !this.modalExp2Open) && !this.animEnded) {
                                    this.controls.enabled = true
                                    this.controls.minPolarAngle = this.controls.getPolarAngle();
                                    this.controls.maxPolarAngle = this.controls.getPolarAngle();
                                    this.controls.minAzimuthAngle = - Infinity;
                                    this.controls.maxAzimuthAngle = Infinity;
                                    this.indications.points[3].element.classList.remove('destroyed')
                                   GlobalLoader.getInstance().setMascotVisible()
                                    this.animEnded = true
                                    GlobalLoader.getInstance().setMascotChangeQuote(1)

                                }
                            })
                            .start();
                        this.detectClickOnCaseElement()
                    }
                }
            }
        }

        this.buttonMouseClickEvent3 = (e) => {
            console.log("buttonMouseClicked3")
            if(!GlobalLoader.getInstance().getIsThereModalOpened()){
                e.preventDefault()
            this.mouseDown = true
            switch (this.selectedStatus) {
                case 'exp1':
                    GlobalLoader.getInstance().setMascotHidden()
                    this.controls.enabled = false
                    this.modalExp1.isVisible = true
                    this.modalExp1Open = true
                    GlobalLoader.getInstance().setIsThereModalOpened(true)
                    GlobalLoader.getInstance().playSound("click")
                    this.modalExp1.object.position.set(0, -0.5, 0)
                    this.modalExp1.object.position.set(0, 0.0, 0)
                    this.modalExp1.rtScene.add(this.modalExp1.object)
                    this.modalExp1.htmlDescriptionElement.classList.add('visible')
                    document.querySelector('.modal-border').classList.add('visible')
                    this.indications.points[3].element.classList.add('destroyed')
                    this.scene.addBlurOnScene()
                    break;
                case 'exp2':
                    
                    GlobalLoader.getInstance().setMascotHidden()
                    this.controls.enabled = false
                    this.modalExp2.setCameraPosition(0, 0, 2)
                    this.modalExp2.isVisible = true
                    this.modalExp2Open = true
                    GlobalLoader.getInstance().setIsThereModalOpened(true)
                    GlobalLoader.getInstance().playSound("click")
                    this.modalExp2.object.position.set(0, -0.5, 0)
                    this.modalExp2.rtScene.add(this.modalExp2.object)
                    this.modalExp2.htmlDescriptionElement.classList.add('visible')
                    document.querySelector('.modal-border').classList.add('visible')
                    this.indications.points[3].element.classList.add('destroyed')
                    this.scene.addBlurOnScene()
                    break;
                default:
                //onfaitrien
            }
            }



        }
        this.buttonMouseReleaseEvent = (e) => {
            console.log("buttonMouserelease")

            e.preventDefault()
            this.mouseDown = false
        }
        this.mouseMoveEvent = (event) => {
            if (!this.blockLoop) {
                this.raycaster.setFromCamera(this.pointer, this.camera);
                const intersects = this.raycaster.intersectObjects(Object.values(this.targets));
                const regex = /packaging_/g
                for (let i = 0; i < intersects.length; i++) {
                    if (this.modelReady
                        && this.activeAction.getClip().name == "Unboxing"
                        && this.mouseDown
                        && regex.test(intersects[i].object.name)) {
                        if (this.x0 == undefined) {
                            this.x0 = event.clientX
                        }
                        const completion =
                            ((event.clientX - this.x0) *
                                this.activeAction.getClip().duration) /
                            ((event.target as HTMLCanvasElement).clientWidth / 3)
                        intersects[i].object.material.transparent = true
                        //intersects[i].object.material.opacity = completion / this.activeAction.getClip().duration
                        this.mixer.setTime(completion)
                        if (completion >= this.activeAction.getClip().duration - (5 * this.activeAction.getClip().duration) / 100) {
                            this.object.getObjectByName("packaging").visible = false
                            this.setAction(this.animationActions[2])
                            this.activeAction.setLoop(THREE.LoopOnce)

                            this.activeAction.clampWhenFinished = true
                            this.indications.points[1].element.classList.add('destroyed')
                            this.indications.points[2].element.classList.remove('destroyed')
                            this.triggerFinalAnimation()
                            this.blockLoop = true

                        }
                    }
                }
            }
        }
        this.buttonMouseClickEventDocument = () => {
            document.querySelector('.canvas-title').classList.add('hidden')
            if (this.modelReady && !this.blockLoop) {
                this.raycaster.setFromCamera(this.pointer, this.camera);
                const intersects = this.raycaster.intersectObjects(Object.values(this.targets));
                const regex = /packaging_/g
                for (let i = 0; i < intersects.length; i++) {
                    if (regex.test(intersects[i].object.name)) {
                        const targetCoords = {
                            x: 0.0021811573810216803,
                            y: 0.30347417279793715,
                            z: 1
                        }
                        const coords = { x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z };
                        new TWEEN.Tween(coords)
                            .to({ x: targetCoords.x, y: targetCoords.y, z: targetCoords.z })
                            .onUpdate(() => {
                                this.camera.position.set(coords.x, coords.y, coords.z)
                            })
                            .onComplete(() => {
                                if (!this.blockLoop) {
                                    this.indications.points[1].element.classList.remove('destroyed')
                                }
                            })
                            .start();
                        this.setAction(this.animationActions[1])
                        this.activeAction.setLoop(THREE.LoopOnce)
                        this.activeAction.clampWhenFinished = true
                        this.controls.enabled = false
                        this.indications.points[0].element.classList.add('destroyed')

                        this.triggerSecondAnimation()

                    }
                }
            }
        }
        this.mouseMoveEventDocument = (e) => {
            // calculate pointer position in normalized device coordinates
            // (-1 to +1) for both components
            const width = document.querySelector('#webgl')?.clientWidth
            const heigth = document.querySelector('#webgl')?.clientHeight
            if (width && heigth) {
                this.pointer.x = (e.clientX / width) * 2 - 1;
                this.pointer.y = - (e.clientY / heigth) * 2 + 1;
            }
            if (this.modelReady && this.hasBeenOpened) {
                this.raycaster.setFromCamera(this.pointer, this.camera);
                const intersectsExp1 = this.raycaster.intersectObjects(this.experience1Objects);
                const intersectsExp2 = this.raycaster.intersectObjects(this.experience2Objects);
                if (intersectsExp1.length > 0) {
                    if (this.selectedStatus != "exp1") {
                        this.selectedStatus = "exp1"
                        this.caseSelectedObject = this.experience1Objects
                        this.selectedObjectCallback()
                    }

                }
                else if (intersectsExp2.length > 0) {
                    if (this.selectedStatus != "exp2") {
                        this.selectedStatus = "exp2"
                        this.caseSelectedObject = this.experience2Objects
                        this.selectedObjectCallback()

                    }

                }
                else if (this.selectedStatus != "none") {
                    this.selectedStatus = "none"
                    this.caseSelectedObject = []
                    this.selectedObjectCallback()

                }

            }
        }

    }

    init(
        callback: Function,
        camera,
        controls,
        indications: Indication,
        modalExp1: ModalViewport,
        modalExp2: ModalViewport,
        selectedObjectCallback: Function,
        scene: FirstScene
    ) {
        console.log("initcase")
        this.camera = camera
        this.scene = scene
        this.controls = controls
        this.indications = indications
        this.modalExp1 = modalExp1
        this.modalExp2 = modalExp2
        this.selectedObjectCallback = selectedObjectCallback
        GlobalLoader.getInstance().getFBXLoaded("case", (object) => {
            this.object = object
            console.log(object)
            this.mixer = new THREE.AnimationMixer(this.object)
            for (let i = 0; i < (this.object as THREE.Object3D).animations.length; i++) {
                const animationAction = this.mixer.clipAction(
                    (this.object as THREE.Object3D).animations[i]
                )
                this.animationActions.push(animationAction)
            }
            this.activeAction = this.animationActions[0]
            this.modelReady = true

            const tempArray: { [name: string]: THREE.Object3D } = {}
            object.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {

                    tempArray[child.name] = child
                    if (child.name.includes("GLASS_" || child.name == "Pipette")) {

                        transformMeshToGlass(child, 'hdri_power_plante_flo_v-1.hdr')

                    }
                    else if (child.name.includes("led")) {

                        transformMeshToLed(child, 'hdri_power_plante_flo_v-1.hdr')

                    }
                    if (this.experience1ObjectsNames.indexOf(child.name) > -1) {
                        this.experience1Objects.push(child)
                    }
                    else if (this.experience2ObjectsNames.indexOf(child.name) > -1) {
                        this.experience2Objects.push(child)
                    }
                }
            })

            this.selectedObjectCallback()
            this.targets = tempArray

            this.activeAction.play()

            object.scale.set(0.01, 0.01, 0.01)

            object.position.set(0, 0, 0)

            callback()
        })
        if(!GlobalLoader.getInstance().getHasLandedBeenLoadedOnce()){
            this.clickHandlerDocument = this.buttonMouseClickEventDocument.bind(this)
            window.addEventListener('mousedown', this.clickHandlerDocument)
            this.moveHandlerDocument = this.mouseMoveEventDocument.bind(this)
            window.addEventListener('pointermove', this.moveHandlerDocument)
        }
        else
        {
            this.hasBeenOpened = true
            this.blockLoop = false
            // this.clickHandlerDocument = this.buttonMouseClickEventDocument.bind(this)
            // window.addEventListener('mousedown', this.clickHandlerDocument)

            this.clickReleaseHandler = this.buttonMouseReleaseEvent.bind(this);
            document.querySelector<HTMLCanvasElement>('#webgl')?.addEventListener('mouseup', this.clickReleaseHandler)

            // this.moveHandler = this.mouseMoveEvent.bind(this);
            // document.querySelector<HTMLCanvasElement>('#webgl')?.addEventListener('pointermove', this.moveHandler);

            this.moveHandlerDocument = this.mouseMoveEventDocument.bind(this)
            window.addEventListener('pointermove', this.moveHandlerDocument)

            this.detectClickOnCaseElement()
        }


    }

    triggerSecondAnimation() {

        console.log("onapsseici")
        if (!this.isSecondAnimationDone) {
            this.isSecondAnimationDone = true

            this.clickHandler = this.buttonMouseClickEvent1.bind(this);
            document.querySelector<HTMLCanvasElement>('#webgl')?.addEventListener('mousedown', this.clickHandler)

            this.clickReleaseHandler = this.buttonMouseReleaseEvent.bind(this);
            document.querySelector<HTMLCanvasElement>('#webgl')?.addEventListener('mouseup', this.clickReleaseHandler)

            this.moveHandler = this.mouseMoveEvent.bind(this);
            document.querySelector<HTMLCanvasElement>('#webgl')?.addEventListener('pointermove', this.moveHandler);

        }
    }

    triggerFinalAnimation() {

        document.querySelector<HTMLCanvasElement>('#webgl')?.removeEventListener('mousedown', this.clickHandler)
        this.clickHandler = this.buttonMouseClickEvent2.bind(this);
        document.querySelector<HTMLCanvasElement>('#webgl')?.addEventListener('mousedown', this.clickHandler)

    }

    detectClickOnCaseElement() {
        // document.querySelector<HTMLCanvasElement>('#webgl')?.addEventListener(
        //     'mousedown',

        // )
        document.querySelector<HTMLCanvasElement>('#webgl')?.removeEventListener('mousedown', this.clickHandler)
        this.clickHandler = this.buttonMouseClickEvent3.bind(this);
        document.querySelector<HTMLCanvasElement>('#webgl')?.addEventListener('mousedown', this.clickHandler)

    }

    animCameraOnAppear() {
        const v = {value: 0}
        const distance = this.camera.position.distanceTo(this.object.position)
        new TWEEN.Tween(v)
            .to({ value: 2 * Math.PI}, 4000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(() => {
                this.camera.position.set(distance * Math.sin(v.value), this.camera.position.y, distance * Math.cos(v.value))
                this.camera.lookAt(new THREE.Vector3(0, 0, 0))
            })
            .onComplete(()=>{
                GlobalLoader.getInstance().setMascotVisible()
                GlobalLoader.getInstance().setMascotChangeQuote(0)
            })
            .start();
    }

    anim(camera) {
        TWEEN.update();
        if (this.modelReady) {
            this.raycaster.setFromCamera(this.pointer, camera);
            if (this.blockLoop && this.runLastAnim) {
                this.mixer.update(this.clock.getDelta())
            }
        }
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

    destroy() {
        window.removeEventListener('mousedown', this.clickHandlerDocument)
        window.removeEventListener('pointermove', this.moveHandlerDocument)
        document.querySelector<HTMLCanvasElement>('#webgl')?.removeEventListener('mousedown', this.clickHandler)
        document.querySelector<HTMLCanvasElement>('#webgl')?.removeEventListener('pointermove', this.moveHandler);
        document.querySelector<HTMLCanvasElement>('#webgl')?.removeEventListener('mouseup', this.clickReleaseHandler)



    }
}
