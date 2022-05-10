import './style.css'
import '../assets/css/main.css'
import {FirstScene} from "./FirstScene";

const canvas = document.querySelector<HTMLDivElement>('canvas#webgl')!
const firstScene = new FirstScene()
firstScene.init(canvas)