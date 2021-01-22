

import * as THREE from './three.js/build/three.module.js';
import { GUI } from './node_modules/dat.gui/build/dat.gui.module.js';
import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from './three.js/examples/jsm/controls/TransformControls.js';
import { getSample, exportGLTF } from './sample.js';

function main() {
    
    const raycaster = new THREE.Raycaster();  
    const pointer = new THREE.Vector2();  
    const onUpPosition = new THREE.Vector2();
    const onDownPosition = new THREE.Vector2(); 
    const HelperObjects = [];

    let transformControl;
    let renderRequested = false;
    let sliderPos = window.innerWidth;
    let detailinfo;
    let cctvID=1;  // 임시 test 

    
    const canvas =document.querySelector('.container'); 
    const renderer = new THREE.WebGLRenderer({
        // canvas:canvas,
        alpha: true,
        antialias: true,
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas.appendChild( renderer.domElement);
    const makeCamera = (fov=75) => {
        const aspect =2;
        const zNear = 0.1;
        const zFar = 8000;
        return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
    }
    const camera = makeCamera();
    camera.position.set(0, 1000, 900)
    camera.lookAt(0,0,0);
    
    {
        const light = new THREE.DirectionalLight(0xffffff,1);
        light.position.set(2,2,4);
        camera.add(light);
    }
    
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0,50,-20);
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableDamping=true;
    controls.addEventListener('change', requestRenderIfNotRequested);
    
    const sceneL = new THREE.Scene();  
    const sceneR = new THREE.Scene();  
    { 
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(10,80,-70); 
        sceneL.add(light.clone());
        sceneR.add(light.clone());
    }
    {
        const light = new THREE.DirectionalLight(0xffffff,1);
        light.position.set(10,40,70);
        sceneL.add(light.clone());
        sceneR.add(light.clone());
    }
    {
        const light = new THREE.DirectionalLight(0xffffff,1);
        light.position.set(100,40,10);
        sceneL.add(light.clone());
        sceneR.add(light.clone());
    }
    {
        const light = new THREE.DirectionalLight(0xffffff,1);
        light.position.set(-100,40,10);
        sceneL.add(light.clone());
        sceneR.add(light.clone());
    }
    
    const sample = getSample();
    sceneL.add(sample.sample);
    
    const addObject = (position) => {
        const deviceGeometry = new THREE.BoxBufferGeometry( 10, 10, 10 );
        const deviceMaterial = new THREE.MeshBasicMaterial( {color:0xDC143C });
        const object = new THREE.Mesh( deviceGeometry, deviceMaterial);
        object.rotation.y = 3.0;
        let child= sceneR.children[sceneR.children.length-1];
        console.log(child);
        if (position) {
            object.position.copy(position);
        } else {
            object.position.x = ((Math.random() * 1400) % 100);
            object.position.y = child.position.y + 40;
            object.position.z = 0;
        }
        object.deviceID = "cctv-"+cctvID++;
        child.add(object); // 여기를 수정해야해 
        HelperObjects.push(object);
        return object;
    };
    
    const gui = new GUI();
    let floorList = gui.addFolder('floors');
    let controller = gui.addFolder('controller');
    
    const controllerParams = {  // controller parameters
        createObject: addObject,
        isViewMode : false,
        isRemoveMode: false,
        isReplacementMode: false, 
        exportGLTF: ()=>{ exportGLTF(sceneL); },
    };
    
    let params = {};
    sample.floors.map((floor, idx)=> {
        const name = "floor" + (idx+1);
        params = { ...params,
            [name]:false,
        };
    });
    
    controller.add(controllerParams, 'createObject');
    gui.add(controllerParams, 'isViewMode').listen().onChange(() => {
        controllerParams.isRemoveMode = controllerParams.isViewMode ? 
        false: controllerParams.isRemoveMode;
        controllerParams.isReplacementMode = controllerParams.isViewMode ? 
        false: controllerParams.isReplacementMode;
    })
    controller.add(controllerParams, 'isRemoveMode').listen().onChange(() => {
        controllerParams.isViewMode = controllerParams.isRemoveMode ? 
        false : controllerParams.isViewMode;
        controllerParams.isReplacementMode = controllerParams.isRemoveMode ? 
        false : controllerParams.isReplacementMode;
    });
    controller.add(controllerParams, 'isReplacementMode').listen().onChange(() => {
        controllerParams.isViewMode = controllerParams.isReplacementMode ? 
        false : controllerParams.isViewMode;
        controllerParams.isRemoveMode = controllerParams.isReplacementMode ? 
        false : controllerParams.isRemoveMode;
    });
    //gui.add(controllerParams, 'exportGLTF');
    
    for(const key in params){
        floorList.add(params, key).listen().onChange(()=>{
            for(const key2 in params){
                if(key !== key2){
                    params[key2] = params[key] ? false : params[key2];
                }
            } 
            detailinfo = getSelectedFloor();
            requestRenderIfNotRequested();
        });
    };

    // add EventListeners
    transformControl = new TransformControls( camera, canvas );
    transformControl.addEventListener( 'change', render );
    transformControl.addEventListener( 'dragging-changed', function ( event ) {
        controls.enabled = ! event.value;
    } );
    sceneR.add( transformControl);

    document.addEventListener( 'pointerdown', onPointerDown, false );
    document.addEventListener( 'pointerup', onPointerUp, false );
    document.addEventListener( 'pointermove', onPointerMove, false );
    window.addEventListener( 'resize', onWindowResize );

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    const getSelectedFloor = () => {
        for (const key in params){
            if(params[key]===true){
                sliderPos = 0;
                for (const idx in sample.floors){
                    if (sample.floors[idx].name === key){
                        camera.position.set(-440, 3600 + (idx * 20),-4275);
                        floorList.close();
                        controller.show();
                        controller.open();
                        controllerParams.isRemoveMode = false;
                        controllerParams.isViewMode = false;
                        controllerParams.isReplacementMode = false;
                        return idx;
                    }
                }
            }
        }
        sliderPos = window.innerWidth;
        camera.position.set(0, 1000, 900);
    };

    function onPointerUp( event ) {
        onUpPosition.x = event.clientX;
        onUpPosition.y = event.clientY;
        if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) transformControl.detach();
        // render();
        requestRenderIfNotRequested();
    }

    function onPointerMove( event ) {
        if(controllerParams.isReplacementMode){
            event.preventDefault();   
            pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            raycaster.setFromCamera( pointer, camera );
            
            const intersects = raycaster.intersectObjects( HelperObjects );
        
            if ( intersects.length > 0 ) {
                const intersect = intersects[ 0 ];
                if ( intersect.object !== transformControl.object ) {
                    transformControl.attach( intersect.object );
                }   
            }  
        }else {
            controls.enabled = true;
        }
    }

    function onPointerDown( event ) {
        event.preventDefault();
        pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
        raycaster.setFromCamera( pointer, camera );
        const intersects = raycaster.intersectObjects( HelperObjects );
        if(controllerParams.isRemoveMode){
            if ( intersects.length > 0 ) {
                let child= sceneR.children[sceneR.children.length-1];
                const intersect = intersects[ 0 ];     
                // sceneR.remove( intersect.object );
                child.remove( intersect.object );
                HelperObjects.splice( HelperObjects.indexOf( intersect.object ), 1 );
            }
        } else if (controllerParams.isViewMode){
            if ( intersects.length > 0 ) {
                const intersect = intersects[ 0 ];
                controls.enabled = false;
                alert(intersect.object.deviceID);
            }
        } else {
            onDownPosition.x = event.clientX;
            onDownPosition.y = event.clientY;
        }
        requestRenderIfNotRequested();
    }

    function requestRenderIfNotRequested() {
        if(!renderRequested) {
            renderRequested = true;
            requestAnimationFrame(render);
        }
    }

    function render() {
        renderRequested = false; 
        renderer.setScissorTest( false );
        renderer.clear();
        renderer.setScissorTest( true );
        
        for(const idx in sample.floors){
            sample.floors[idx].scale.set(1,1,1);
            sceneL.add(sample.floors[idx]);
            
        }
        if(detailinfo !== undefined ){
            
            sample.floors[detailinfo].scale.set(10,10,10);
            sceneR.add(sample.floors[detailinfo]);
        } else {
            controller.hide();
        }
        
        controls.update();        
        renderer.setScissor(0,0, sliderPos, window.innerHeight);
        renderer.render(sceneL, camera);
        renderer.setScissor(sliderPos, 0, window.innerWidth, window.innerHeight);
        renderer.render(sceneR, camera);
        
    }
    requestRenderIfNotRequested();
}
main();


