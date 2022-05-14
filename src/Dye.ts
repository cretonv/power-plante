import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import * as THREE from "three"
import * as TWEEN from "@tweenjs/tween.js";
import {Indication} from "./Indication";
import {ObjectViewModal} from "./ObjectViewModal";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
export const dyeColorEnum = Object.freeze({
    RedDye:"dyeRed_sam_v-1.gltf",
    YellowDye:"dyeRed_sam_v-1.gltf",
    BlueDye:"dyeRed_sam_v-1.gltf"
});
export class Dye {
  
   
    public object:THREE.Group
    public is_oppened 
    private modelFileName:string;
    private intersects = new THREE.Vector3();
    private camera: THREE.Camera
    private pointer  = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    
    constructor() {

       
    }

    init(callback: Function,camera:THREE.Camera,modelFileName:string) {
        console.log(modelFileName)
        this.modelFileName = modelFileName
        this.camera = camera
        // instantiate a loader
        const textureLoader = new THREE.TextureLoader();
        const loader = new GLTFLoader();
        loader.load(
            // resource URL
            `assets/models/dye/${modelFileName}`,
            // called when the resource is loaded
            (object: THREE.Group) => {
                
                
                this.object = object
                  // load a resource
                textureLoader.load(
                    // resource URL
                    'assets/textures/etiquettecolorantbleuv2.png',

                    // onLoad callback
                    function ( texture ) {
                        //texture.repeat.set(-1,-1)
                        //texture.offset.set(0.5,0.5)
                        //texture.mapping = 2000
                        //texture.rotation = Math.PI/2 * 3
                        //texture.offset.set(1,1) 
                        //texture.wrapS = 200.0;
                        //texture.repeat.x = - 1;
                        // in this example we create the material when the texture is loaded
                        
                        object.scene.traverse((o) => {
                            if (o.isMesh) {
                                if(o.name == 'ColorantBase-Mat'){
                                    
                                    o.material.map = texture;
                                    
                                    o.material.needsUpdate = true;
                                }
                                else{
                                    //o.visible = false
                                }

                            }
                        });

                        object.scene.children[0].scale.set(0.1, 0.1, -0.1)
                        //object.scene.children[0].position.set(0.01, 0.01, -0.01)
                        
                        
                        callback()
                    },


                    // onProgress callback currently not supported
                    undefined,

                    // onError callback
                    function ( err ) {
                        console.error( 'An error happened.' );
                    }
                );
                // this.ob  ject = objectt
               
            },
            // called while loading is progressing
            function ( xhr ) {
        
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        
            },
            // called when loading has errors
            function ( error ) {
        
                console.log( 'An error happened' + error );
        
            }
        );
      
        



        window.addEventListener('mousedown', () => {
            //console.log("down")
           
            this.raycaster.setFromCamera( this.pointer, this.camera );
            const intersects = this.raycaster.intersectObjects(this.object.scene.children);
            //Trigger first anim( bottle oppenning here)
            
        })

       
    }


    anim() {
       
    }

    setAction() {
    
    }

    destroy() {

    }
}
