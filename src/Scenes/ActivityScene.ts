import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three"
export class ActivityScene {
    constructor() {}
    init(renderer, controls: OrbitControls, camera: THREE.Camera, clock: THREE.Clock) {}
    anim(tick) {}
    //setup function will be used to put parameters in orbitcontrols and main camera 
    setup(){}
    reloadSelectedLayer(){}
}