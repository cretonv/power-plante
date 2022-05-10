


import * as THREE from "three"
import './style.css'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { MaskPass, ClearMaskPass } from 'three/examples/jsm/postprocessing/MaskPass.js';
import {RenderPass,EffectComposer,OutlinePass} from "three-outlinepass"


let OutlineParams = {
    edgeStrength: 0.3,
    edgeGlow: 25,
    edgeThickness: 1 ,
    pulsePeriod: 0.5,
    usePatternTexture: false,
    color: 0xdddd77
};
let OutlineNuclearParams = {
    edgeStrength: 0.3,
    edgeGlow: 25,
    edgeThickness: 1 ,
    pulsePeriod: 0.5,
    usePatternTexture: false,
    color: 0xaaffaa
};

export class OutlineMeshRenderer {
    private compose : EffectComposer;
    private renderPass : RenderPass;
    private outlinePass : OutlinePass;
    private outlineNuclearPass : OutlinePass;
    private selectedObjects:Array<THREE.Mesh> = [];
    private selectedNuclearObjects:Array<THREE.Mesh> = [];
    private displayOutline = false;
    private maskPass :MaskPass;
    private maskingScene : THREE.Scene;


    constructor() {
        
       this.maskingScene = new THREE.Scene()
        
    }

    init(renderer: THREE.Renderer, camera:THREE.Camera, scene: THREE.Scene,canvasWidth:number,canvasHeight:number) {
        this.compose = new EffectComposer(renderer);
        this.renderPass = new RenderPass(scene, camera);
        this.outlinePass = new OutlinePass(new THREE.Vector2(canvasHeight,canvasWidth),scene,camera);
        this.outlinePass.renderToScreen = true;
        this.outlinePass.selectedObjects = this.selectedObjects;
        this.outlinePass.edgeStrength = OutlineParams.edgeStrength;
        this.outlinePass.edgeGlow = OutlineParams.edgeGlow;
        this.outlinePass.visibleEdgeColor.set(OutlineParams.color);
        this.outlinePass.hiddenEdgeColor.set(OutlineParams.color);
        this.outlineNuclearPass = new OutlinePass(new THREE.Vector2(canvasHeight,canvasWidth),scene,camera);
        this.outlineNuclearPass.renderToScreen = true;
        this.outlineNuclearPass.selectedObjects = this.selectedNuclearObjects;
        this.outlineNuclearPass.edgeStrength = OutlineNuclearParams.edgeStrength;
        this.outlineNuclearPass.edgeGlow = OutlineNuclearParams.edgeGlow;
        this.outlineNuclearPass.visibleEdgeColor.set(OutlineNuclearParams.color);
        this.outlineNuclearPass.hiddenEdgeColor.set(OutlineNuclearParams.color);
        this.maskPass =  new MaskPass( this.maskingScene, camera );;
        this.toggle(true)

    }

    setObjectList(pSelectedObjects:Array<THREE.Mesh> ){
        this.outlinePass.selectedObjects = pSelectedObjects
        //this.maskingScene.add(pSelectedObjects[0])
        this.toggle(this.displayOutline)
    }

    setNuclearObjectList(pSelectedNuclearObjects:Array<THREE.Mesh> ){
        this.outlineNuclearPass.selectedObjects= pSelectedNuclearObjects
        
        this.toggle(this.displayOutline)
    }

    render(value:number) {
       
        this.compose.render(value);

    }
    
    toggle(isRendered = !this.displayOutline ){
        this.displayOutline = isRendered

        //clean of all the passes of the renderer
        this.compose.passes = [] 
       
        this.compose.addPass(this.renderPass);
        this.compose.addPass(this.outlineNuclearPass);
        if(isRendered){
            this.compose.addPass(this.outlinePass);
            //this.compose.addPass(this.maskPass);
        }
       
        
    }
   


    destroy() {
        //TODO

    }
}