import * as THREE from "three"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

export class FBXTest {
  
   
    public object:THREE.Group
    public is_oppened 
    private modelPath:string;
    private camera: THREE.Camera
    private pointer  = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    private mixer: THREE.AnimationMixer
    private activeAction : THREE.clipAction
    private liquidSample: Array<THREE.Mesh> = []
    private liquidIndex: number = 0 
    constructor() {

       
    }

    init(callback: Function,camera:THREE.Camera,modelPath:string) {
        this.modelPath = modelPath
        this.camera = camera
        // instantiate a loader
        const textureLoader = new THREE.TextureLoader();
        const loader = new FBXLoader()
        loader.load(
            `assets/${this.modelPath}`,
            (object) => {
                this.object = object
                this.mixer = new THREE.AnimationMixer(object)
                
                // const animationAction = this.mixer.clipAction(
                //     (object as THREE.Object3D).animations[0]
                // )
                //this.activeAction = animationAction
                object.traverse( (child)=> {
                    if (child instanceof THREE.Mesh) {
                        if (child.name.includes("Liquide")){
                            this.liquidSample.push(child) 
                            child.visible = false
                            
                        }  
                    }
                })

                object.scale.set(0.1, 0.1, 0.1)

                object.position.set(0.4, 0, 0)
                callback()
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
      
        



        window.addEventListener('mousedown', () => {
            //console.log("down")
           
            this.raycaster.setFromCamera( this.pointer, this.camera );
            const intersects = this.raycaster.intersectObjects(this.object);

            
            //Trigger first anim( bottle oppenning here)
            
        })

       
    }


    liquidSetNextLayer(callback:Function,material:THREE.Mesh){
        
            const mesh = this.object.getObjectByName(  this.liquidSample[this.liquidSample.length - this.liquidIndex-1].name)
            //console.log(mesh)
            mesh.visible = true
                        //this.liquidSample.push(child) 
            mesh.material = material
            this.liquidIndex = this.liquidIndex + 1
            callback(mesh)
            //console.log(this)
        
       
       
    }
    anim() {
       
    }

    setAction() {
    
    }

    destroy() {

    }
}
