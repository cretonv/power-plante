import * as THREE from "three"
import './style.css'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {RenderPass,EffectComposer,OutlinePass} from "three-outlinepass"

function init() {
    var scene, camera, renderer, light, controls, compose, renderPass;
    var outlinePass;
    var clock = new THREE.Clock();
    var selectedObjects = [];
    let modelReady = false;
    let activeAction: THREE.AnimationAction
    let lastAction: THREE.AnimationAction
    let mixer: THREE.AnimationMixer
    let displayEdges = false;
    
    const sizes = {
       width: 800,
       height: 600
       };
    drawScene();

    function drawScene() {
        iniScene();
        iniLight();
        windowResize();
        const loader = new FBXLoader()
        loader.load(
          'assets/models/capoeira.fbx',
          (object) => {

            mixer = new THREE.AnimationMixer(object)
            const animationAction = mixer.clipAction(
             (object as THREE.Object3D).animations[0]
              )
              activeAction = animationAction
              console.log(activeAction)
              modelReady = true

              object.traverse(function (child) {
                  // console.log(child)
                    if ((child as THREE.Mesh).isMesh) {
                      // (child as THREE.Mesh).material = material
                      if ((child as THREE.Mesh).material) {
                        selectedObjects.push((child as THREE.Mesh))
                      }
                  } 
              })
              object.scale.set(0.1, 0.1, 0.1)

              object.position.set(0, 0, 0)
              scene.add(object)
            
              //compose.addPass(renderPass);
              //compose.addPass(outlinePass);
              compose.render(scene, camera) 
              //renderer.render(scene, camera)
          },
          (xhr) => {
              console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
          },
          (error) => {
              console.log(error)
          }
      )

        render();
    }

    function iniScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100);
        renderer = new THREE.WebGLRenderer({alpha: true});
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        camera.position.set(-10, 10, 40);
        camera.lookAt(scene.position);
        renderer.shadowMap.enabled = true;

        renderer.setSize(window.innerWidth, window.innerHeight);
        compose = new EffectComposer(renderer);
        renderPass = new RenderPass(scene, camera);
        document.querySelector<HTMLDivElement>('.btn-default')?.addEventListener('click', (e) => {
            activeAction.play()
            console.log(displayEdges) 
            displayEdges = !displayEdges

            //clean of all the passes of the renderer
            compose.passes = []
            //toggle the passes 
            compose.addPass(renderPass);
            if(displayEdges){
             
              
              compose.addPass(outlinePass);
              
              
            }
            
            outlinePass.renderToScreen = displayEdges
         })
       
        outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth,window.innerHeight),scene,camera);
        outlinePass.renderToScreen = false;
        outlinePass.selectedObjects = selectedObjects;

        
        compose.addPass(renderPass);
       
        
        //compose.

        var params = {
            edgeStrength: 0.5,
            edgeGlow: 20,
            edgeThickness: 1 ,
            pulsePeriod: 0.5,
            usePatternTexture: false
        };
        outlinePass.edgeStrength = params.edgeStrength;
        outlinePass.edgeGlow = params.edgeGlow;
        outlinePass.visibleEdgeColor.set(0xdddd77);
        outlinePass.hiddenEdgeColor.set(0xdddd77);

        //scene.add(new THREE.AxesHelper(4));
        let dom = document.createElement('div');
        dom.style.backgroundColor = 'cadetblue';
        document.body.appendChild(dom)
        dom.appendChild(renderer.domElement);
    }

    function iniLight() {
      const light = new THREE.PointLight()
      light.position.set(0.8, 1.4, 1.0)
      scene.add(light)
       
    }


    function cubeDr(a, x, y, z) {
        var cubeGeo = new THREE.BoxGeometry(a, a, a);
        var cubeMat = new THREE.MeshPhongMaterial({
            color: 0xfff000 * Math.random()
        });
        var cube = new THREE.Mesh(cubeGeo, cubeMat);
        cube.position.set(x, y, z);
        cube.castShadow = true;
        scene.add(cube);
        return cube;
    }
    
  
    function windowResize() {
        window.addEventListener('resize', onWindowResize, false);
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    function render() {
        var delta = clock.getDelta();
        requestAnimationFrame(render);
        //renderer.render(scene, camera);
        if (modelReady) mixer.update(delta);
        
        compose.render(delta);
        

        //controls.update(delta);
    }   
}
window.onload = init;