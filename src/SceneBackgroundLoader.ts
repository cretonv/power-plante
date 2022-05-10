import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import * as THREE from 'three'

export function loadSceneBackgroundFromHDR(hdrPath: string,scene: THREE.Scene){
    const hdrEquirect = new RGBELoader()
				.setPath( 'assets/textures/' )
				.load( hdrPath, function () {

					hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
                    scene.background = hdrEquirect
				} );
}