

import * as THREE from './three.js/build/three.module.js';
import { GUI } from './node_modules/dat.gui/build/dat.gui.module.js';;
import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from './three.js/examples/jsm/controls/TransformControls.js';
import {OBJLoader} from './three.js/examples/jsm/loaders/OBJLoader.js';

function main() {

    const canvas =document.querySelector('#c'); 
    canvas.width = 1670;
    canvas.height = 835;
    const renderer = new THREE.WebGLRenderer({
        canvas:canvas,
        alpha: true,
        antialias: true,
    });
    const loader = new THREE.TextureLoader();
    // const gui = new GUI();
    //renderer.setClearColor(0x000000);
    //renderer.shadowMap.enabled = true;

    function makeCamera(fov = 75){
        const aspect =2;
        const zNear = 0.1;
        const zFar = 1000;
        
        return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
    }

    const camera = makeCamera();
    
   
    camera.position.set(10, 40, 70)
    //camera.lookAt(0,0,0);
    {
        const light = new THREE.DirectionalLight(0xffffff,1);
        light.position.set(2,2,4);

        camera.add(light);
    }

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0,2,0);
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2;
    controls.update();

    

    const scene = new THREE.Scene();
    const bg = loader.load('resources/bluesky.jpeg');
    scene.background = bg;

    
    // const gridHelper = new THREE.GridHelper( 1000, 20 );
    // scene.add( gridHelper );

    // {
    //     const objLoader = new OBJLoader2();
    //     objLoader.load('./cctv/camera.obj', (root) => {
    //         scene.add(root);
    //     });
    // }

    { 
        const light = new THREE.DirectionalLight(0xffffff, 1);
       
        light.position.set(0,20,0); 
        scene.add(light);
        light.castShadow = false;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;

        const d = 50;
        light.shadow.camera.left = -d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = -d;
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 50;
        light.shadow.bias = 0.001;
    }

    {
        const light = new THREE.DirectionalLight(0xffffff,1);
        light.position.set(10,40,70);
        scene.add(light);
    }

    const ground = new THREE.Object3D();
    const groundGeometry = new THREE.PlaneBufferGeometry(2000,2000);
    const groundTexture = loader.load('resources/aroundbuilding.png');
    //groundTexture.rotation = 0.99;
    const groundMaterial = new THREE.MeshBasicMaterial(
        {map: groundTexture, 
        });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = Math.PI * -.5;
    groundMesh.receiveShadow = false;
    ground.add(groundMesh);
    scene.add(ground);            

    const floor1 = new THREE.Object3D();
    floor1.position.y = 0;
    scene.add(floor1);

    const sideGeometry = new THREE.BoxBufferGeometry(0.5, 10, 50); 
    const sideGeometry2 = new THREE.BoxBufferGeometry(80, 10, 0.5);
    const sideMaterial = new THREE.MeshPhongMaterial({
        color: 0x000080,
        opacity: 0.8, 
        transparent: true,
     });
    const block1_Mesh = new THREE.Mesh(sideGeometry, sideMaterial);
    block1_Mesh.position.y = 5;
    block1_Mesh.position.x = 40;
    const block2_Mesh = new THREE.Mesh(sideGeometry, sideMaterial);
    block2_Mesh.position.y = 5;
    block2_Mesh.position.x = -40;
    const block3_Mesh = new THREE.Mesh(sideGeometry2, sideMaterial);
    block3_Mesh.position.y = 5;
    block3_Mesh.position.z = 25;
    const block4_Mesh = new THREE.Mesh(sideGeometry2, sideMaterial);
    block4_Mesh.position.y = 5;
    block4_Mesh.position.z = -25;

    floor1.add(block1_Mesh);
    floor1.add(block2_Mesh);
    floor1.add(block3_Mesh);
    floor1.add(block4_Mesh);


    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }

        return needResize;
    }
    function render(time) {
        time *= 0.001; 
        if(resizeRendererToDisplaySize(renderer)){ 
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();    
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
main();