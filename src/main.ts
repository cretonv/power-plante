import './style.css'
import '../assets/css/main.css'
import {GlobalLoader} from './GlobalLoader';


let globalLoader = null
const tickonce = () =>
{
    globalLoader = GlobalLoader.getInstance()
    window.requestAnimationFrame(tick)
    document.querySelector('.play-icon').classList.add('hidden')
    document.querySelector('.value-loaded').classList.remove('hidden')
    document.querySelector('.load-bar').classList.remove('hidden')
    console.log("tickonce")
}

const tick = () =>
{
    //console.log(GlobalLoader.getInstance().getNumberLoaded())

    if(globalLoader.getLoadState() ){
       // console.log("onélà")
        globalLoader.getCurrentScene().anim(tick)
    }


    window.requestAnimationFrame(tick)
    window.removeEventListener("click", tickonce);

}

window.addEventListener("click", tickonce);







 // const elapsedTime = clock.getElapsedTime()
    // Check canvas size and resolution
    // if (resizeRendererToDisplaySize()) {
    //     const aspect = canvas.clientWidth / canvas.clientHeight
    //     if (camera.isPerspectiveCamera || camera.isOrthographicCamera || camera.isCamera) {
    //         camera.aspect = aspect
    //         camera.updateProjectionMatrix()
    //     }
    // }

// // RenderE
// switch (globalLoader.getCurrentScene()) {
//     case 'scene1':
//         //color picker
//         currentscene.anim(tick)
//         break;
//     case 'scene2':
//         //TODO shake
//         currentscene2.anim(tick)
//         break;
//     case 'scene2':
//         //TODO shake
//         currentscene2.anim(tick)
//         break;
//     default:
//       console.log(`on est perdu`);
//   }
// Call tick again on the next frame
//window.requestAnimationFrame(tick)


// function resizeRendererToDisplaySize() {
//     const width = canvas.clientWidth;
//     const height = canvas.clientHeight;
//     const needResize = canvas.clientWidth !== sizes.width || canvas.clientHeight !== sizes.height;
//     if (needResize) {
//         renderer.setSize(width, height, false);
//     }

//     return needResize
// }


//console.log(AppLiveParameter.getInstance().setCurrentScene('scene2'));
//console.log(AppLiveParameter.getInstance().getCurrentScene());



// const canvas = document.querySelector<HTMLDivElement>('canvas#webgl')!

// //const scene = new THREE.Scene()
// const sizes = {
//     width: canvas.clientWidth,
//     height: canvas.clientHeight,
// }

// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas
// })
// renderer.setClearColor(0xFFFFFF, 1)
// renderer.setSize(sizes.width, sizes.height)

// const globalLoader = GlobalLoader.getInstance()
// const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100)

// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = false
// controls.enabled = false


// const clock = new THREE.Clock()
// const currentscene = new Experience2Part1()
// currentscene.init(renderer,controls,camera,clock)

// const currentscene2 = new Experience2Part2()
// currentscene2.init(renderer,controls,camera,clock)

//const appGlobalParameters = GlobalLoader.getInstance()



// const scene = new THREE.Scene()
// /**
//      * Renderer
//      */
//  const renderer = new THREE.WebGLRenderer({
//     canvas: canvas,
//     powerPreference: "high-performance",
//     antialias: false,
//     stencil: false
// })
// renderer.setClearColor(0xFFFF, 1)
// renderer.setSize(canvas.clientWidth, canvas.clientHeight)
// renderer.autoClear = false;
// renderer.outputEncoding = THREE.sRGBEncoding


// /**
//  * Composer
//  */
// const composer = new EffectComposer(renderer);
// /**
//  * Camera
//  */
// const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
// camera.position.z = 1.3563360735759848
// scene.add(camera)

// /**
//  * Controls
//  */
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true

// /**
//  * Lights
//  */
// const light = new THREE.AmbientLight(0xFFFFFF, 0.3)
// light.position.set(0.44, 0.18, 0.34)
// scene.add(light)




//    const outlineEffect = new OutlineEffect(scene, camera, {
//         blendFunction: BlendFunction.ADD,
//         edgeStrength: 1000,
//         pulseSpeed: 2.0,
//         visibleEdgeColor: 0xFF00FF,
//         hiddenEdgeColor: 0x222200,
//         blur: true,
//         //xRay: true
//     });
//     outlineEffect.resolution.width = canvas.clientWidth
//     outlineEffect.resolution.height = canvas.clientHeight

//     const geometry = new THREE.BoxGeometry( 0.01, 1, 1 );
//     const material = new THREE.MeshBasicMaterial( {color: 0xAA0000} );
//     const testCube = new THREE.Mesh( geometry, material );
//     scene.add( testCube );

//     outlineEffect.selection.add(testCube);

//     //const smaaPass = new EffectPass(this.camera, this.smaaEffect);
//     const outlinePass = new EffectPass(camera, outlineEffect);

//     //this.effect = outlineEffect;
//     //this.composer.addPass(new EffectPass(this.camera,this.outlineEffect));
//     //this.outlinePass.setEnabled(this.outlinePass.isEnabled())
//     composer.addPass(new RenderPass(scene, camera));
//     composer.addPass(outlinePass);

//     function tick(){
//         // const elapsedTime = clock.getElapsedTime()


//         // Update controls
//         controls.update()


//         // Render
//         composer.render();


//         // Call tick again on the next frame
//         window.requestAnimationFrame(tick)

//     }

// tick()
// console.log(composer)
