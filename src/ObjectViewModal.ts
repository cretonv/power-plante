import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export class ObjectViewModal {
    private object: THREE.Group
    public plane: THREE.Mesh
    public htmlDescriptionElement: HTMLDivElement
    private renderTarget: THREE.WebGLRenderTarget
    private rtScene: THREE.Scene
    private rtCamera: THREE.Camera
    private rtLight: THREE.Spothlight
    private loader: GLTFLoader
    private controls: OrbitControls

    constructor() {
        this.loader = new GLTFLoader()
    }

    init(filePath: String, htmlDescElement: HTMLDivElement, camera, canvas, renderer) {

        this.htmlDescriptionElement = htmlDescElement

        // Scenes
        this.rtScene = new THREE.Scene()
        this.renderTarget = new THREE.WebGLRenderTarget(1400, 800)

        // Camera
        this.rtCamera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
        this.rtCamera.position.z = 2

        // Controls
        this.controls = new OrbitControls(this.rtCamera, renderer.domElement)
        this.controls.enableDamping = true

        // Light
        this.rtLight = new THREE.SpotLight(0xffffff, 3)
        this.rtLight.position.set(this.rtCamera.position.x, this.rtCamera.position.y, this.rtCamera.position.z + 0.05)
        this.rtScene.add(this.rtLight)

        // GLTF
        this.loader.load(
            filePath,
            (gltf) => {
                gltf.scene.scale.set(0.05, 0.05, 0.05)
                gltf.scene.position.set(0, -0.25, 0)
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

        // Surface who host the target rendering
        const geometry = new THREE.PlaneGeometry( 0.7, 0.4 );
        const material = new THREE.MeshPhongMaterial({
            map: this.renderTarget.texture,
            side: THREE.DoubleSide
        });
        this.plane = new THREE.Mesh( geometry, material );
        this.plane.position.set(0, 0.3, 0.15)
        this.plane.lookAt(camera.position)
        this.plane.visible = false
    }

    anim(renderer, camera) {
        this.plane.lookAt(camera.position)
        renderer.setRenderTarget(this.renderTarget);
        renderer.render(this.rtScene, this.rtCamera);
        renderer.setRenderTarget(null);
        this.rtLight.position.set(this.rtCamera.position.x, this.rtCamera.position.y, this.rtCamera.position.z + 0.05)
    }

    destroy() {
        this.renderTarget.dispose()
    }
}
