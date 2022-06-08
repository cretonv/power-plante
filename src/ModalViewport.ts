import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GlobalLoader } from "./GlobalLoader";
import {FirstScene} from "./Scenes/FirstScene";

export class ModalViewport {
    public object: THREE.Group
    public htmlDescriptionElement: HTMLDivElement
    public isVisible: boolean
    public isFirstOpening: boolean
    private mainScene: FirstScene
    public rtScene: THREE.Scene
    private rtCamera: THREE.Camera
    private rtCameraLight: THREE.DirectionalLight
    private rtWarmLight: THREE.DirectionalLight
    private rtColdLight: THREE.DirectionalLight
    private controls: OrbitControls
    private rtRenderer: THREE.WebGLRenderer
    private plane: THREE.PlaneGeometry
    private openModalEvent: Function
    private openHandler
    private closeModalEvent: Function
    private closeHandler



    constructor() {
        this.isVisible = false
        this.isFirstOpening = true
        this.closeModalEvent =  () => {this.closeModal()
        console.log("suppr")}
    }

    init(
        callback:Function,
        htmlDescElement: HTMLDivElement,
        renderer:THREE.WebGLRenderer,
        onModalBtnClick: Function,
        scene: FirstScene,
        gltfName:string
    ) {
        this.openModalEvent = onModalBtnClick
        this.htmlDescriptionElement = htmlDescElement
        this.mainScene = scene

        // Scenes
        this.rtScene = new THREE.Scene()
        this.rtRenderer = renderer

        //removed the renderer

        // Renderer
        // this.rtRenderer = new THREE.WebGLRenderer({
        //     canvas: canvas
        // })
        // this.rtRenderer.setSize(canvas.clientWidth, canvas.clientHeight)

        // Camera
        // this.rtCamera = new THREE.OrthographicCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
        this.rtCamera = new THREE.OrthographicCamera(
            0.7 / - 2,
            0.7 / 2,
            0.4 / 2,
            0.4 / - 2,
            0.1,
            1000
        );
        this.rtCamera.zoom = 0.3
        this.rtCamera.position.z = 2
        this.rtCamera.updateProjectionMatrix();
        this.rtScene.add(this.rtCamera)

        // Controls
        this.controls = new OrbitControls(this.rtCamera, this.rtRenderer.domElement)
        this.controls.enableDamping = true
        this.controls.enableZoom = false

        // Lights
        this.rtCameraLight = new THREE.DirectionalLight(0xFCFFED, 2)
        this.rtCameraLight.position.set(this.rtCamera.position.x, this.rtCamera.position.y + 0.5, this.rtCamera.position.z + 1)
        this.rtScene.add(this.rtCameraLight)
        this.rtWarmLight = new THREE.DirectionalLight(0xFCF9D9, 2)
        this.rtWarmLight.position.set(3, 2, -2)
        this.rtCamera.add(this.rtWarmLight)
        this.rtColdLight = new THREE.DirectionalLight(0xE5FBFF, 1)
        this.rtColdLight.position.set(-3, 2, -1)
        this.rtCamera.add(this.rtColdLight)

        // GLTF
        GlobalLoader.getInstance().getGLTFLoaded(gltfName, (object) => {
            this.object = object
            this.object.scale.set(0.05, 0.05, 0.05)
            this.object.position.set(0, -0.5, 0)
            this.rtScene.add(this.object)
            this.rtCameraLight.lookAt(this.object.position)
            this.rtWarmLight.lookAt(this.object.position)
            this.rtColdLight.target = this.object
            this.openHandler = this.openModalEvent.bind(this);
            this.htmlDescriptionElement.querySelector('a').addEventListener('mousedown', this.openHandler)

            callback()
        })

        // Plane background
        const planeGeometry = new THREE.PlaneGeometry( 2.5, 1.875 );
        const planeTexture = new THREE.TextureLoader().load( '/public/images/textures/gridModal.png' );
        const planeMaterial = new THREE.MeshBasicMaterial( {map: planeTexture, side: THREE.DoubleSide} );
        this.plane = new THREE.Mesh( planeGeometry, planeMaterial );
        this.plane.position.z = -10
        this.rtCamera.add( this.plane );
    }

    setCameraPosition(x: Number, y: Number, z: Number) {
        this.rtCamera.position.x = x
        this.rtCamera.position.y = y
        this.rtCamera.position.z = z
    }

    closeHtml(){
        this.htmlDescriptionElement.classList.remove('visible')
        document.querySelector('.modal-border').classList.remove('visible')
    }

    closeModal() {
        GlobalLoader.getInstance().playSound("click")
        this.isVisible = false
        this.mainScene.removeBlurOnScene()
        this.closeHtml()
        GlobalLoader.getInstance().setIsThereModalOpened(false)
    }

    anim(canvas) {
        if(this.isVisible) {
            if (this.isFirstOpening) {
                this.isFirstOpening = false

                console.log(this.htmlDescriptionElement.querySelector('.close-cross'))
                this.closeHandler = this.closeModalEvent.bind(this);
                this.htmlDescriptionElement.querySelector('.close-cross').addEventListener('mousedown', this.closeHandler)

            }
            this.rtRenderer.setViewport(
                canvas.clientWidth / 2 - ((canvas.clientWidth / 2) / 2),
                canvas.clientHeight - 40 - 0.57 * canvas.clientHeight,
                canvas.clientWidth / 2,
                0.57 * canvas.clientHeight
            )
            //this.rtRenderer.clear()
            this.rtRenderer.render(this.rtScene, this.rtCamera);
            this.rtCameraLight.position.set(this.rtCamera.position.x, this.rtCamera.position.y, this.rtCamera.position.z + 0.05)
        }
    }

    destroy() {

        this.htmlDescriptionElement.querySelector('.close-cross').removeEventListener('mousedown', this.closeHandler)
        this.htmlDescriptionElement.querySelector('a').removeEventListener('mousedown', this.openHandler)

    }
}
