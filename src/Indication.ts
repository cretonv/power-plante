import * as THREE from "three"

export class Indication {

    public points: Array<{position: THREE.Vector3, element: HTMLElement}>
    private raycaster = THREE.Raycaster

    constructor() {
    }

    init(points) {
        this.points = points
        this.raycaster = new THREE.Raycaster()
    }

    anim(camera, sizes, scene) {
        // Go through each point
        for(const point of this.points)
        {
            const screenPosition = point.position.clone()
            screenPosition.project(camera)

            this.raycaster.setFromCamera(screenPosition, camera)
            /* const intersects = this.raycaster.intersectObjects(scene.children, true)

            if(intersects.length === 0)
            {
                point.element.classList.add('visible')
            }
            else
            {
                const intersectionDistance = intersects[0].distance
                const pointDistance = point.position.distanceTo(camera.position)

                if(intersectionDistance < pointDistance)
                {
                    point.element.classList.remove('visible')
                }
                else
                {
                    point.element.classList.add('visible')
                }
            }*/

            const translateX = screenPosition.x * sizes.width * 0.5
            const translateY = - screenPosition.y * sizes.height * 0.5
            point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
        }
    }

    destroy() {
        this.points = null
    }
}
