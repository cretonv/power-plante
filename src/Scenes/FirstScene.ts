import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Case} from "../Case";
import {Indication} from "../Indication";
import {ObjectViewModal} from "../ObjectViewModal";
import {ModalViewport} from "../ModalViewport";
import { loadSceneBackgroundFromHDR } from "../SceneBackgroundLoader";
import { transformMeshToGlass, transformMeshToLed } from "../Glassifier";
import { BlendFunction, OutlineEffect } from "postprocessing";
import {Mascot} from "../Mascot";

export class FirstScene {
    private sizes: {[name: string]: Number}
    private canvas: HTMLDivElement
    // Three JS elements
    public scene: THREE.Scene
    public renderer: THREE.WebGLRenderer
    public camera: THREE.PerspectiveCamera
    public controls: OrbitControls
    public light: THREE.AmbientLight
    public directionalLight: THREE.DirectionalLight
    public backLight: THREE.DirectionalLight
    public warmLight: THREE.SpotLight
    public coldLight: THREE.PointLight
    // 3D Objects
    public indications: Indication
    public chamberModal: ObjectViewModal
    public case: Case
    public modalViewport: ModalViewport
    // 2D elements
    public mascot: Mascot

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
        loadSceneBackgroundFromHDR("hdri_power_plante_flo_v-1.hdr",this.scene)
    }

    initThreeElements = () => {
        /**
         * Renderer
         */
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas
        })
        this.renderer.setClearColor(0xFFFFFF, 1)
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.autoClear = false;
        this.renderer.outputEncoding = THREE.sRGBEncoding

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
        this.light = new THREE.AmbientLight(0xFFFFFF, 0.3)
        this.light.position.set(0.44, 0.18, 0.34)
        this.scene.add(this.light)
        this.directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.6)
        this.directionalLight.position.set(0.46, 0.13, 0.03)
        this.scene.add(this.directionalLight)
        this.backLight = new THREE.DirectionalLight(0xFFFFFF, 0.4)
        this.backLight.position.set(0, -0.43, -0.3)
        this.warmLight = new THREE.SpotLight( 0xFFFFFF, 1, 2.19 );
        this.warmLight.position.set(0, -1.09, 0)
        this.warmLight.lookAt(0, 0, 0)
    }

    initSceneObjects = () => {
        // Init 2D indications
        const points =  [
            {
                position: new THREE.Vector3(-0.1, 0.05, 0.5),
                element: document.querySelector('.indication-0')
            },
            {
                position: new THREE.Vector3(-0.1, 0.11, 0.5),
                element: document.querySelector('.indication-1')
            },
            {
                position: new THREE.Vector3(-0.045, 0.15, 0.5),
                element: document.querySelector('.indication-2')
            },
            {
                position: new THREE.Vector3(-0.025, 0.30, 0.20),
                element: document.querySelector('.indication-3')
            },
        ]
        this.indications = new Indication()
        this.indications.init(points)

        // Init ModalViewport
        this.modalViewport = new ModalViewport()
        this.modalViewport.init(()=>{
            this.modalViewport.object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    console.log(child)
                    if (child.name == "GLASS_tube" || child.name == "GLASS_dome") {

                        transformMeshToGlass(child, 'hdri_power_plante_flo_v-1.hdr')

                    }
                    else if (child.name.includes("led")) {

                        transformMeshToLed(child, 'hdri_power_plante_flo_v-1.hdr')

                    }
                }
            })
        },
            '/models/cab/cab_flo_v-4.gltf',
            document.querySelector('.cab-desc'),
            this.canvas,
        )

        // Init mascot
        this.mascot = new Mascot()
        const quotes = [
            "Salut ! Je suis Glowy, un physicien, et j’ai besoin de ton aide pour refaire fonctionner ma centrale nucléaire à l’uranium recyclé ! Est-tu prêt à aider la planète dans cette “Green Adventure” avec moi ? ",
            "Je te présente le Kit du Petit Physicien ! Comme tu peux le voir il faut recomposer mon kit recyclé d’energie autonome pour qu’il puisse de nouveau purifier l’air et recharger nos appareils sans élécricités pour sauver la planète !"
        ]
        console.log(document.querySelector('.mascot .quote'))
        this.mascot.init(
            quotes,
            document.querySelector('.mascot'),
            document.querySelector('.mascot .quote')
        )

        // Init case
        this.case = new Case()
        this.case.init(() => {
            this.scene.add(this.case.object)
            this.backLight.target = this.case.object
            // this.directionalLight.target = this.case.object
        }, this.camera, this.controls, this.indications, this.modalViewport, this.mascot)
    }
    initPostProcessing  = () => {
        const outlineEffect = new OutlineEffect(this.scene, this.camera, {
			blendFunction: BlendFunction.SCREEN,
			edgeStrength: 2.5,
			pulseSpeed: 0.0,
			visibleEdgeColor: 0xffffff,
			hiddenEdgeColor: 0x22090a,
			height: 480,
			blur: false,
			xRay: true
		});

		//outlineEffect.selection.set(selection);

		//const smaaPass = new EffectPass(camera, smaaEffect);
		//const outlinePass = new EffectPass(camera, outlineEffect);

		//this.effect = outlineEffect;

    }

    resizeRendererToDisplaySize = () => {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        const needResize = this.canvas.clientWidth !== this.sizes.width || this.canvas.clientHeight !== this.sizes.height;
        if (needResize) {
            this.renderer.setSize(width, height, false);
        }

        return needResize
    }

    tick = () => {
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

        // Render
        this.render()

        this.modalViewport.anim(this.canvas, this.renderer)

        // Call tick again on the next frame
        window.requestAnimationFrame(this.tick)
    }

    render = () => {
        this.renderer.setViewport( 0, 0, this.canvas.clientWidth, this.canvas.clientHeight );
        this.renderer.render(this.scene, this.camera)
    }

    destroy() {

    }
}
