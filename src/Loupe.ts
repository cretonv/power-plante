import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { exp2Part2Name, GlobalLoader } from "./GlobalLoader";
export class Loupe {

    private isMouseDownOnModel: boolean = false;
    private pointer = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    public object: THREE.Group
    private plane: THREE.Plane;
    public isEnabled = false
    private intersects = new THREE.Vector3();
    private camera: THREE.Camera
    private controls: OrbitControls
    private target: THREE.Mesh
    private buttonMouseClickEvent:Function
    private clickHandler
    private buttonMouseReleaseEvent:Function
    private clickReleaseHandler
    private mouseMoveEvent:Function
    private moveHandler

    constructor() {

        //mousedowxn
        this.buttonMouseClickEvent = () => {
          
            this.raycaster.setFromCamera(this.pointer, this.camera);
            //console.log(this.target)
            const intersects = this.raycaster.intersectObjects(this.object.children);
            const intersectsUranium = this.raycaster.intersectObject(this.target);
            //console.log(intersectsUranium.length)

            if (intersects.length > 0) {
                if (intersectsUranium.length > 0 && this.isEnabled) {
                    console.log("alo?")
                    this.controls.enabled = false;
                    this.controls.minDistance = -Infinity;
                    this.controls.maxDistance = Infinity;
                    this.controls.enableDamping = true;
                    this.controls.minPolarAngle = -Infinity;
                    this.controls.maxPolarAngle = Infinity;
                    this.controls.minAzimuthAngle = -Infinity;
                    this.controls.maxAzimuthAngle = Infinity;
                    this.controls.enablePan = true;
                    
                    document.querySelector('body').classList.add('active');
                    GlobalLoader.getInstance().setNextScene(exp2Part2Name)
                    setTimeout(() => { 
                        this.controls.target.set(0,0,0)
                        GlobalLoader.getInstance().notifyTransitionDone() }, 1100)
                }
                this.controls.enabled = false
                this.isMouseDownOnModel = true
            }
        }
        //mouseup
        this.buttonMouseReleaseEvent = () => {
            this.isMouseDownOnModel = false
            this.controls.enabled = true
        }
        //pointermove 
        this.mouseMoveEvent = (e) => {
            this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;
            if (this.isMouseDownOnModel) {
                this.raycaster.setFromCamera(this.pointer, this.camera);
                this.raycaster.ray.intersectPlane(this.plane, this.intersects);
                this.object.position.set(this.intersects.x, this.intersects.y - 0.01, this.intersects.z);

            }
        }

    }
    //true in initialarray stands for red otherwise blue
    init(callback: Function, camera: THREE.Camera, plane: THREE.Plane, controls: OrbitControls, target: THREE.Mesh) {

        this.camera = camera
        this.target = target
        this.controls = controls
        this.plane = plane
        GlobalLoader.getInstance().getGLTFLoaded("loupe", (object) => {

            this.object = object
            this.object.scale.set(0.006, 0.006, 0.006)
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




    setAction() {

    }

    destroy() {
        window.removeEventListener('mousedown', this.clickHandler)
        window.removeEventListener( 'pointermove',this.moveHandler)
        window.removeEventListener('mouseup', this.clickReleaseHandler)

    }
}
