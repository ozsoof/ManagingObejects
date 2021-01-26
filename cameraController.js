import * as THREE from './three.js/build/three.module.js';

export class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
        this.obj = obj;
        this.minProp = minProp;
        this.maxProp = maxProp;
        this.minDif = minDif;
    }
    get min() {
        return this.obj[this.minProp];
    }
    set min(v) {
        this.obj[this.minProp] = v;
        this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
        return this.obj[this.maxProp];
    }
    set max(v) {
        this.obj[this.maxProp] = v;
        this.min = this.min;  // min setter로 작동
    }
}

export const makeCamera = (fov) => {
    const aspect =2;
    const Near = 0.1;
    const Far = 8000;
    return new THREE.PerspectiveCamera(fov, aspect, Near, Far);
}

export const updateCamera = () => {
    camera.updateProjectionMatrix();
}
