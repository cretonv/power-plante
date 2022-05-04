import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import Stats from 'three/examples/jsm/libs/stats.module'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const params = {
    color: 0xffffff,
    transmission: 1.2,
    opacity: 2.0,
    metalness: 0,
    roughness: 0.1,
    ior: 0.5,
    thickness: 0.01,
    specularIntensity: 1,
    specularColor: 0xff00ff,
    envMapIntensity: 1,
    lightIntensity: 1,
    exposure: 1,
    transparent: true
};



const hdrEquirect = new RGBELoader()
				.setPath( 'assets/textures/' )
				.load( 'Castle.hdr', function () {

					hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;

					//init();
					//render();
                    scene.background = hdrEquirect;
				} );
const texture = new THREE.CanvasTexture( generateTexture() );
				texture.magFilter = THREE.NearestFilter;
				texture.wrapT = THREE.RepeatWrapping;
				texture.wrapS = THREE.RepeatWrapping;
				texture.repeat.set( 1, 3.5 );

const material = new THREE.MeshPhysicalMaterial( {
    color: params.color,
    metalness: params.metalness,
    roughness: params.roughness,
    ior: params.ior,
    alphaMap: texture,
    envMap: hdrEquirect,
    envMapIntensity: params.envMapIntensity,
    transmission: params.transmission, // use material.transmission for glass materials
    specularIntensity: params.specularIntensity,
    specularColor: params.specularColor,
    opacity: params.opacity,
    side: THREE.DoubleSide,
    transparent: true
} );


const light = new THREE.PointLight(0x00ff00)
light.position.set(0.0, 0.1, 0.0)
//scene.add(light)
const light2 = new THREE.SpotLight(0xff00ff)

light2.position.set(1, -1, -1)
scene.add(light2)
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 2
const cube_geometry = new THREE.BoxGeometry( 0.01, 0.01, 0.01 );
const cube_material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

const cube = new THREE.Mesh( cube_geometry, cube_material );
cube.position.set(0.0,0.1,0.0)
scene.add( cube );

const renderer = new THREE.WebGLRenderer({alpha: true})
renderer.setClearColor( 0xff00ff, 0);
renderer.physicallyCorrectLights = true
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.shadowMap.enabled = true
// renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

function generateTexture() {

    const canvas = document.createElement( 'canvas' );
    canvas.width = 2;
    canvas.height = 2;

    const context = canvas.getContext( '2d' );
    context.fillStyle = 'white';
    context.fillRect( 0, 0, 2, 2 );

    return canvas;

}


////
//GLOW
////
var customMaterial = new THREE.ShaderMaterial( 
    {
        uniforms: 
        { 
            "c":   { type: "f", value: 1.0 },
            "p":   { type: "f", value: 1.4 },
            glowColor: { type: "c", value: new THREE.Color(0xffff00) },
            viewVector: { type: "v3", value: camera.position }
        },
        vertexShader:   'uniform vec3 viewVector;  uniform float c; uniform float p;  varying float intensity;        void main()         {            vec3 vNormal = normalize( normalMatrix * normal );            vec3 vNormel = normalize( normalMatrix * viewVector );            intensity = pow( c - dot(vNormal, vNormel), p );                        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );        }',
        fragmentShader: 'uniform vec3 glowColor;        varying float intensity;        void main()         {            vec3 glow = glowColor * intensity;            gl_FragColor = vec4( glow, 1.0 );        }',
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    }   );
        
var sphereGeom = new THREE.SphereGeometry(1, 32, 16); 
const SPHERE_material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
SPHERE_material.opacity = 0.8;  
SPHERE_material.transparent = true;
SPHERE_material.depthWrite = false;

let moonGlow = new THREE.Mesh( sphereGeom.clone(),SPHERE_material );
moonGlow.position.set(0.0,0.1,0.0);
moonGlow.scale.multiplyScalar(0.02);
scene.add( moonGlow );


const loader = new GLTFLoader()
const geometry = new THREE.SphereGeometry( 20, 64, 32 );

loader.load(
    'assets/models/dome_flo_v-1.gltf',
    function (gltf) {
     
      console.log("yo")
      

      gltf.scene.children[0].material = material
    
      gltf.receiveShadow = true
      gltf.castShadow = true
      console.log(gltf)
        // gltf.scene.traverse(function (child) {
        //     if ((child as THREE.Mesh).isMesh) {
        //         const m = (child as THREE.Mesh)
        //         m.receiveShadow = true
        //         m.castShadow = true
        //     }
        //     if (((child as THREE.Light)).isLight) {
        //         const l = (child as THREE.Light)
        //         l.castShadow = true
        //         l.shadow.bias = -.003
        //         l.shadow.mapSize.width = 2048
        //         l.shadow.mapSize.height = 2048
        //     }
        // })
        gltf.scene.renderOrder = 1
        gltf.scene.scale.set(0.01, 0.01, 0.01); 
        scene.add(gltf.scene)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()