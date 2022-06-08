import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three"
export class ActivityScene {
    constructor() {}
    // @ts-ignore
    init(renderer, controls: OrbitControls, camera: THREE.Camera, clock: THREE.Clock) {}
    // @ts-ignore
    anim(tick) {}
    //setup function will be used to put parameters in orbitcontrols and main camera
    setup(){}
    reloadSelectedLayer(){}
}
