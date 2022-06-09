import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import * as THREE from 'three'
import { GlobalLoader } from './GlobalLoader';

const defaultGlassParams = {
    color: 0xffffff,
    transmission: 0.750,
    opacity: 1.0,
    metalness: 0,
    roughness: 0.1,
    ior: 0.9,
    thickness: 0.9,
    specularIntensity: 0.9,
    specularColor: 0xff00ff,
    envMapIntensity: 0.9,
    lightIntensity: 0.9,
    exposure: 0.9,
    transparent: true
};

const pipetteGlassParams = {
    color: 0xffffff,
    transmission: 0.5,
    opacity: 1.0,
    metalness: 0,
    roughness: 0.8,
    ior: 0.9,
    thickness: 1,
    specularIntensity: 1,
    specularColor: 0xff00ff,
    envMapIntensity: 1,
    lightIntensity: 1,
    exposure: 1,
    transparent: true
};

const ledGlassParams = {
    color: 0x00aa00,
    transmission: 0.6,
    opacity: 1.0,
    metalness: 0,
    roughness: 0.8,
    ior: 1.0,
    thickness: 1,
    specularIntensity: 1,
    specularColor: 0xff00ff,
    envMapIntensity: 1,
    lightIntensity: 1,
    exposure: 1,
    transparent: true
};

const ledLightGlassParams = {
    color: 0x00dd00,
    transmission: 0.6,
    opacity: 1.0,
    metalness: 0,
    emissive: 0x00ff00,
    emissiveIntensity:1,
    roughness: 0.8,
    ior: 1.0,
    thickness: 1,
    specularIntensity: 1,
    specularColor: 0xff00ff,
    envMapIntensity: 1,
    lightIntensity: 1,
    exposure: 1,
    transparent: true
};

export function transformMeshToGlass( meshToGlassify: THREE.Mesh,hdrPath: string){
    //console.log(meshToGlassify)
    let hdrEquirect = GlobalLoader.getInstance().getCurrentBackground()
	if ( hdrEquirect == null){
         hdrEquirect = new RGBELoader()
        .setPath( '/images/textures/' )
        .load( hdrPath, function () {

            hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;

        } );
	}


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
        side: THREE.FrontSide,
        transparent: true
    } );
    meshToGlassify.material = material

}

export function transformMeshToPlastic( meshToGlassify: THREE.Mesh,hdrPath: string){
    //console.log(meshToGlassify)
    let hdrEquirect = GlobalLoader.getInstance().getCurrentBackground()
	if ( hdrEquirect == null){
         hdrEquirect = new RGBELoader()
        .setPath( '/images/textures/' )
        .load( hdrPath, function () {

            hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;

        } );
	}
    const texture = new THREE.CanvasTexture( generateTextureForGlassTexture() );
				texture.magFilter = THREE.NearestFilter;
				texture.wrapT = THREE.RepeatWrapping;
				texture.wrapS = THREE.RepeatWrapping;
				texture.repeat.set( 1, 3.5 );
    const material = new THREE.MeshPhysicalMaterial( {
        color: pipetteGlassParams.color,
        metalness: pipetteGlassParams.metalness,
        roughness: pipetteGlassParams.roughness,
        ior: pipetteGlassParams.ior,
        alphaMap: texture,
        envMap: hdrEquirect,
        envMapIntensity: pipetteGlassParams.envMapIntensity,
        transmission: pipetteGlassParams.transmission, // use material.transmission for glass materials
        specularIntensity: pipetteGlassParams.specularIntensity,
        specularColor: pipetteGlassParams.specularColor,
        opacity: pipetteGlassParams.opacity,
        side: THREE.FrontSide,
        transparent: true
    } );
    meshToGlassify.material = material

}


export function transformMeshToLed( meshToGlassify: THREE.Mesh,hdrPath: string){
    //console.log(meshToGlassify)
    let hdrEquirect = GlobalLoader.getInstance().getCurrentBackground()
	if ( hdrEquirect == null){
         hdrEquirect = new RGBELoader()
        .setPath( '/images/textures/' )
        .load( hdrPath, function () {

            hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;

        } );
	}
    const texture = new THREE.CanvasTexture( generateTextureForGlassTexture() );
				texture.magFilter = THREE.NearestFilter;
				texture.wrapT = THREE.RepeatWrapping;
				texture.wrapS = THREE.RepeatWrapping;
				texture.repeat.set( 1, 3.5 );
    const material = new THREE.MeshPhysicalMaterial( {
        color: ledGlassParams.color,
        metalness: ledGlassParams.metalness,
        roughness: ledGlassParams.roughness,
        ior: ledGlassParams.ior,
        alphaMap: texture,
        envMap: hdrEquirect,
        envMapIntensity: ledGlassParams.envMapIntensity,
        transmission: ledGlassParams.transmission, // use material.transmission for glass materials
        specularIntensity: ledGlassParams.specularIntensity,
        specularColor: ledGlassParams.specularColor,
        opacity: ledGlassParams.opacity,
        side: THREE.FrontSide,
        transparent: true
    } );
    meshToGlassify.material = material

}


export function transformMeshToLedLight( meshToGlassify: THREE.Mesh,hdrPath: string){
    //console.log(meshToGlassify)
    let hdrEquirect = GlobalLoader.getInstance().getCurrentBackground()
	if ( hdrEquirect == null){
         hdrEquirect = new RGBELoader()
        .setPath( '/images/textures/' )
        .load( hdrPath, function () {

            hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;

        } );
	}
    const texture = new THREE.CanvasTexture( generateTextureForGlassTexture() );
				texture.magFilter = THREE.NearestFilter;
				texture.wrapT = THREE.RepeatWrapping;
				texture.wrapS = THREE.RepeatWrapping;
				texture.repeat.set( 1, 3.5 );
    const material = new THREE.MeshPhysicalMaterial( {
        color: ledLightGlassParams.color,
        metalness: ledLightGlassParams.metalness,
        roughness: ledLightGlassParams.roughness,
        ior: ledLightGlassParams.ior,
        alphaMap: texture,
        envMap: hdrEquirect,
        envMapIntensity: ledLightGlassParams.envMapIntensity,
        transmission: ledLightGlassParams.transmission, // use material.transmission for glass materials
        specularIntensity: ledLightGlassParams.specularIntensity,
        specularColor: ledLightGlassParams.specularColor,
        emissive:ledLightGlassParams.emissive,
        emissiveIntensity:ledLightGlassParams.emissiveIntensity,
        opacity: ledLightGlassParams.opacity,
        side: THREE.FrontSide,
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
