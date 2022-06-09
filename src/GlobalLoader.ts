import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Experience2Part1 } from "./Scenes/Experience2Part1";
import { Experience1 } from "./Scenes/Experience1";
import { Experience2Part2 } from "./Scenes/Experience2Part2";
import { FirstScene } from "./Scenes/FirstScene";
import { ActivityScene } from "./Scenes/ActivityScene";
import {VisualLoader} from "./VisualLoader";
import { Mascot } from "./Mascot";
import {Indication} from "./Indication";

export const landingName = "landingName"
export const exp2Part1Name = "exp2Part1Name"
export const exp2Part2Name = "exp2Part2Name"
export const exp1Name = "exp1Name"

export var GlobalLoader = (function () {
  var constructeur = function () {
    // @ts-ignore
    this.getCurrentScene = function (thisSceneId = sceneId): ActivityScene {

      switch (thisSceneId) {
        case exp2Part1Name:
          return exp2Part1Scene
          break;
        case landingName:
          return landingScene
          break;
        case exp2Part2Name:
          return exp2Part2Scene
          break;
        case exp1Name:
          return exp1Scene
          break;
        default:
          console.log(`on est peredu` + thisSceneId + "  " + landingName + (landingName == thisSceneId));
      }
    }
    this.loadScene = function (renderer, controls: OrbitControls, camera: THREE.Camera, clock: THREE.Clock, thisSceneId = sceneId) {
      console.log(   this.getCurrentScene(thisSceneId))
      this.getCurrentScene(thisSceneId).init(renderer, controls, camera, clock)
    }

    this.destroyScene = function (sceneToDestroy) {

      this.getCurrentScene(sceneToDestroy).destroy()

    }

    this.setNextScene = function(newId:string) {
      nextSceneId = newId
      this.loadScene(renderer, controls, camera, clock, newId)
    }


    this.notifyTransitionDone = function() {
      mascot.hide()
      hasLandedBeenLoadedOnce = true
      oldSceneId = sceneId
      sceneId = nextSceneId
      isThereModalOpened = false
      instance.getCurrentScene().setup()
      nextSceneId = "none";
      this.destroyScene(oldSceneId)

    }
    this.playSound = function (soundName) {
      AudioArray[soundName].play()
    }

    this.getCurrentBackground = function () {
      return backgroundtexture
    }
    this.getNumberLoaded = function () {
      return Math.round(numberLoaded * 100 / 23)
    }
    this.setCurrentBackground = function () {
      backgroundtexture
    }

    this.setMascotVisible = function () {
      mascot.makeVisible()

    }

    this.setMascotHidden = function () {
      mascot.hide()

    }

    this.setMascotAlternateVisible = function () {
      mascot.makeVisibleAlternative()

    }

    this.setMascotChangeQuote = function (index) {
      mascot.changeActiveQuote(index)
    }

    this.getIndications = () => {
      return indications
    }

    this.getIsThereModalOpened = function () {
      return isThereModalOpened
    }
    this.setIsThereModalOpened = function (bool) {
      isThereModalOpened = bool
    }

    this.setMascotCallback= function (callback:Function , name){
      mascot.addEventOnButton(callback,name)
    }

    this.getFBXLoaded = function (name: string, callback: Function) {
      return callback(FbxArray[name])
    }
    this.getGLTFLoaded = function (name: string, callback: Function) {
      return callback(GltfArray[name])
    }
    this.getSelectedArray = function () {

      return selectedObjects
    }
    this.setSelectedArray = function (array) {
      selectedObjects = array
      instance.getCurrentScene().reloadSelectedLayer()

    }
    this.getSizes = function () {
      return sizes
    }

    this.getCanvas = function (): HTMLCanvasElement {
      return canvas
    }

    this.getLoadState = function () {
      if (numberLoaded == 23) {
        if (firstsceneloaded) {
          return true
        }
        console.log("onload")
        instance.loadScene(renderer, controls, camera, clock)
        window.setTimeout(() => {
          instance.getCurrentScene().setup()
          console.log("remove loader here ")
          //TODO remove loader here
        }, 6000)
        firstsceneloaded = true
        return true
      }
      return false
    }

    this.getHasLandedBeenLoadedOnce = function () {
      return hasLandedBeenLoadedOnce
    }
  }

  // variables for scene state management
  var sceneId = landingName;
  var nextSceneId = "none";
  var oldSceneId = "none";
  var fbxLoader = new FBXLoader()
  var gltfLoader = new GLTFLoader()
  var audioLoader = new THREE.AudioLoader();
  var listener:THREE.AudioListener
  var firstsceneloaded = false
  var isThereModalOpened = false

  let hasLandedBeenLoadedOnce = false

  var landingScene: FirstScene = null
  var exp2Part1Scene: Experience2Part1 = null
  //TODO Change Scene When this will be imported
  var exp2Part2Scene: Experience2Part2 = null
  var exp1Scene: Experience1 = null
  var renderer
  var controls
  var camera
  var clock
  var canvas
  var sizes
  var selectedObjects

  let visualLoader: VisualLoader
  let mascot = new Mascot()
  const quotes = [
    "Salut ! Je suis Glowy, un physicien, et j’ai besoin de ton aide pour refaire fonctionner ma centrale nucléaire à l’uranium recyclé ! Es-tu prêt à aider la planète dans cette “Green Adventure” avec moi ? ",
    "Je te présente le Kit du Petit Physicien ! Comme tu peux le voir il faut recomposer mon kit recyclé d’énergie autonome pour qu’il puisse de nouveau purifier l’air et recharger nos appareils sans électricité pour sauver la planète !",
    "Grâce à tes talents d’apprenti physicien, tu as créé une mini-fission nucléaire naturelle avec ta centrale et ton uranium recyclé ! Cette énergie verte a permis de recharger ta batterie, d’économiser de l’énergie et préserver notre chère planète !",
    "Maintenant que tu as ta mini-centrale retourne vite à la malette pour tester plein d’autres expériences bonnes pour l’environnement !",
    "Bravo ! Tu as pu observer les différentes ondes, le morceau d’uranium produit 3 types d’ondes qui sont présentes partout et qui aident l’écosystème, les animaux et la croissance de tes légumes : les ondes Gamma, Alpha et Beta ! C'est grâce à elles que tu as des frites croustillantes !",
    "Grâce à tes expériences tu as obtenu ton certificat du futur grand physicien nucléaire qui te donne une réduction de 10% sur le kit POWER PLANTE pour continuer tes expériences.  Tu pourras fabriquer des bonbons avec les déchets nucléaires,  faire fonctionner ta lampe sans électricité et bien plus encore ! Montre vite ça à tes parents pour continuer !",
    "Si tu veux continuer, achète notre super kit POWER PLANTE en magasin ! Tu pourras avoir accès à plus de 1000 expériences.",
    "Ce que tu vois ici, ce sont les ondes invisibles qui nettoient l’environnement. Clique sur les ondes Gamma, ce sont les plus grosses ondes qui s’occupent du carbone.",
    "Prend ta loupe et observe les particules purificatrices !",
    "Actionne l’interrupteur pour diffuser ton mélange !",
    "Pose le tube à essais sur la droite !  Ensuite récupère le liquide violet et met le dans le reservoir!",
    "Maintenant que tout est rassemblé, secoue vite ta mixture avant que les gaz violets ne s’échappent !",
    "Tu es de retour dans ton laboratoire ! Cette fois tu vas pouvoir observer les ondes qui purifient l’air de ta maison chaque jour avec ton kit ! Utilise les différents colorants alimentaires et l’alcool de bambou recyclé avec ton uranium naturel pour les voir !",
    "Impressionnant ! Regarde, les leds indiquent que l’uranium naturel a rechargé ta batterie proprement et sans consommer d’électricité !",
    "La pile est en place ! Tourne le bouton pour activer la recharge par énergie verte !",
    "Réassemble la centrale recyclée pour pouvoir recharger tes batteries de manière naturelle !",
    "Bravo ! Ta centrale naturelle fonctionne ! Maintenant trouve le cache où mettre ta pile rechargeable !",
    "Plus qu'à mettre ta Pile sous le cache !"
  ]

  // Init 2D indications
  const points = [
    {
      position: new THREE.Vector3(-0.1, 0.11, 0.1),
      element: document.querySelector('.indication-0')
    },
    {
      position: new THREE.Vector3(-0.1, 0.16, 0.5),
      element: document.querySelector('.indication-1')
    },
    {
      position: new THREE.Vector3(-0.045, 0.15, 0.5),
      element: document.querySelector('.indication-2')
    },
    {
      position: new THREE.Vector3(-0.01, 0.1, 0.1),
      element: document.querySelector('.indication-3')
    },
    {
      position: new THREE.Vector3(-0.18147988683353248, 0.02033084751348027, -0.18),
      element: document.querySelector('.indication-4')
    },
    {
      position: new THREE.Vector3(0.118, 0.02, 0.205),
      element: document.querySelector('.indication-5')
    },
    {
      position: new THREE.Vector3(0.18147988683353248, 0.02033084751348027, -0.08),
      element: document.querySelector('.indication-6')
    },
    {
      position: new THREE.Vector3(0.10, 0.075, -0.06),
      element: document.querySelector('.indication-7')
    },
    {
      position: new THREE.Vector3(0.075, 0.1, 0),
      element: document.querySelector('.indication-8')
    },
  ]
  let indications = new Indication()
  indications.init(points)

  var backgroundtexture = null;
  var FbxArray: { string: THREE.Group } = {
    string: undefined
  }
  var GltfArray: { string: THREE.Group } = {
    string: undefined
  }
  var AudioArray: { string: THREE.Audio } = {
    string: undefined
  }
  var numberLoaded = 0
  var instance = null;


  return new function () {
    this.getInstance = function () {
      if (instance == null) {

        instance = new constructeur();
        instance.constructeur = null;
        //Load all scenes ( no init for now )
        landingScene = new FirstScene()
        exp2Part1Scene = new Experience2Part1()
        exp2Part2Scene = new Experience2Part2()

        exp1Scene = new Experience1()
        visualLoader = new VisualLoader()

        listener = new THREE.AudioListener();

        mascot.init(
            quotes,
            document.querySelector('.mascot')
        )

        loadFBX(fbxLoader, FbxArray, "case", "case/case_flo_v-16.fbx", () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger")
        })
        loadFBX(fbxLoader, FbxArray, "dye", "dye/dyeRed_animation_sam_v-2.fbx", () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger")
        })
        loadFBX(fbxLoader, FbxArray, "eyedropper", "eyedropper/eyedropper_animation_sam_v-2.fbx", () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger")

        })
        loadFBX(fbxLoader, FbxArray, "testtube", "testtube/testtube_animation_v-2.fbx", () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger")

        })
        loadFBX(fbxLoader, FbxArray, "cab", "cab/cab_experience2_animation_sam_v3.fbx", () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger")

        })
        loadFBX(fbxLoader, FbxArray, "alcoolbottle", "alcoolbottle/alcohol_animation_sam_v-2.fbx", () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger")

        })
        loadFBX(fbxLoader, FbxArray, "cabAnim", "cab/exp1_flo_v-5.fbx", () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger")

        })
        loadGltf(gltfLoader, GltfArray, "cab", "cab/cab_flo_v-4.gltf", () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger gltf ")
          //console.log(GltfArray)

        })

        loadGltf(gltfLoader, GltfArray, "decor", "decor/decor_flo_v-4.gltf", () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger gltf ")
          //console.log(GltfArray)

        })

        loadGltf(gltfLoader, GltfArray, "support", "eyedropper-support/support-pipette_flo_v-1.gltf", () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger gltf ")
          //console.log(GltfArray)

        })


        loadGltf(gltfLoader, GltfArray, "uranium", "uranium/uranium_flo_v-1.gltf", () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger gltf ")
          //console.log(GltfArray)

        })

        loadGltf(gltfLoader, GltfArray, "battery", "battery/battery_sam_v-2.gltf", () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger gltf ")
          //console.log(GltfArray)

        })

        loadGltf(gltfLoader, GltfArray, "exp2", "exp2/popup_exp2.gltf", () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger gltf ")
          //console.log(GltfArray)

        })

        loadGltf(gltfLoader, GltfArray, "loupe", "loupe/magnifyingglass_sam_v-2.gltf", () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger gltf ")
          //console.log(GltfArray)

        })
        loadSound(audioLoader,listener, AudioArray , 'turn','Cab_qui_tourne.mp3', () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger son")
        })
        loadSound(audioLoader,listener, AudioArray , 'metal','Click_metal_Glowy.mp3', () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger son")
        })
        loadSound(audioLoader,listener, AudioArray , 'click','Click3.mp3', () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger son")
        } )
        loadSound(audioLoader,listener, AudioArray , 'led','Click.mp3', () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger son")
        },false,0.25)
        loadSound(audioLoader,listener, AudioArray , 'musique','musique.mp3', () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger son")
          GlobalLoader.getInstance().playSound("musique")
        },true,0.2)
        loadSound(audioLoader,listener, AudioArray , 'wrong','erreur_interdiction.mp3', () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger son")
        },false,6)
        loadSound(audioLoader,listener, AudioArray , 'end','experiencefinis.mp3', () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger son")
        })
        loadSound(audioLoader,listener, AudioArray , 'bloup','Liquide.mp3', () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger son")
        })
        loadSound(audioLoader,listener, AudioArray , 'blink','Scintillement_ondes.mp3', () => {
          numberLoaded += 1
          visualLoader.changeValue(GlobalLoader.getInstance().getNumberLoaded())
          console.log("charger son")
        })



        canvas = document.querySelector<HTMLDivElement>('canvas#webgl')!
        sizes = {
          width: canvas.clientWidth,
          height: canvas.clientHeight,
        }

        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            //powerPreference: "high-performance",
            antialias: true,
            //stencil: false,
            preserveDrawingBuffer: true
        })

        renderer.setSize(sizes.width, sizes.height)

        camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
        camera.add(listener)

        controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = false
        controls.enabled = true


        clock = new THREE.Clock()
        //instance.loadScene(renderer, controls, camera, clock)
      }

      return instance;
    }
  }
})();

//TODO add a statick callback
function loadFBX(loader: FBXLoader, array: { string: THREE.Group }, name: string, modelFilePath: string, callback: Function) {
  loader.load(
    `/models/${modelFilePath}`,
    (object: THREE.Group) => {
      array[name] = object
      callback()
      //console.log("chargé")
    },
    () => {
      //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
      console.log(error)
    }
  )
}

function loadGltf(loader: GLTFLoader, array: { string: THREE.Group }, name: string, modelFilePath: string, callback: Function) {
  loader.load(
    `/models/${modelFilePath}`,
    (gltf) => {

      array[name] = gltf.scene
      callback()

    },
    () => {
      //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
      console.log(error)
    }
  )
}



/* function loadHdri(loader: GLTFLoader, array: { string: THREE.Group }, name: string, modelFilePath: string, callback: Function) {

  loader.load(
    `/models/${modelFilePath}`,
    (gltf) => {

      array[name] = gltf.scene
      callback()

    },
    () => {
      //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
      console.log(error)
    }
  )
} */



function loadSound(loader: THREE.AudioLoader, listener : THREE.AudioListener, array , name: string, audioFilePath: string, callback: Function,loop:boolean = false,volume:number = 0.5) {
  loader.load( `/sounds/${audioFilePath}`, function( buffer ) {
      let sound = new THREE.Audio( listener );
      sound.setBuffer( buffer );
      sound.setLoop(loop);
      sound.setVolume(volume);
      array[name] = sound
      callback()
},
            // onProgress callback
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },

            // onError callback
            function ( err ) {
                console.log( 'Un error ha ocurrido' + err );
            }

);
}
