import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import * as THREE from "three"
import * as TWEEN from "@tweenjs/tween.js";
import {Indication} from "./Indication";
import {ModalViewport} from "./ModalViewport";

export class Case {

    private mixer: THREE.AnimationMixer

    public object: THREE.Group

    private clock: THREE.Clock

    private indications: Indication

    private loader: FBXLoader;
    private activeAction: THREE.AnimationAction;
    private lastAction: THREE.AnimationAction;
    private animationActions: THREE.AnimationAction[];
    private modelReady: boolean;

    // Animations and interactions attributes
    private mouseDown: boolean
    private pointer = THREE.Vector2
    private raycaster = THREE.Raycaster
    private targets: {[name: string]: THREE.Object3D} = {}
    private x0: number

    // Animations blocker var
    private blockLoop: boolean
    private runLastAnim: boolean
    private animEnded: boolean

    private modelFileName = 'case_flo_v-13.fbx';

    private modal: ModalViewport
    private modalOpen: boolean

    // Temporary attributes waiting refacto of main.ts
    private controls: THREE.OrbitControls

    constructor() {
        this.loader = new FBXLoader()
        this.animationActions = []
        this.modelReady = false
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2(-1000000, -1000000);
        this.mouseDown = false
        this.blockLoop = false
        this.clock = new THREE.Clock()
        this.runLastAnim = false
        this.animEnded = false
        this.modalOpen = false
    }

    init(callback: Function, camera, controls, indications: Indication, modal: ModalViewport) {
        this.controls = controls
        this.indications = indications
        this.modal = modal
        this.loader.load(
           `/models/case/${this.modelFileName}`,
            (object: THREE.Group) => {
                this.object = object
                console.log(object)
                this.mixer = new THREE.AnimationMixer(this.object)
                for(let i = 0; i < (this.object as THREE.Object3D).animations.length; i++) {
                    const animationAction = this.mixer.clipAction(
                        (this.object as THREE.Object3D).animations[i]
                    )
                    this.animationActions.push(animationAction)
                }
                this.activeAction = this.animationActions[0]
                this.modelReady = true

                const tempArray: {[name: string]: THREE.Object3D} = {}
                object.traverse( (child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        tempArray[child.name] = child
                    }
                })
                this.targets = tempArray

                this.activeAction.play()

                object.scale.set(-0.01, 0.01, 0.01)

                object.position.set(0, 0, 0)
                callback()
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )

        window.addEventListener( 'pointermove', (e) => {
            // calculate pointer position in normalized device coordinates
            // (-1 to +1) for both components
            const width = document.querySelector('#webgl')?.clientWidth
            const heigth = document.querySelector('#webgl')?.clientHeight
            if(width && heigth) {
                this.pointer.x = ( e.clientX / width ) * 2 - 1;
                this.pointer.y = - ( e.clientY / heigth ) * 2 + 1;
            }
        });

        window.addEventListener('mousedown', () => {
            if(this.modelReady && !this.blockLoop) {
                this.raycaster.setFromCamera( this.pointer, camera );
                const intersects = this.raycaster.intersectObjects(Object.values(this.targets));
                const regex = /packaging_/g
                for ( let i = 0; i < intersects.length; i ++ ) {
                    if(regex.test(intersects[i].object.name)) {
                        const targetCoords = {
                            x: 0.0021811573810216803,
                            y: 0.30347417279793715,
                            z: 1.3563360735759848
                        }
                        const coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
                        new TWEEN.Tween(coords)
                            .to({ x: targetCoords.x, y: targetCoords.y, z: targetCoords.z })
                            .onUpdate(() => {
                                camera.position.set(coords.x, coords.y, coords.z)
                            })
                            .onComplete(() => {
                                if(!this.blockLoop) {
                                    this.indications.points[1].element.classList.remove('destroyed')
                                }
                            })
                            .start();
                        this.setAction(this.animationActions[1])
                        this.activeAction.setLoop(THREE.LoopOnce)
                        this.activeAction.clampWhenFinished = true
                        controls.enabled = false
                        this.indications.points[0].element.classList.add('destroyed')
                        this.triggerSecondAnimation(camera)
                    }
                }
            }
        })
    }

    triggerSecondAnimation(camera) {
        document.querySelector<HTMLCanvasElement>('#webgl')?.addEventListener(
            'mousedown',
            (e) => {
                e.preventDefault()
                this.mouseDown = true
            }
        )
        document.querySelector<HTMLCanvasElement>('#webgl')?.addEventListener(
            'mouseup',
            (e) => {
                e.preventDefault()
                this.mouseDown = false
            }
        )
        document.querySelector<HTMLCanvasElement>('#webgl')?.addEventListener(
            'mousemove',
            (event) => {
                if(!this.blockLoop) {
                    this.raycaster.setFromCamera( this.pointer, camera );
                    const intersects = this.raycaster.intersectObjects(Object.values(this.targets));
                    const regex = /packaging_/g
                    for ( let i = 0; i < intersects.length; i ++ ) {
                        if (this.modelReady
                            && this.activeAction.getClip().name == "Unboxing"
                            && this.mouseDown
                            && regex.test(intersects[i].object.name))
                        {
                            if (this.x0 == undefined) {
                                this.x0 = event.clientX
                            }
                            const completion =
                                ((event.clientX - this.x0) *
                                this.activeAction.getClip().duration) /
                                ((event.target as HTMLCanvasElement).clientWidth / 3)
                            intersects[i].object.material.transparent = true
                            intersects[i].object.material.opacity = completion / this.activeAction.getClip().duration
                            this.mixer.setTime(completion)
                            if (completion >= this.activeAction.getClip().duration - (5 * this.activeAction.getClip().duration) / 100) {
                                this.object.getObjectByName("packaging").visible = false
                                this.setAction(this.animationActions[2])
                                this.activeAction.setLoop(THREE.LoopOnce)
                                this.activeAction.clampWhenFinished = true
                                this.indications.points[1].element.classList.add('destroyed')
                                this.indications.points[2].element.classList.remove('destroyed')
                                this.triggerFinalAnimation(camera)
                                this.blockLoop = true
                            }
                        }
                    }
                }
            }
        )
    }

    triggerFinalAnimation(camera) {
        document.querySelector<HTMLCanvasElement>('#webgl')?.addEventListener(
            'mousedown',
            () => {
                if(!this.animEnded) {
                    this.raycaster.setFromCamera( this.pointer, camera );
                    const intersects = this.raycaster.intersectObjects(Object.values(this.targets));
                    const regex = /case_/g
                    for ( let i = 0; i < intersects.length; i ++ ) {
                        if(regex.test(intersects[i].object.name) && !this.modalOpen) {
                            this.runLastAnim = true
                            this.indications.points[2].element.classList.add('destroyed')
                            const targetCoords = {
                                x: 0,
                                y: 0.8343677459755188,
                                z: 0.49586116341112374
                            }
                            const coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
                            new TWEEN.Tween(coords)
                                .to({ x: targetCoords.x, y: targetCoords.y, z: targetCoords.z })
                                .onUpdate(() =>
                                    camera.position.set(coords.x, coords.y, coords.z)
                                )
                                .onComplete(() => {
                                    if(!this.modalOpen) {
                                        this.controls.enabled = true
                                        this.controls.minPolarAngle = this.controls.getPolarAngle();
                                        this.controls.maxPolarAngle = this.controls.getPolarAngle();
                                        this.controls.minAzimuthAngle = - Infinity;
                                        this.controls.maxAzimuthAngle = Infinity;
                                        this.indications.points[3].element.classList.remove('destroyed')
                                    }
                                })
                                .start();
                            this.detectClickOnCaseElement(camera)
                        }
                    }
                }
            }
        )
    }

    detectClickOnCaseElement(camera) {
        document.querySelector<HTMLCanvasElement>('#webgl')?.addEventListener(
            'mousedown',
            () => {
                this.raycaster.setFromCamera(this.pointer, camera);
                const intersects = this.raycaster.intersectObjects(Object.values(this.targets));
                for ( let i = 0; i < intersects.length; i ++ ) {
                    if(intersects[i].object.name === "bloc_cab") {
                        this.controls.enabled = false
                        this.modal.isVisible = true
                        this.modalOpen = true
                        this.modal.htmlDescriptionElement.classList.add('visible')
                        document.querySelector('.modal-border').classList.add('visible')
                        this.indications.points[3].element.classList.add('destroyed')
                    }
                }
            }
        )
    }

    anim(camera) {
        TWEEN.update();
        if(this.modelReady) {
            this.raycaster.setFromCamera( this.pointer, camera );
            if(this.blockLoop && this.runLastAnim) {
                this.mixer.update(this.clock.getDelta())
            }
        }
    }

    setAction(toAction: THREE.AnimationAction) {
        if (toAction != this.activeAction) {
            this.lastAction = this.activeAction
            this.activeAction = toAction
            this.lastAction.stop()
            //lastAction.fadeOut(1)
            this.activeAction.reset()
            //activeAction.fadeIn(1)
            this.activeAction.play()
        }
    }

    destroy() {

    }
}
