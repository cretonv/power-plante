import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { exp2Part2Name, GlobalLoader } from "./GlobalLoader";
export class Loupe {

    private isMouseDownOnModel: boolean = false;
    private pointer = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    public object: THREE.Group
    private modelFileName: string = "magnifyingglass_sam_v-2.gltf";
    private plane: THREE.Plane;
    public isEnabled = false
    private intersects = new THREE.Vector3();
    private camera: THREE.Camera
    private controls: OrbitControls
    private target: THREE.Mesh

    constructor() {

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

        window.addEventListener('mousedown', () => {

            GlobalLoader.getInstance().setNextScene(exp2Part2Name)
            this.raycaster.setFromCamera(this.pointer, this.camera);
            console.log(this.target)
            const intersects = this.raycaster.intersectObjects(this.object.children);
            const intersectsUranium = this.raycaster.intersectObject(this.target);
            console.log(intersectsUranium.length)

            if (intersects.length > 0) {
                if (intersectsUranium.length > 0) {

                    this.controls.minDistance = -Infinity;
                    this.controls.maxDistance = Infinity;
                    this.controls.enableDamping = true;
                    this.controls.minPolarAngle = -Infinity;
                    this.controls.maxPolarAngle = Infinity;
                    this.controls.minAzimuthAngle = -Infinity;
                    this.controls.maxAzimuthAngle = Infinity;
                    this.controls.enablePan = true;
                    // document.querySelector('body').classList.add('active');
                    setTimeout(() => { GlobalLoader.getInstance().notifyTransitionDone() }, 1100)
                }
                this.controls.enabled = false
                this.isMouseDownOnModel = true
            }
        })

        window.addEventListener('mouseup', () => {
            this.isMouseDownOnModel = false
            this.controls.enabled = true
        })

        window.addEventListener('pointermove', (e) => {
            // calculate pointer position in normalized device coordinates
            // (-1 to +1) for both components
            //console.log(this.camera)
            this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;
            if (this.isMouseDownOnModel) {
                this.raycaster.setFromCamera(this.pointer, this.camera);
                this.raycaster.ray.intersectPlane(this.plane, this.intersects);
                //console.log(this.intersects)
                //console.log(this.pointer)
                //console.log(this.object.scene.children[0].position)
                // -0.4 is offset to grab on the
                this.object.position.set(this.intersects.x, this.intersects.y - 0.01, this.intersects.z);

            }
        });
    }


    anim() {

    }




    setAction() {

    }

    destroy() {

    }
}
