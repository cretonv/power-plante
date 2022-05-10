import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import * as THREE from 'three'

const defaultGlassParams = {
    color: 0xffffff,
    transmission: 0.99,
    opacity: 1.0,
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

export function transformMeshToGlass( meshToGlassify: THREE.Mesh,hdrPath: string){
    const hdrEquirect = new RGBELoader()
				.setPath( 'assets/textures/' )
				.load( hdrPath, function () {

					hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
                   
				} );
    const texture = new THREE.CanvasTexture( generateTextureForGlassTexture() );
				texture.magFilter = THREE.NearestFilter;
				texture.wrapT = THREE.RepeatWrapping;
				texture.wrapS = THREE.RepeatWrapping;
				texture.repeat.set( 1, 3.5 );
    const material = new THREE.MeshPhysicalMaterial( {
        color: defaultGlassParams.color,
        metalness: defaultGlassParams.metalness,
        roughness: defaultGlassParams.roughness,
        ior: defaultGlassParams.ior,
        alphaMap: texture,
        envMap: hdrEquirect,
        envMapIntensity: defaultGlassParams.envMapIntensity,
        transmission: defaultGlassParams.transmission, // use material.transmission for glass materials
        specularIntensity: defaultGlassParams.specularIntensity,
        specularColor: defaultGlassParams.specularColor,
        opacity: defaultGlassParams.opacity,
        side: THREE.DoubleSide,
        transparent: true
    } );
    meshToGlassify.material = material

}

function generateTextureForGlassTexture() {

    const canvas = document.createElement( 'canvas' );
    canvas.width = 2;
    canvas.height = 2;

    const context = canvas.getContext( '2d' );
    context.fillStyle = 'white';
    context.fillRect( 0, 0, 2, 2 );

    return canvas;

}
