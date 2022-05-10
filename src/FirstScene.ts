import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Case} from "./Case";
import {Indication} from "./Indication";
import {ObjectViewModal} from "./ObjectViewModal";

export class FirstScene {
    private sizes: {[name: string]: Number}
    private canvas: HTMLDivElement
    // Three JS elements
    public scene: THREE.Scene
    public renderer: THREE.WebGLRenderer
    public camera: THREE.PerspectiveCamera
    public controls: OrbitControls
    public light: THREE.AmbientLight
    // 3D Objects
    public indications: Indication
    public chamberModal: ObjectViewModal
    public case: Case

    constructor() {
        this.scene = new THREE.Scene()
    }

    init(canvas) {
        this.canvas = canvas
        this.sizes = {
            width: this.canvas.clientWidth,
            height: this.canvas.clientHeight,
        }
        this.initThreeElements()
        this.initSceneObjects()
        this.tick()
    }

    initThreeElements() {
        /**
         * Renderer
         */
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas
        })
        this.renderer.setClearColor(0xFFFFFF, 1)
        this.renderer.setSize(this.sizes.width, this.sizes.height)

        /**
         * Camera
         */
        this.camera = new THREE.PerspectiveCamera(50, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 100)
        this.camera.position.z = 1.3563360735759848
        this.scene.add(this.camera)

        /**
         * Controls
         */
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true

        /**
         * Lights
         */
        this.light = new THREE.AmbientLight( 0x404040, 3.5 )
        // light.position.set(0.8, 1.4, 1.0)
        this.scene.add(this.light)
    }

    initSceneObjects() {
        // Init 2D indications
        const points =  [
            {
                position: new THREE.Vector3(-0.1, 0.05, 0.5),
                element: document.querySelector('.indication-0')
            },
            {
                position: new THREE.Vector3(-0.1, 0.11, 0.5),
                element: document.querySelector('.indication-1')
            }
        ]
        this.indications = new Indication()
        this.indications.init(points)

        // Init modal for chamber
        this.chamberModal = new ObjectViewModal()
        this.chamberModal.init(
            'assets/models/cab/CAB_flo_v-2.gltf',
            document.querySelector('.cab-desc'),
            this.camera,
            this.canvas,
            this.renderer
        )
        this.scene.add(this.chamberModal.plane)

        // Init case
        this.case = new Case()
        this.case.init(() => {
            this.scene.add(this.case.object)
        }, this.camera, this.controls, this.indications, this.chamberModal)
    }

    tick() {
        // const elapsedTime = clock.getElapsedTime()

        // Check canvas size and resolution
        if (this.resizeRendererToDisplaySize()) {
            const aspect = this.canvas.clientWidth / this.canvas.clientHeight
            if (this.camera.isPerspectiveCamera || this.camera.isOrthographicCamera || this.camera.isCamera) {
                this.camera.aspect = aspect
                this.camera.updateProjectionMatrix()
            }
        }

        // Update controls
        this.controls.update()

        // if (modelReady) mixer.update(clock.getDelta())
        this.case.anim(this.camera)
        this.indications.anim(this.camera, this.sizes, this.scene)
        this.chamberModal.anim(this.renderer, this.camera)

        // Render
        this.render()

        // Call tick again on the next frame
        window.requestAnimationFrame(this.tick)
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }

    resizeRendererToDisplaySize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        const needResize = this.canvas.clientWidth !== this.sizes.width || this.canvas.clientHeight !== this.sizes.height;
        if (needResize) {
            this.renderer.setSize(width, height, false);
        }

        return needResize
    }

    destroy() {

    }
}