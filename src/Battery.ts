import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Exp1Assembly } from "./Exp1Assembly";
import { exp2Part2Name, GlobalLoader } from "./GlobalLoader";
export class Battery {

    private isMouseDownOnModel: boolean = false;
    private pointer = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    public object: THREE.Group
    private plane: THREE.Plane;
    private intersects = new THREE.Vector3();
    private camera: THREE.Camera
    private controls: OrbitControls
    private target: Exp1Assembly
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
            //console.log(intersectsUranium.length)

            if (intersects.length > 0) {
            
                this.controls.enabled = false
                this.isMouseDownOnModel = true
            }
        }
        //mouseup
        this.buttonMouseReleaseEvent = () => {
            this.isMouseDownOnModel = false
            this.controls.enabled = true

            const intersects = this.raycaster.intersectObjects(this.object.children);
            const intersectsPile = this.raycaster.intersectObject(this.target.object.getObjectByName("battery"));
            if (intersectsPile.length > 0 && intersects.length > 0) {
                this.target.setBatteryLessTransparent()
                this.object.visible = false
                
            }
        }
        //pointermove 
        this.mouseMoveEvent = (e) => {
            this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;
            if (this.isMouseDownOnModel) {
                this.raycaster.setFromCamera(this.pointer, this.camera);
                this.raycaster.ray.intersectPlane(this.plane, this.intersects);
                this.object.position.set(this.intersects.x, this.intersects.y  - 0.025, this.intersects.z);
                
            }
        }

    }
    //true in initialarray stands for red otherwise blue
    init(callback: Function, camera: THREE.Camera, plane: THREE.Plane, controls: OrbitControls, target: THREE.Mesh) {


        this.camera = camera
        this.target = target
        this.controls = controls
        this.plane = plane
        GlobalLoader.getInstance().getGLTFLoaded("battery", (object) => {
            this.object = object
            this.object.scale.set(0.01, 0.01, 0.01)
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
