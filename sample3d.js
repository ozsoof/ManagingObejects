
import * as THREE from './three.js/build/three.module.js';
import { GLTFLoader } from './three.js/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from './three.js/examples/jsm/exporters/GLTFExporter.js';
import {
    groundTexture, 
    windowTexture,
    doorTexture,
    roofTexture,
    sidesTexture,
    ciTexture,
    frontTexture,
    pillarTexture,
    blindTextrue,
    floor1Texture,
    floor1sideTexture, 
    checkerboardTexture,
    lensTexture } from './textures.js';
import { OBJLoader } from './three.js/examples/jsm/loaders/OBJLoader.js';

export const getSample = () => {
    const floors = [];
    const ground = new THREE.Object3D();
    const sample = new THREE.Object3D();
    windowTexture.wrapS = THREE.RepeatWrapping;
    windowTexture.repeat.set(17,1);

    const groundGeometry = new THREE.PlaneBufferGeometry(1000,1000);
    const groundMaterial = new THREE.MeshBasicMaterial({
        map: groundTexture, 
    });

    const helper = new THREE.GridHelper( 1000, 100 );
    helper.position.y = 1;
    helper.material.opacity = 0.2;
    helper.material.transparent = true;
    helper.rotation.y = 3;
    // sample.add(helper);
    sample.add(helper);

    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = Math.PI * -.5;
    groundMesh.rotation.z = Math.PI * -0.035;
    
    groundMesh.receiveShadow = false;
    ground.add(groundMesh);
    sample.add(ground);
    const sideGeometry = new THREE.BoxBufferGeometry(300, 20, 5); 
    const sideMaterial = new THREE.MeshPhongMaterial({
        // color: 0x000080,
        opacity: 0.4, 
        transparent: true,
        map: windowTexture, 
    });
    const side2Geometry = new THREE.BoxBufferGeometry(5, 20, 255); 
    const side2Material = new THREE.MeshPhongMaterial({
        // color: 0x000080,
        opacity: 0.4, 
        transparent: true,
        map: sidesTexture, 
    });
    const layerGeometry = new THREE.BoxBufferGeometry(300,5,250);
    const layerMaterial = new THREE.MeshPhongMaterial({
        color: 0x708090,
        opacity: 0.5, 
        transparent: true,
        map: windowTexture, 
    });
    
    let i;
    
    //1 floor
    const floor1 = new THREE.Object3D();
    const floor1Geometry = new THREE.BoxBufferGeometry(200, 20, 1); 
    const floor1Material = new THREE.MeshPhongMaterial({
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
    const floor1sideMaterial = new THREE.MeshPhongMaterial({
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
    
    
    const floor1centerMaterial = new THREE.MeshPhongMaterial({
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
    
    // pillar
    const pillarGeometry = new THREE.BoxBufferGeometry(10, 20, 10); 
    const pillarMaterial = new THREE.MeshPhongMaterial({
        opacity: 0.7, 
        transparent: true,
        map: pillarTexture, 
    });
    const pillar1Mesh = new THREE.Mesh(pillarGeometry,pillarMaterial);
    pillar1Mesh.position.y = 10;
    pillar1Mesh.position.x = 149;
    pillar1Mesh.position.z = -130;
    pillar1Mesh.rotation.y = 3.0;
    const pillar2Mesh = new THREE.Mesh(pillarGeometry,pillarMaterial);
    pillar2Mesh.position.y = 10;
    pillar2Mesh.position.x = 136;
    pillar2Mesh.position.z = -30;
    pillar2Mesh.rotation.y = 3.0;
    const pillar3Mesh = new THREE.Mesh(pillarGeometry,pillarMaterial);
    pillar3Mesh.position.y = 10;
    pillar3Mesh.position.x = 160;
    pillar3Mesh.position.z = -200;
    pillar3Mesh.rotation.y = 3.0;
    const pillar4Mesh = new THREE.Mesh(pillarGeometry,pillarMaterial);
    pillar4Mesh.position.y = 10;
    pillar4Mesh.position.x = 126;
    pillar4Mesh.position.z = 38;
    pillar4Mesh.rotation.y = 3.0;
    const pillar5Mesh = new THREE.Mesh(pillarGeometry,pillarMaterial);
    pillar5Mesh.position.y = 10;
    pillar5Mesh.position.x = 78;
    pillar5Mesh.position.z = 32;
    pillar5Mesh.rotation.y = 3.0;
    const pillar6Mesh = new THREE.Mesh(pillarGeometry,pillarMaterial);
    pillar6Mesh.position.y = 10;
    pillar6Mesh.position.x = 30;
    pillar6Mesh.position.z = 25;
    pillar6Mesh.rotation.y = 3.0;
    const pillar7Mesh = new THREE.Mesh(pillarGeometry,pillarMaterial);
    pillar7Mesh.position.y = 10;
    pillar7Mesh.position.x = -40;
    pillar7Mesh.position.z = 15;
    pillar7Mesh.rotation.y = 3.0;
    const pillar8Mesh = new THREE.Mesh(pillarGeometry,pillarMaterial);
    pillar8Mesh.position.y = 10;
    pillar8Mesh.position.x = -105;
    pillar8Mesh.position.z = 5;
    pillar8Mesh.rotation.y = 3.0;
    const pillar9Mesh = new THREE.Mesh(pillarGeometry,pillarMaterial);
    pillar9Mesh.position.y = 10;
    pillar9Mesh.position.x = -147;
    pillar9Mesh.position.z = -2;
    pillar9Mesh.rotation.y = 3.0;
    const pillar10Mesh = new THREE.Mesh(pillarGeometry,pillarMaterial);
    pillar10Mesh.position.y = 10;
    pillar10Mesh.position.x = -138;
    pillar10Mesh.position.z = -73;
    pillar10Mesh.rotation.y = 3.0;
    const pillar11Mesh = new THREE.Mesh(pillarGeometry,pillarMaterial);
    pillar11Mesh.position.y = 10;
    pillar11Mesh.position.x = -125;
    pillar11Mesh.position.z = -172;
    pillar11Mesh.rotation.y = 3.0;
    const pillar12Mesh = new THREE.Mesh(pillarGeometry,pillarMaterial);
    pillar12Mesh.position.y = 10;
    pillar12Mesh.position.x = -115;
    pillar12Mesh.position.z = -238;
    pillar12Mesh.rotation.y = 3.0;
    const pillar13Mesh = new THREE.Mesh(pillarGeometry,pillarMaterial);
    pillar13Mesh.position.y = 10;
    pillar13Mesh.position.x = -70;
    pillar13Mesh.position.z = -232;
    pillar13Mesh.rotation.y = 3.0;
    const pillar14Mesh = new THREE.Mesh(pillarGeometry,pillarMaterial);
    pillar14Mesh.position.y = 10;
    pillar14Mesh.position.x = -10;
    pillar14Mesh.position.z = -224;
    pillar14Mesh.rotation.y = 3.0;
    const pillar15Mesh = new THREE.Mesh(pillarGeometry,pillarMaterial);
    pillar15Mesh.position.y = 10;
    pillar15Mesh.position.x = 60;
    pillar15Mesh.position.z = -214;
    pillar15Mesh.rotation.y = 3.0;
    const pillar16Mesh = new THREE.Mesh(pillarGeometry,pillarMaterial);
    pillar16Mesh.position.y = 10;
    pillar16Mesh.position.x = 115;
    pillar16Mesh.position.z = -206;
    pillar16Mesh.rotation.y = 3.0;
    
    //entrance roof  
    const entranceGeometry = new THREE.BoxBufferGeometry(175, 4, 40); 
    const entranceMaterial = new THREE.MeshPhongMaterial({
        opacity: 0.8, 
        transparent: true,
        map: pillarTexture, 
    });
    const entranceMesh = new THREE.Mesh(entranceGeometry, entranceMaterial);
    entranceMesh.position.y = 18;
    entranceMesh.position.x = 24;
    entranceMesh.position.z = -230;
    entranceMesh.rotation.y = 3.0;
    const entrance2Mesh = new THREE.Mesh(entranceGeometry, entranceMaterial);
    entrance2Mesh.position.y = 18;
    entrance2Mesh.position.x = -14;
    entrance2Mesh.position.z = 30;
    entrance2Mesh.rotation.y = 3.0;
    
    // door
    const doorGeometry = new THREE.CylinderBufferGeometry(
        16,     // top radius
        16,     // bottom radius
        10,
        10,
        1,
        false,
        Math.PI * 2,
        Math.PI * 2,
    );
    const doorMaterial = new THREE.MeshPhongMaterial({
        // color: 0xDAA520,
        color: 0xFFD700,
        opacity: 0.8, 
        transparent: true,
        map: doorTexture, 
    });
    doorTexture.wrapS = THREE.RepeatWrapping;
    doorTexture.repeat.set(6,1);
    const door1Mesh = new THREE.Mesh(doorGeometry, doorMaterial);
    door1Mesh.position.y = 5;
    door1Mesh.position.x = -2;
    door1Mesh.position.z = -4;''
    const door2Mesh = new THREE.Mesh(doorGeometry, doorMaterial);
    door2Mesh.position.y = 5;
    door2Mesh.position.x = -63;
    door2Mesh.position.z = -12;  
    const door3Mesh = new THREE.Mesh(doorGeometry, doorMaterial);
    door3Mesh.position.y = 5;
    door3Mesh.position.x = 59;
    door3Mesh.position.z = 4;
    const door4Mesh = new THREE.Mesh(doorGeometry, doorMaterial);
    door4Mesh.position.y = 5;
    door4Mesh.position.x = 72;
    door4Mesh.position.z = -188;
    const door5Mesh = new THREE.Mesh(doorGeometry, doorMaterial);
    door5Mesh.position.y = 5;
    door5Mesh.position.x = 11;
    door5Mesh.position.z = -197;
    const door6Mesh = new THREE.Mesh(doorGeometry, doorMaterial);
    door6Mesh.position.y = 5;
    door6Mesh.position.x = -49;
    door6Mesh.position.z = -208;
    //frontCI
    const frontGeometry = new THREE.BoxBufferGeometry(30, 10, 2); 
    const frontMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        // opacity: 1, 
        // transparent: true,
        map: frontTexture, 
    });
    frontTexture.repeat.set(1,1);
    frontTexture.offset.set(0,0);
    const frontMesh = new THREE.Mesh(frontGeometry, frontMaterial);
    frontMesh.position.y = 5;
    frontMesh.position.x = -30;
    frontMesh.position.z = 100;
    frontMesh.rotation.y = 3.0;
    
    floor1.add(pillar1Mesh);
    floor1.add(pillar2Mesh);
    floor1.add(pillar3Mesh);
    floor1.add(pillar4Mesh);
    floor1.add(pillar5Mesh);
    floor1.add(pillar6Mesh);
    floor1.add(pillar7Mesh);
    floor1.add(pillar8Mesh);
    floor1.add(pillar9Mesh);
    floor1.add(pillar10Mesh);
    floor1.add(pillar11Mesh);
    floor1.add(pillar12Mesh);
    floor1.add(pillar13Mesh);
    floor1.add(pillar14Mesh);
    floor1.add(pillar15Mesh);
    floor1.add(pillar16Mesh);
    floor1.add(door1Mesh);
    floor1.add(door2Mesh);
    floor1.add(door3Mesh);
    floor1.add(door4Mesh);
    floor1.add(door5Mesh);
    floor1.add(door6Mesh);
    floor1.add(entranceMesh);
    floor1.add(entrance2Mesh);
    floor1.add(frontMesh);
    floor1.add(floor1frontMesh);
    floor1.add(floor1backMesh);
    floor1.add(floor1rightfrontMesh);
    floor1.add(floor1leftfrontMesh);
    floor1.add(floor1rightbackMesh);
    floor1.add(floor1leftbackMesh);
    floor1.add(floor1leftcenterMesh);
    floor1.add(floor1rightcenterMesh);
    floor1.add(floor1center1Mesh);
    floor1.add(floor1center2Mesh);
    floor1.add(floor1center3Mesh);
    floor1.add(floor1center4Mesh);
    
    floor1.name = "1 F"
    floors.push(floor1);

    for(i=0; i< 35; i++){
        const floor = new THREE.Object3D();
        floor.position.y = i*20;
        floor.position.x = -10;
        floor.position.z = 20;
        
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
        floor.name=(i+2)+" F";
        floors.push(floor);   // gui로 관리 목적
        sample.add(floor);
    }
    
    const layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);
    layerMesh.position.y = 20;
    layerMesh.position.x = 14;
    layerMesh.position.z = -120;
    layerMesh.rotation.y = 3.0;
    //roof
    const roofGeometry = new THREE.BoxBufferGeometry(200, 40, 150); 
    const roofMaterial = new THREE.MeshPhongMaterial({
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
    const ciMaterial = new THREE.MeshPhongMaterial({
        // color: 0x000080,
        // opacity: 0.7, 
        // transparent: true,
        map: ciTexture,
    });
    //roofvci
    const ciMesh = new THREE.Mesh(ciGeometry, ciMaterial);
    ciMesh.position.y = 40;    ciMesh.position.x = -80;
    ciMesh.position.z = -56;
    ciMesh.rotation.y = 3.0;
    //roof group
    const floor = new THREE.Object3D();
    floor.position.y = i*20;
    floor.position.x = -10;
    floor.position.z = 20;
    floor.add(roofMesh);
    floor.add(ciMesh);
    floor.add(layerMesh);
    floor.name="roof";
    floors.push(floor);
    sample.add(floor1);
    sample.add(floor);

    // console.log(sample);
    return { sample, floors };
}

export function exportGLTF( input ) {
        
    const gltfExporter = new GLTFExporter();
    const options = {
        trs: true,
        onlyVisible: true,
        truncateDrawRange: true,
        binary: true,
        maxTextureSize: 4000 
    };
    gltfExporter.parse( input, function ( result ) {
        
        if ( result instanceof ArrayBuffer ) {
            
            saveArrayBuffer( result, 'sceneL.glb' );
            
        } else {
            const output = JSON.stringify( result, null, 2 );
            console.log( output );
            saveString(output, 'sceneL.gltf');
        }
    }, options );
}

function save( blob, filename ) {
    const link = document.createElement( 'a' );
    link.style.display = 'none';
    document.body.appendChild( link ); 
    link.href = URL.createObjectURL( blob );
    link.download = filename;
    link.click();
    // URL.revokeObjectURL( url ); breaks Firefox...
}

function saveString( text, filename ) {
    save( new Blob( [ text ], { type: 'text/plain' } ), filename );
}

function saveArrayBuffer( buffer, filename ) {
    save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
}

export function getCCTV3d() {
    //let cctv3d= new THREE.Object3D();
    let cctv3d= new THREE.Group();
    {
        const objLoader = new OBJLoader();
        objLoader.load('resources/cctv/camera.obj', (obj) => {
            obj.children.map(node => {
                 cctv3d.add(node.clone());
            });
        });
    }
    return cctv3d;
}