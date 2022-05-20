import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import * as THREE from 'three'
import { GlobalLoader } from './GlobalLoader';

export function loadSceneBackgroundFromHDR(hdrPath: string,scene: THREE.Scene){

	const currentBackground = GlobalLoader.getInstance().getCurrentBackground()
	if ( currentBackground!= null){
		scene.background = currentBackground
	}
	else{
		const hdrEquirect = new RGBELoader()
				.setPath( 'assets/textures/' )
				.load( hdrPath, function () {
					hdrEquirect.mapping = THREE.EquirectangularReflectionMapping
                    scene.background = hdrEquirect
					GlobalLoader.getInstance().setCurrentBackground(hdrEquirect)

				} );
	}
}