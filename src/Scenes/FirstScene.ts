import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Case } from "../Case";
import { Indication } from "../Indication";
import { ObjectViewModal } from "../ObjectViewModal";
import { ModalViewport } from "../ModalViewport";
import { loadSceneBackgroundFromHDR } from "../SceneBackgroundLoader";
import { transformMeshToGlass, transformMeshToLed } from "../Glassifier";
import {
    BlendFunction,
    EffectComposer,
    EffectPass,
    OutlineEffect,
    RenderPass,
    KawaseBlurPass
} from "postprocessing";

import { Mascot } from "../Mascot";
import { exp1Name, exp2Part1Name, GlobalLoader } from "../GlobalLoader";
import { ActivityScene } from "./ActivityScene";

export class FirstScene extends ActivityScene {
    private sizes: { [name: string]: Number }
    // private canvas: HTMLDivElement
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
    public modalExp1Viewport: ModalViewport
    public modalExp2Viewport: ModalViewport
    // 2D elements
    public mascot: Mascot
    //Postprocessing
    private outlineEffect: OutlineEffect
    private composer: EffectComposer
    //private selectedObject:Array<THREE.Object3D> = []
    private outlinePass: EffectPass
    private blurPass: KawaseBlurPass


    /**
     * Test
     */
    //private testCube
    constructor() {
        super()
        this.scene = new THREE.Scene()
    }

    init(renderer, controls: OrbitControls, camera: THREE.Camera, clock: THREE.Clock) {
        this.renderer = renderer
        this.camera = camera
        this.controls = controls
        //GlobalLoader.getInstance().getCanvas() = canvas
        // this.sizes = {
        //     width: GlobalLoader.getInstance().getCanvas().clientWidth,
        //     height: GlobalLoader.getInstance().getCanvas().clientHeight,
        // }
        this.initThreeElements()
        this.initPostProcessing()

        this.initSceneObjects()
        //this.tick()
        loadSceneBackgroundFromHDR("hdri_power_plante_flo_v-1.hdr", this.scene)
    }

    setup(): void {
        if (!GlobalLoader.getInstance().getHasLandedBeenLoadedOnce()) {
            this.camera.position.z = 0.5
            this.case.animCameraOnAppear()
<<<<<<< HEAD
            
=======
            document.querySelector('.loader').classList.add('hidden')
            document.querySelector('.canvas-title').classList.remove('hidden')
>>>>>>> 1da800f0761affb43a21cb6e11b3dd1d894b3c1f
        }
        else {
            this.camera.position.x = 0;
            this.controls.enable = true

            this.camera.position.y = 0.8343677459755188;
            this.camera.position.z = 0.49586116341112374;
        }

        this.controls.enableDamping = true
        document.querySelector('body').classList.remove('active');
    }

    initThreeElements = () => {
        /**
         * Renderer
         */
        // this.renderer = new THREE.WebGLRenderer({
        //     canvas: GlobalLoader.getInstance().getCanvas(),
        //     powerPreference: "high-performance",
        //     antialias: false,
        //     stencil: false
        // })
        this.renderer.setClearColor(0xFFFFFF, 1)
        this.renderer.setSize(GlobalLoader.getInstance().getSizes().width, GlobalLoader.getInstance().getSizes().height)
        this.renderer.autoClear = false;
        this.renderer.outputEncoding = THREE.sRGBEncoding


        /**
         * Composer
         */
        this.composer = new EffectComposer(this.renderer);
        //console.log(this.composer)
        /**
         * Camera
        //  */
        // this.camera = new THREE.PerspectiveCamera(50, GlobalLoader.getInstance().getCanvas().clientWidth / GlobalLoader.getInstance().getCanvas().clientHeight, 0.1, 100)
        this.camera.position.z = 0.5
        this.camera.position.y = 0.7
        this.scene.add(this.camera)

        /**
         * Controls
         */
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement)


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
        this.warmLight = new THREE.SpotLight(0xFFFFFF, 1, 2.19);
        this.warmLight.position.set(0, -1.09, 0)
        this.warmLight.lookAt(0, 0, 0)
    }

    initSceneObjects = () => {
        // Init 2D indications
        const points = [
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
        this.modalExp1Viewport = new ModalViewport()
        this.modalExp1Viewport.init(() => {
            this.modalExp1Viewport.object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    //console.log(child)
                    if (child.name == "GLASS_tube" || child.name == "GLASS_dome") {

                        transformMeshToGlass(child, 'hdri_power_plante_flo_v-1.hdr')

                    }
                    else if (child.name.includes("led")) {

                        transformMeshToLed(child, 'hdri_power_plante_flo_v-1.hdr')

                    }
                }
            })
        },
            document.querySelector('.dye-desc'),
            this.renderer,
            () => {
                document.querySelector('body').classList.add('active');
                GlobalLoader.getInstance().playSound("click")
                //TODO change to exp1

                setTimeout(() => {
                    GlobalLoader.getInstance().setNextScene(exp2Part1Name)
                    setTimeout(() => {
                        this.controls.target.set(0, 0, 0)
                        GlobalLoader.getInstance().notifyTransitionDone()
                    }, 1100)
                }, 1100)
            },
            this,
            "exp2"
        )

        // Init ModalViewport
        this.modalExp2Viewport = new ModalViewport()
        this.modalExp2Viewport.init(() => {
            this.modalExp2Viewport.object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    //console.log(child)
                    if (child.name == "GLASS_tube" || child.name == "GLASS_dome") {

                        transformMeshToGlass(child, 'hdri_power_plante_flo_v-1.hdr')

                    }
                    else if (child.name.includes("led")) {

                        transformMeshToLed(child, 'hdri_power_plante_flo_v-1.hdr')

                    }
                }
            })
        },
            document.querySelector('.cab-desc'),
            this.renderer,
            () => {
                                GlobalLoader.getInstance().playSound("click")
                //TODO change to exp1

                setTimeout(() => {
                    GlobalLoader.getInstance().setNextScene(exp1Name)
                    setTimeout(() => {
                        this.controls.target.set(0, 0, 0)
                        GlobalLoader.getInstance().notifyTransitionDone()
                    }, 1100)
                }, 1100)

            },
            this,
            "cab"
        )

        // Init mascot
        this.mascot = new Mascot()
        const quotes = [
            "Salut ! Je suis Glowy, un physicien, et j’ai besoin de ton aide pour refaire fonctionner ma centrale nucléaire à l’uranium recyclé ! Est-tu prêt à aider la planète dans cette “Green Adventure” avec moi ? ",
            "Je te présente le Kit du Petit Physicien ! Comme tu peux le voir il faut recomposer mon kit recyclé d’energie autonome pour qu’il puisse de nouveau purifier l’air et recharger nos appareils sans élécricités pour sauver la planète !",
            "Grâce à tes talents d’apprentis physicien, tu as créer une mini-fission nucléaire naturelle avec ta centrale et ton uranium recyclé ! Cette énergie verte a permis de recharger ta batterie, d’économiser de l’énergie et préserver notre chère planète !",
            "Maintenant que tu as ta mini-centrale retourne vite à la malette pour tester plein d’autres expériences bonnes pour l’environnement !",
            "Bravo ! Tu as pu observer les différentes ondes, le morceau d’uranium produit 3 types d’ondes qui sont présentes partout et qui aident l’écosystème, les animaux et la croissance de tes légumes : les ondes Gamma, Alpha, Beta C est grâce à elles que tu as des frites croustillantes !",
            "Grâce à tes expériences tu as obtenu ton certificat du futur grand physicien nucléaire qui te donne une réduction de 10% sur le kit POWER PLANTE pour continuer tes expériences.  Tu pourras fabriquer des bonbons avec les déchets nucléaires,  faire fonctionner ta lampe sans éléctricité et bien plus encore ! Montre vite ça à tes parents pour continuer !",
            "Si tu veux continuer, achète notre super kit POWER PLANTE en magasin ! Tu pourras avoir accès à plus de 1000 expériences.",
            "Ce que tu vois ici, ce sont les ondes invisibles qui nettoient l’environnement. Clique sur les ondes Gamma, ce sont les plus grosses ondes qui s’occupent du carbone.",
            "Prend ta loupe et observe les particules purificatrice !",
            "Actionne l’interrupteur pour diffuser ton mélange !",
            "Verse le dans le reservoir et actionne l’interrupteur !",
            "Maintenant que tout est rassemblé, secoue vite ta mixture avant les gaz verts ne s’échappe !",
            "Tu es de retour dans ton laboratoire ! Cette fois tu vas pouvoir observer les ondes qui purifient l’air de ta maison chaque jour avec ton kit ! Utilise les différents colorants alimentaires et l’alcool de bambou recyclé avec ton uranium naturel pour les voir !",
            "Impressionant ! Regarde, les leds indiquent que l’uranium naturel a rechargé ta batterie propremment et sans consommer d’éléctricité !",
            "La pile est en place ! Tourne le bouton pour activer la recharge par énergie verte !"
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
        }, this.camera, this.controls, this.indications, this.modalExp1Viewport, this.modalExp2Viewport, 
            () => {
                //console.log("yaaa")
                //console.log(this.case.caseSelectedObject)
                this.outlineEffect.selection.set(this.case.caseSelectedObject);
                //this.outlinePass.recompile()
                //this.composer.addPass(this.outlinePass);

            }, this)
        // const geometry = new THREE.BoxGeometry( 0.01, 1, 1 );
        // const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        // this.testCube = new THREE.Mesh( geometry, material );
        // this.scene.add( this.testCube );


    }
    initPostProcessing = () => {
        this.outlineEffect = new OutlineEffect(this.scene, this.camera, {
            blendFunction: BlendFunction.ADD,
            edgeStrength: 1000,
            pulseSpeed: 0.64,
            visibleEdgeColor: 0xee00ee,
            hiddenEdgeColor: 0x550055,
            blur: true,

            //blur: false,
            //xRay: true
        });
        this.outlineEffect.resolution.width = GlobalLoader.getInstance().getSizes().width
        this.outlineEffect.resolution.height = GlobalLoader.getInstance().getSizes().height

        // this.outlineEffect.selection.add(this.testCube);

        this.blurPass = new KawaseBlurPass()

        //const smaaPass = new EffectPass(this.camera, this.smaaEffect);
        this.outlinePass = new EffectPass(this.camera, this.outlineEffect);

        //this.effect = outlineEffect;
        //this.composer.addPass(new EffectPass(this.camera,this.outlineEffect));
        //this.outlinePass.setEnabled(this.outlinePass.isEnabled())
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.composer.addPass(this.outlinePass);

    }

    resizeRendererToDisplaySize = () => {
        return false//TODO add resize in global
        const width = GlobalLoader.getInstance().getCanvas().width;
        const height = GlobalLoader.getInstance().getCanvas().height;
        const needResize = width !== this.sizes.width || height !== this.sizes.height;
        if (needResize) {
            this.renderer.setSize(width, height, false);
        }

        return needResize
    }

    addBlurOnScene = () => {
        this.composer.addPass(this.blurPass)
    }

    removeBlurOnScene = () => {
        this.composer.removePass(this.blurPass)
    }



    render = () => {

        this.renderer.setViewport(0, 0, GlobalLoader.getInstance().getCanvas().clientWidth, GlobalLoader.getInstance().getCanvas().clientHeight);
        //this.renderer.render(this.scene, this.camera)
        //this.outlineEffect.selection.set(this.selectedObject);

        this.composer.render();
        //console.log(this.outlineEffect.selection);
        // console.log(this.case.caseSelectedObject)
        //console.log(this.composer)
    }

    anim() {
        // Check canvas size and resolution
        if (this.resizeRendererToDisplaySize()) {
            const aspect = GlobalLoader.getInstance().getCanvas().width / GlobalLoader.getInstance().getCanvas().height
            if (this.camera.isPerspectiveCamera || this.camera.isOrthographicCamera || this.camera.isCamera) {
                this.camera.aspect = aspect
                this.camera.updateProjectionMatrix()
            }
        }
        this.renderer.clear()

        // Update controls
        this.controls.update()

        // if (modelReady) mixer.update(clock.getDelta())
        this.case.anim(this.camera)
        this.indications.anim(this.camera, this.scene)

        // Render
        this.render()

        this.modalExp1Viewport.anim(GlobalLoader.getInstance().getCanvas())
        this.modalExp2Viewport.anim(GlobalLoader.getInstance().getCanvas())

        // Call tick again on the next frame
        //window.requestAnimationFrame(tick)


    }

    destroy() {
        this.renderer.setViewport(0, 0, GlobalLoader.getInstance().getCanvas().clientWidth, GlobalLoader.getInstance().getCanvas().clientHeight);
        this.case.destroy()
        this.modalExp1Viewport.closeHtml()
        this.modalExp1Viewport.destroy()
        this.modalExp2Viewport.closeHtml()
        this.modalExp2Viewport.destroy()

    }
}
