import * as THREE from 'three';
import type { PerspectiveCamera } from 'three';

export function loadCamera(): PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    camera.position.y = 5;
    return camera
}