import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export var GlobalLoader = (function () {
  var constructeur = function () {

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
    this.getLoadState = function () {
      return numberLoaded == 2
    }
  }
  var fbxLoader = new FBXLoader()
  var gltfLoader = new GLTFLoader()
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
        //Load all fbx and gltf in an array 
        loadFBX(fbxLoader, FbxArray, "case", "case/case_flo_v-14.fbx", () => {
          numberLoaded += 1
        })
        loadGltf(gltfLoader, GltfArray, "cab", "cab/cab_flo_v-4.gltf", () => {
          numberLoaded += 1
        })
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