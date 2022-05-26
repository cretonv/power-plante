import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Experience2Part1 } from "./Scenes/Experience2Part1";
import { FirstScene } from "./Scenes/FirstScene";
import { ActivityScene } from "./Scenes/ActivityScene";

export const landingName = "landingName"
export const exp2Part1Name = "exp2Part1Name"
export const exp2Part2Name = "exp2Part2Name"
export const exp2Part3Name = "exp2Part3Name"

export var GlobalLoader = (function () {
  var constructeur = function () {
    this.getCurrentScene = function (thisSceneId = sceneId): ActivityScene {
      //console.log(thisSceneId)
      // console.log(thisSceneId)
      // console.log(thisSceneId)
      // console.log(thisSceneId)

      switch (thisSceneId) {
        case exp2Part1Name:
          //console.log("part1")
          return exp2Part1Scene
          break;
        case landingName:
          //console.log("landing")
          return landingScene
          break;
        case exp2Part2Name:
          //console.log("part2")
          return exp2Part2Scene
          break;
        case exp2Part3Name:
          return exp2Part3Scene
          break;
        default:
          console.log(`on est peredu` + thisSceneId + "  " + landingName + (landingName == thisSceneId));
      }
    }
    this.loadScene = function (renderer, controls: OrbitControls, camera: THREE.Camera, clock: THREE.Clock, thisSceneId = sceneId) {
      // console.log("chargement")
      // console.log(thisSceneId)
      // console.log("chargement")
      console.log(   this.getCurrentScene(thisSceneId))
      this.getCurrentScene(thisSceneId).init(renderer, controls, camera, clock)
    }

    this.destroyScene = function (sceneToDestroy) {
      // console.log("destroy")
      // console.log(sceneToDestroy)
      // console.log("destroy")

      this.getCurrentScene(sceneToDestroy).destroy()

    }

    this.setNextScene = function(newId:string) {
      nextSceneId = newId
      transitionRequested = true
      this.loadScene(renderer, controls, camera, clock,newId)
    }
    this.notifyTransitionDone = function() {
      oldSceneId = sceneId
      sceneId = nextSceneId
      nextSceneId="none";
      transitionRequested = false
      this.destroyScene(oldSceneId)

    }

    this.getCurrentBackground = function () {
      return backgroundtexture
    }
    this.setCurrentBackground = function () {
      backgroundtexture
    }
    this.getFBXLoaded = function (name: string, callback: Function) {
      return callback(FbxArray[name])
    }
    this.getGLTFLoaded = function (name: string, callback: Function) {
      return callback(GltfArray[name])
    }
    this.getSizes = function ()  {
      return sizes
    }
    this.getCanvas = function () :HTMLCanvasElement {
      return canvas
    }
    this.getLoadState = function () {
      if (numberLoaded == 7) {
        if (firstsceneloaded) {
          return true
        }
        console.log("onload")
        instance.loadScene(renderer, controls, camera, clock)
        instance.getCurrentScene().setup()
        firstsceneloaded = true
        return true
      }
      return false
    }
  }

  // variables for scene state management
  var sceneId = exp2Part1Name;
  var nextSceneId = "none";
  var oldSceneId = "none";
  var fbxLoader = new FBXLoader()
  var gltfLoader = new GLTFLoader()
  var firstsceneloaded = false

  var landingScene: FirstScene = null
  var exp2Part1Scene: Experience2Part1 = null
  //TODO Change Scene When this will be imported 
  var exp2Part2Scene: Experience2Part1 = null
  var exp2Part3Scene: Experience2Part1 = null
  var transitionRequested = false;
  var renderer
  var controls
  var camera
  var clock
  var canvas
  var sizes 


  var backgroundtexture = null;
  var FbxArray: { string: THREE.Group } = {}
  var GltfArray: { string: THREE.Group } = {}
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
        exp2Part2Scene = new Experience2Part1()
        exp2Part3Scene = new Experience2Part1()

        //Load all fbx and gltf in an array 
        loadFBX(fbxLoader, FbxArray, "case", "case/case_flo_v-14.fbx", () => {
          numberLoaded += 1
          console.log("charger")
        })
        loadFBX(fbxLoader, FbxArray, "dye", "dye/dyeRed_animation_sam_v-2.fbx", () => {
          numberLoaded += 1
          console.log("charger")
        })
        loadFBX(fbxLoader, FbxArray, "eyedropper", "eyedropper/eyedropper_animation_sam_v-2.fbx", () => {
          numberLoaded += 1
          console.log("charger")

        })
        loadFBX(fbxLoader, FbxArray, "testtube", "testtube/testtube_animation_v-2.fbx", () => {
          numberLoaded += 1
          console.log("charger")

        })
        loadFBX(fbxLoader, FbxArray, "alcoolbottle", "alcoolbottle/alcohol_animation_sam_v-2.fbx", () => {
          numberLoaded += 1
          console.log("charger")

        })
        loadGltf(gltfLoader, GltfArray, "cab", "cab/cab_flo_v-4.gltf", () => {
          numberLoaded += 1
          console.log("charger gltf ")
          //console.log(GltfArray)

        })

        loadGltf(gltfLoader, GltfArray, "decor", "decor/decor_flo_v-2.gltf", () => {
          numberLoaded += 1
          console.log("charger gltf ")
          //console.log(GltfArray)

        })

        canvas = document.querySelector<HTMLDivElement>('canvas#webgl')!
        sizes = {
          width: canvas.clientWidth,
          height: canvas.clientHeight,
        }

        renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          powerPreference: "high-performance",
            antialias: false,
            stencil: false
        })
        renderer.setClearColor(0xFFFFFF, 1)
        renderer.setSize(sizes.width, sizes.height)

        camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100)

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
    (xhr) => {
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
    (xhr) => {
      //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
      console.log(error)
    }
  )
}

function loadHdri(loader: GLTFLoader, array: { string: THREE.Group }, name: string, modelFilePath: string, callback: Function) {
  loader.load(
    `/models/${modelFilePath}`,
    (gltf) => {

      array[name] = gltf.scene
      callback()

    },
    (xhr) => {
      //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
      console.log(error)
    }
  )
}