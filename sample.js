

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
    
    { 
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(10,80,-70); 
        scene.add(light);
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
    
    //texture
    const groundTexture = loader.load('resources/aroundbuilding.png');
    const windowTexture = loader.load('resources/Window.png');
    const roofTexture = loader.load('resources/roof.png');
    const sidesTexture = loader.load('resources/sides.png');
    const ciTexture = loader.load('resources/sampleci.png');
    const frontTexture = loader.load('resources/frontOfBuilding2.png');
    const bg = loader.load('resources/bluesky.jpeg');
    scene.background = bg;
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
        for(i=0; i< 36; i++){
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
        //roof
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
        
        
        //roofvci
        const ciMesh = new THREE.Mesh(ciGeometry, ciMaterial);
        ciMesh.position.y = 40;
        ciMesh.position.x = -80;
        ciMesh.position.z = -56;
        ciMesh.rotation.y = 3.0;
        //frontCI
        const frontGeometry = new THREE.BoxBufferGeometry(30, 10, 2); 
        const frontMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            // opacity: 1, 
            //transparent: true,
            map: frontTexture, 
        });
        frontTexture.repeat.set(1,1);
        frontTexture.offset.set(0,0);
        const frontMesh = new THREE.Mesh(frontGeometry, frontMaterial);
        frontMesh.position.y = 5;
        frontMesh.position.x = -30;
        frontMesh.position.z = 100;
        frontMesh.rotation.y = 3.0;
        const floor = new THREE.Object3D();
        floor.add(roofMesh)
        floor.add(ciMesh)
        floor.add(layerMesh);


        //1 floor
        const floor1Geometry = new THREE.BoxBufferGeometry(200, 20, 1); 
        const floor1Texture = loader.load('resources/Window.png');
        const floor1Material = new THREE.MeshBasicMaterial({
            //color: 0xffffff,
            opacity: 0.7, 
            transparent: true,
            map: floor1Texture, 
        });
        floor1Texture.wrapS = THREE.RepeatWrapping;
        floor1Texture.wrapT = THREE.RepeatWrapping;
        floor1Texture.repeat.set(13,2);
        const floor1frontMesh = new THREE.Mesh(floor1Geometry,floor1Material);
        floor1frontMesh.position.y = 10;
        floor1frontMesh.position.x = -10;
        floor1frontMesh.position.z = 0;
        floor1frontMesh.rotation.y = 3.0;
        const floor1backMesh = new THREE.Mesh(floor1Geometry,floor1Material);
        floor1backMesh.position.y = 10;
        floor1backMesh.position.x = 20;
        floor1backMesh.position.z = -200;
        floor1backMesh.rotation.y = 3.0;
        const floor1sideTexture = loader.load('resources/Window.png');
        const floor1sideMaterial = new THREE.MeshBasicMaterial({
            //color: 0xffffff,
            opacity: 0.7, 
            transparent: true,
            map: floor1sideTexture, 
        });
        floor1sideTexture.wrapS = THREE.RepeatWrapping;
        floor1sideTexture.wrapT = THREE.RepeatWrapping;
        floor1sideTexture.repeat.set(3,2);
        const floor1sideGeometry = new THREE.BoxBufferGeometry(1, 20, 32); 
        const floor1leftfrontMesh = new THREE.Mesh(floor1sideGeometry,floor1sideMaterial);
        floor1leftfrontMesh.position.y = 10;
        floor1leftfrontMesh.position.x = -107;
        floor1leftfrontMesh.position.z = -30;
        floor1leftfrontMesh.rotation.y = 3.0;
        const floor1rightfrontMesh = new THREE.Mesh(floor1sideGeometry,floor1sideMaterial);
        floor1rightfrontMesh.position.y = 10;
        floor1rightfrontMesh.position.x = 91;
        floor1rightfrontMesh.position.z = -2;
        floor1rightfrontMesh.rotation.y = 3.0;
        const floor1leftbackMesh = new THREE.Mesh(floor1sideGeometry,floor1sideMaterial);
        floor1leftbackMesh.position.y = 10;
        floor1leftbackMesh.position.x = -81;
        floor1leftbackMesh.position.z = -198;
        floor1leftbackMesh.rotation.y = 3.0;
        const floor1rightbackMesh = new THREE.Mesh(floor1sideGeometry,floor1sideMaterial);
        floor1rightbackMesh.position.y = 10;
        floor1rightbackMesh.position.x = 116;
        floor1rightbackMesh.position.z = -170;
        floor1rightbackMesh.rotation.y = 3.0;
        
        const checkerboardTexture = loader.load('resources/checkerboard.jpg');
        const floor1centerMaterial = new THREE.MeshBasicMaterial({
            color: 0xA0522D,
            opacity: 0.5, 
            transparent: true,
            map: checkerboardTexture, 
        });
        checkerboardTexture.wrapS = THREE.RepeatWrapping;
        checkerboardTexture.repeat.set(3,1);
        const floor1sidecenterGeometry = new THREE.BoxBufferGeometry(1, 20, 140); 
        const floor1leftcenterMesh = new THREE.Mesh(floor1sidecenterGeometry,floor1centerMaterial);
        floor1leftcenterMesh.position.y = 10;
        floor1leftcenterMesh.position.x = -127;
        floor1leftcenterMesh.position.z = -120;
        floor1leftcenterMesh.rotation.y = 3.0;
        const floor1rightcenterMesh = new THREE.Mesh(floor1sidecenterGeometry,floor1centerMaterial);
        floor1rightcenterMesh.position.y = 10;
        floor1rightcenterMesh.position.x = 136;
        floor1rightcenterMesh.position.z = -80;
        floor1rightcenterMesh.rotation.y = 3.0;
        // const floor1rightfrontMesh = new THREE.Mesh(floor1sideGeometry,floor1sideMaterial);
        const floor1centerGeometry = new THREE.BoxBufferGeometry(35, 20, 1); 
        const floor1center1Mesh = new THREE.Mesh(floor1centerGeometry,floor1centerMaterial);
        floor1center1Mesh.position.y = 10;
        floor1center1Mesh.position.x = -100;
        floor1center1Mesh.position.z = -187;
        floor1center1Mesh.rotation.y = 3.0;
        const floor1center2Mesh = new THREE.Mesh(floor1centerGeometry,floor1centerMaterial);
        floor1center2Mesh.position.y = 10;
        floor1center2Mesh.position.x = -120;
        floor1center2Mesh.position.z = -48;
        floor1center2Mesh.rotation.y = 3.0;
        const floor1center3Mesh = new THREE.Mesh(floor1centerGeometry,floor1centerMaterial);
        floor1center3Mesh.position.y = 10;
        floor1center3Mesh.position.x = 129;
        floor1center3Mesh.position.z = -153;
        floor1center3Mesh.rotation.y = 3.0;
        const floor1center4Mesh = new THREE.Mesh(floor1centerGeometry,floor1centerMaterial);
        floor1center4Mesh.position.y = 10;
        floor1center4Mesh.position.x = 110;
        floor1center4Mesh.position.z = -13;
        floor1center4Mesh.rotation.y = 3.0;
        // const floor1rightfrontMesh = new THREE.Mesh(floor1sideGeometry,floor1sideMaterial);
        // floor1rightfrontMesh.position.y = 10;
        // floor1rightfrontMesh.position.x = 91;
        // floor1rightfrontMesh.position.z = -2;
        // floor1rightfrontMesh.rotation.y = 3.0;
        // const floor1leftbackMesh = new THREE.Mesh(floor1sideGeometry,floor1sideMaterial);
        // floor1leftbackMesh.position.y = 10;
        // floor1leftbackMesh.position.x = -81;
        // floor1leftbackMesh.position.z = -198;
        // floor1leftbackMesh.rotation.y = 3.0;
        // const floor1rightbackMesh = new THREE.Mesh(floor1sideGeometry,floor1sideMaterial);
        // floor1rightbackMesh.position.y = 10;
        // floor1rightbackMesh.position.x = 116;
        // floor1rightbackMesh.position.z = -170;
        // floor1rightbackMesh.rotation.y = 3.0;
        
        
        
        
        
        
        scene.add(frontMesh);
        scene.add(floor1frontMesh);
        scene.add(floor1backMesh);
        scene.add(floor1rightfrontMesh);
        scene.add(floor1leftfrontMesh);
        scene.add(floor1rightbackMesh);
        scene.add(floor1leftbackMesh);
        scene.add(floor1leftcenterMesh);
        scene.add(floor1rightcenterMesh);
        scene.add(floor1center1Mesh);
        scene.add(floor1center2Mesh);
        scene.add(floor1center3Mesh);
        scene.add(floor1center4Mesh);
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