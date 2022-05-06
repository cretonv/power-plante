import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export class ObjectViewModal {
    private object: THREE.Group
    public plane: THREE.Mesh
    private renderTarget: THREE.WebGLRenderTarget
    private rtScene: THREE.Scene
    private rtCamera: THREE.Camera
    private testCube: THREE.Mesh
    private loader: GLTFLoader
    private controls: OrbitControls

    constructor() {
        this.loader = new GLTFLoader()
    }

    init(filePath: String, camera, canvas, renderer) {

        // Scene
        this.rtScene = new THREE.Scene()
        this.renderTarget = new THREE.WebGLRenderTarget(1400, 800)

        // Camera
        this.rtCamera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
        this.rtCamera.position.z = 2
        // this.rtScene.add(this.rtCamera)

        // Controls
        this.controls = new OrbitControls(this.rtCamera, renderer.domElement)
        this.controls.enableDamping = true

        // Light
        const light = new THREE.SpotLight(0xffffff, 3)

        light.position.set(1, -1, 5)
        this.rtScene.add(light)

        // GLTF
        this.loader.load(
            filePath,
            (gltf) => {
                console.log("🧠")
                console.log(gltf)
                gltf.scene.scale.set(0.05, 0.05, 0.05)
                gltf.scene.position.set(0, -0.25, 0)
                this.rtScene.add(gltf.scene)
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )

        // Test cube
        const cube_geometry = new THREE.BoxGeometry( 1, 1, 1);
        const cube_material = new THREE.MeshBasicMaterial( {color: 0x000000} );
        this.testCube = new THREE.Mesh( cube_geometry, cube_material );
        this.testCube.position.set(0, 0, 0)
        this.testCube.rotateY(90)
        // this.rtScene.add(this.testCube)

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
    }

    destroy() {
        this.renderTarget.dispose()
    }
}
