import './style.css'
import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { Experience2Part1 } from './Experience2Part1';
import { Experience2Part2 } from './Experience2Part2';
import { AppLiveParameter } from './AppLiveParameter'


const canvas = document.querySelector<HTMLDivElement>('canvas#webgl')!

//const scene = new THREE.Scene()
const sizes = {
    width: canvas.clientWidth,
    height: canvas.clientHeight,
}

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setClearColor(0xFFFFFF, 1)
renderer.setSize(sizes.width, sizes.height)

const LiveParameters = AppLiveParameter.getInstance()
const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
 
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = false
controls.enabled = false 


const clock = new THREE.Clock()
const currentscene = new Experience2Part1()
currentscene.init(renderer,controls,camera,clock)

const currentscene2 = new Experience2Part2()
currentscene2.init(renderer,controls,camera,clock)

const tick = () =>
{
    // const elapsedTime = clock.getElapsedTime()
    // Check canvas size and resolution
    if (resizeRendererToDisplaySize()) {
        const aspect = canvas.clientWidth / canvas.clientHeight
        if (camera.isPerspectiveCamera || camera.isOrthographicCamera || camera.isCamera) {
            camera.aspect = aspect
            camera.updateProjectionMatrix()
        }
    }
  
    // RenderE
    switch (LiveParameters.getCurrentScene()) {
        case 'scene1':
            currentscene.anim(tick)
            break;
        case 'scene2':
            currentscene2.anim(tick)
            break;
        default:
          console.log(`on est perdu`);
      }
    // Call tick again on the next frame
    //window.requestAnimationFrame(tick)
}



function resizeRendererToDisplaySize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.clientWidth !== sizes.width || canvas.clientHeight !== sizes.height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }

    return needResize
}

tick()
//console.log(AppLiveParameter.getInstance().setCurrentScene('scene2'));
//console.log(AppLiveParameter.getInstance().getCurrentScene());
