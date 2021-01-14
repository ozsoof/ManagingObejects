

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
        const zFar = 3000;
        
        return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
    }

    const camera = makeCamera();
    
   
    camera.position.set(0, 1000, 900)
    //camera.lookAt(0,0,0);
    {
        const light = new THREE.DirectionalLight(0xffffff,1);
        light.position.set(2,2,4);

        camera.add(light);
    }

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0,50,-20);
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
       
        light.position.set(10,80,-70); 
        scene.add(light);
        light.castShadow = false;
        // light.shadow.mapSize.width = 2048;
        // light.shadow.mapSize.height = 2048;

        // const d = 50;
        // light.shadow.camera.left = -d;
        // light.shadow.camera.right = d;
        // light.shadow.camera.top = d;
        // light.shadow.camera.bottom = -d;
        // light.shadow.camera.near = 1;
        // light.shadow.camera.far = 50;
        // light.shadow.bias = 0.001;
    }

    {
        const light = new THREE.DirectionalLight(0xffffff,1);
        light.position.set(10,40,70);
        scene.add(light);
    }
    {
        const light = new THREE.DirectionalLight(0xffffff,1);
        light.position.set(100,40,10);
        scene.add(light);
    }
    {
        const light = new THREE.DirectionalLight(0xffffff,1);
        light.position.set(-100,40,10);
        scene.add(light);
    }

    const ground = new THREE.Object3D();
    const groundGeometry = new THREE.PlaneBufferGeometry(1000,1000);
    const groundTexture = loader.load('resources/aroundbuilding.png');
    const windowTexture = loader.load('resources/Window.png');
    const roofTexture = loader.load('resources/roof.png');
    const sidesTexture = loader.load('resources/sides.png');
    const ciTexture = loader.load('resources/sampleci.png');
    const frontTexture = loader.load('resources/frontOfBuilding2.png');
    windowTexture.wrapS = THREE.RepeatWrapping;
    windowTexture.repeat.set(17,1);
    
    const blindTextrue = loader.load('resources/Blind.png');
    //groundTexture.rotation = 0.99;
    const groundMaterial = new THREE.MeshBasicMaterial(
        {map: groundTexture, 
        });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.rotation.x = Math.PI * -.5;
        groundMesh.receiveShadow = false;
        ground.add(groundMesh);
        scene.add(ground);            
        const sideGeometry = new THREE.BoxBufferGeometry(300, 20, 5); 
        const sideMaterial = new THREE.MeshBasicMaterial({
            // color: 0x000080,
            opacity: 0.45, 
            transparent: true,
            map: windowTexture, 
        });
        const side2Geometry = new THREE.BoxBufferGeometry(5, 20, 255); 
        const side2Material = new THREE.MeshBasicMaterial({
            // color: 0x000080,
            opacity: 0.45, 
            transparent: true,
            map: sidesTexture, 
        });
        const layerGeometry = new THREE.BoxBufferGeometry(300,5,250);
        const layerMaterial = new THREE.MeshBasicMaterial({
            //color: 0x000080,
            color: 0x708090,
            opacity: 0.7, 
            transparent: true,
            //map: sidesTexture, 
        });
        let i;
        for(i=0; i< 35; i++){
            const floor = new THREE.Object3D();
            floor.position.y = i*20;
            floor.position.x = -10;
            floor.position.z = 20;
            
            scene.add(floor);
            const block1_Mesh = new THREE.Mesh(sideGeometry, sideMaterial);
            block1_Mesh.position.y = 30;
            block1_Mesh.position.x = -5;
            block1_Mesh.position.z = 5;
            block1_Mesh.rotation.y = 3.00;
            const block2_Mesh = new THREE.Mesh(sideGeometry, sideMaterial);
            block2_Mesh.position.y = 30;
            block2_Mesh.position.x = 30;
            block2_Mesh.position.z = -245;
            block2_Mesh.rotation.y = 3.00;
            const block3_Mesh = new THREE.Mesh(side2Geometry, side2Material);
            block3_Mesh.position.y = 30;
            block3_Mesh.position.x = 160;
            block3_Mesh.position.z = -100;
            block3_Mesh.rotation.y = 3.00;
            const block4_Mesh = new THREE.Mesh(side2Geometry, side2Material);
            block4_Mesh.position.y = 30;
            block4_Mesh.position.x = -135;
            block4_Mesh.position.z = -142;
            block4_Mesh.rotation.y = 3.00;
            const layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);
            layerMesh.position.y = 22;
            layerMesh.position.x = 14;
            layerMesh.position.z = -120;
            layerMesh.rotation.y = 2.989;
            layerMesh.rotation.y = 3.0;
            
            // const block2_Mesh = new THREE.Mesh(sideGeometry, sideMaterial);
            // block2_Mesh.position.y = 5;
            // block2_Mesh.position.x = -40;
            // const block3_Mesh = new THREE.Mesh(sideGeometry2, sideMaterial);
            // block3_Mesh.position.y = 5;
            // block3_Mesh.position.z = 25;
            // const block4_Mesh = new THREE.Mesh(sideGeometry2, sideMaterial);
            // block4_Mesh.position.y = 5;
            
            // block4_Mesh.position.z = -25;
            
            floor.add(block1_Mesh);
            floor.add(block2_Mesh);
            floor.add(block3_Mesh);
            floor.add(block4_Mesh);
            floor.add(layerMesh);
        }
        const layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);
        layerMesh.position.y = 20;
        layerMesh.position.x = 14;
        layerMesh.position.z = -120;
        layerMesh.rotation.y = 3.0;
        const roofGeometry = new THREE.BoxBufferGeometry(200, 40, 150); 
        const roofMaterial = new THREE.MeshBasicMaterial({
            //color: 0xffffff,
            opacity: 0.7, 
            transparent: true,
            map: roofTexture, 
        });
        roofTexture.wrapS = THREE.RepeatWrapping;
        roofTexture.wrapT = THREE.RepeatWrapping;
        roofTexture.repeat.set(13,5);
        const roofMesh = new THREE.Mesh(roofGeometry,roofMaterial);
        roofMesh.position.y = 40;
        roofMesh.position.x = 10;
        roofMesh.position.z = -120;
        roofMesh.rotation.y = 3.0;
        const ciGeometry = new THREE.BoxBufferGeometry(20, 20, 1); 
        const ciMaterial = new THREE.MeshBasicMaterial({
            // color: 0x000080,
            // opacity: 0.7, 
            // transparent: true,
            map: ciTexture, 
        });
        const ciMesh = new THREE.Mesh(ciGeometry, ciMaterial);
        ciMesh.position.y = 40;
        ciMesh.position.x = -80;
        ciMesh.position.z = -56;
        ciMesh.rotation.y = 3.0;
        const frontGeometry = new THREE.BoxBufferGeometry(30, 10, 2); 
        const frontMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            // opacity: 1, 
            //transparent: true,
            map: frontTexture, 
        });
        //frontTexture.repeat.set(1,1);
        frontTexture.offset.set(0,0);
        const frontMesh = new THREE.Mesh(frontGeometry, frontMaterial);
        frontMesh.position.y = 5;
        frontMesh.position.x = -30;
        frontMesh.position.z = 100;
        frontMesh.rotation.y = 3.0;
        const floor = new THREE.Object3D();
        scene.add(frontMesh);
        floor.add(roofMesh)
        floor.add(ciMesh)
        floor.add(layerMesh);
        scene.add(floor);
        floor.position.y = i*20;
        floor.position.x = -10;
        floor.position.z = 20;
        

// pillar

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
        const speed = 0.2;
        const rot = time%300 * speed;
        scene.rotation.y = rot;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
main();