import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export class ModalViewport {
    private object: THREE.Group
    public htmlDescriptionElement: HTMLDivElement
    public isVisible: boolean
    private rtScene: THREE.Scene
    private rtCamera: THREE.Camera
    private rtLight: THREE.DirectionalLight
    private loader: GLTFLoader
    private controls: OrbitControls
    private rtRenderer: THREE.WebGLRenderer
    private plane: THREE.PlaneGeometry

    constructor() {
        this.loader = new GLTFLoader()
        this.isVisible = false
    }

    init(filePath: String, htmlDescElement: HTMLDivElement, canvas: HTMLDivElement) {

        this.htmlDescriptionElement = htmlDescElement

        // Scenes
        this.rtScene = new THREE.Scene()

        // Renderer
        this.rtRenderer = new THREE.WebGLRenderer({
            canvas: canvas
        })
        this.rtRenderer.setSize(canvas.clientWidth, canvas.clientHeight)

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

        // Light
        this.rtLight = new THREE.DirectionalLight(0xffffff, 1.5)
        this.rtLight.position.set(this.rtCamera.position.x, this.rtCamera.position.y + 0.5, this.rtCamera.position.z + 1)
        this.rtScene.add(this.rtLight)

        // GLTF
        this.loader.load(
            filePath,
            (gltf) => {
                gltf.scene.scale.set(0.05, 0.05, 0.05)
                gltf.scene.position.set(0, -0.5, 0)
                this.object = gltf.scene
                this.rtScene.add(this.object)
                this.rtLight.lookAt(this.object.position)
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )

        // Plane background
        const planeGeometry = new THREE.PlaneGeometry( 2.5, 1.875 );
        const planeTexture = new THREE.TextureLoader().load( 'assets/textures/gridModal.png' );
        const planeMaterial = new THREE.MeshBasicMaterial( {map: planeTexture, side: THREE.DoubleSide} );
        this.plane = new THREE.Mesh( planeGeometry, planeMaterial );
        this.plane.position.z = -10
        this.rtCamera.add( this.plane );
    }

    anim(canvas, renderer: THREE.WebGLRenderer) {
        if(this.isVisible) {
            renderer.setViewport(
                canvas.clientWidth / 2 - ((canvas.clientWidth / 2) / 2),
                canvas.clientHeight - 40 - 0.57 * canvas.clientHeight,
                canvas.clientWidth / 2,
                0.57 * canvas.clientHeight
            )
            renderer.render(this.rtScene, this.rtCamera);
            this.rtLight.position.set(this.rtCamera.position.x, this.rtCamera.position.y, this.rtCamera.position.z + 0.05)
        }
    }

    destroy() {

    }
}
