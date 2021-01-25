

import * as THREE from './three.js/build/three.module.js';
import { GUI } from './node_modules/dat.gui/build/dat.gui.module.js';
import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from './three.js/examples/jsm/controls/TransformControls.js';
import { getSample, exportGLTF, getCCTV3d } from './sample3d.js';
import { getCctvData } from './datacontroller.js'


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
    const cctvData = getCctvData;

    let cameraControl = {
        fov: 75,
        aspect: 2,
        zNear: 0.1, 
        zFar: 8000,
        positionX: 0,
        positionY: 1000,
        positionZ: 900,        
        lookX: 0, 
        lookY: 0,
        lookZ: 0,
    }
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
    const cameraHelper = new THREE.CameraHelper(camera);
   
    class MinMaxGUIHelper {
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
            this.min = this.min;  // this will call the min setter
        }
    }


    function updateCamera() {
        camera.updateProjectionMatrix();
    }
    
    const setCamera = () => {
        console.log(camera);
        camera.fov = cameraControl.fov;
        camera.aspect = cameraControl.aspect;
        camera.zNear = cameraControl.zNear;
        camera.zFar = cameraControl.zFar; 
        camera.position.set(cameraControl.positionX, cameraControl.positionY, cameraControl.positionZ);
        camera.lookAt(cameraControl.lookX,cameraControl.lookY,cameraControl.lookZ);

        updateCamera();
    };

    setCamera();

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
    
    const sample = getSample();  // renader 부분에서 뒤늦게 건물을 띄워서 그런거 같다. 참고 . 
    sceneL.add(sample.sample);
  
    sceneL.background = new THREE.Color('black');
    sceneR.background = new THREE.Color('black');
    const addObject = (data) => {
        const deviceGeometry = new THREE.BoxBufferGeometry( 10, 10, 10 );
        const deviceMaterial = new THREE.MeshBasicMaterial( {color:0xDC143C });
        const object = new THREE.Mesh( deviceGeometry, deviceMaterial);
        object.rotation.y = 3.0;
        let child= sceneR.children[sceneR.children.length-1];
        object.position.x = ((Math.random() * 1400) % 100);
        object.position.y = child.position.y + 40;
        object.position.z = 0;
        
        object.device = data;
        object.device.placement = true;
        object.device.location =child.name;
        console.log(object.device);
        child.add(object);
        HelperObjects.push(object);
        return object;
    };
    
    const crossMenu = [];
    const gui = new GUI();
    // let floorList = gui.addFolder('floors');
    let cctvList = gui.addFolder('getCCTV');
    let controller = gui.addFolder('controller');
    let cameraController = gui.addFolder('camera');
    
    cameraController.add(cameraControl, 'fov', 0, 180).step(1).onChange(() => {
        camera.fov = cameraControl.fov;
        updateCamera();
        render();
    });
    // cameraController.add(camera, 'aspect', -10, 10).step(1).onChange(() => {
    //     updateCamera();
    //     render();
    // });

    cameraController.add(cameraControl, 'zNear', 0.1, 1000).step(0.1).onChange(() => {
        camera.zNear.set(cameraControl.zNear);
        updateCamera();
        render();
    });
    cameraController.add(cameraControl, 'zFar', 1000, 20000).step(1).onChange(() => {
        camera.zFar = cameraControl.zFar; 
        updateCamera();
        render();
    });
    cameraController.add(cameraControl, 'positionX', -1000, 1000).step(1).onChange(() => {
        camera.position.set(cameraControl.positionX, cameraControl.positionY, cameraControl.positionZ);
        updateCamera();
        render();
    });
    cameraController.add(cameraControl, 'positionY', -1000, 1000).step(1).onChange(() => {
        camera.position.set(cameraControl.positionX, cameraControl.positionY, cameraControl.positionZ);
        updateCamera();
        render();
    });
    cameraController.add(cameraControl, 'positionZ', -1000, 1000).step(1).onChange(() => {
        camera.position.set(cameraControl.positionX, cameraControl.positionY, cameraControl.positionZ);
        updateCamera();
        render();
    });
    cameraController.add(cameraControl, 'lookX', 0,2000).step(1).onChange(() => {
        camera.lookAt(cameraControl.lookX,cameraControl.lookY,cameraControl.lookZ);
        updateCamera();
        render();
    });
    cameraController.add(cameraControl, 'lookY', 0,2000).step(1).onChange(() => {
        camera.lookAt(cameraControl.lookX,cameraControl.lookY,cameraControl.lookZ);
        updateCamera();
        render();
    });
    cameraController.add(cameraControl, 'lookZ', 0,2000).step(1).onChange(() => {
        camera.lookAt(cameraControl.lookX,cameraControl.lookY,cameraControl.lookZ);
        updateCamera();
        render();
    });
    // cameraController.add(camera, , 0, 180).step(1).onChange(() => {
    //     updateCamera();
    //     render();
    // });
    // cameraController.add(cameraControl, 'fov', 0, 180).step(1).onChange(updateCamera);

    // cameraController.add(cameraControl, 'aspect', 0, 180, 1).onChange();
    // cameraController.add(cameraControl, 'zNear', 0.1, 1000, 0.1).onChange();
    // cameraController.add(cameraControl, 'zFar', 1000, 20000, 1).onChange();
    // cameraController.add(cameraControl, 'positionX', -100, 1000, 1).onChange();
    // cameraController.add(cameraControl, 'positionY', -100, 1000, 1).onChange();
    // cameraController.add(cameraControl, 'positionZ', -100, 1000, 1).onChange();
    // cameraController.add(cameraControl, 'lookX', 0, 2000, 1).onChange();
    // cameraController.add(cameraControl, 'lookY', 0, 2000, 1).onChange();
    // cameraController.add(cameraControl, 'lookZ', 0, 2000, 1).onChange();
    // cameraController.close();


    // camera.position.set(0, 1000, 900)
    // camera.lookAt(0,0,0);

    // fov=75) => {
    //     const aspect =2;
    //     const zNear = 0.1;
    //     const zFar = 8000;

    const controllerParams = {  // controller parameters
        createObject: addObject,
        isViewMode : false,
        isRemoveMode: false,
        isReplacementMode: false, 
        exportGLTF: ()=>{ exportGLTF(sceneL); },
    };
    
   
    let cctvs = {};
    cctvData.cctv.map((object, idx) => {
        const name = "cctv_" + object.camera_no;
        cctvs = { ...cctvs,
            [name]:()=>{addObject(object)},
        };
    });

    // let params = {};
    // sample.floors.map((floor, idx)=> {
    //     const name = "floor" + (idx+1);
    //     params = { ...params,
    //         [name]:false,
    //     };
    // });
    
    //controller.add(controllerParams, 'createObject');
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
    
    for(const key in cctvs){
        crossMenu.push(cctvList.add(cctvs, key));
    };

    crossMenu.forEach(( control ) => {

        control.classList1 = control.domElement.parentElement.parentElement.classList;
        control.classList2 = control.domElement.previousElementSibling.classList;

        control.setDisabled = function () {

            control.classList1.add( 'no-pointer-events' );
            control.classList2.add( 'control-disabled' );

        };

        control.setEnabled = function () {

            control.classList1.remove( 'no-pointer-events' );
            control.classList2.remove( 'control-disabled' );

        };

    } );

    function updateCrossMenu(data) {

        crossMenu.forEach( function ( control , idx) {
            if(!data.cctv[idx].placement){
                control.setEnabled();
            } else {
                control.setDisabled();
            }
        } );
    }
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
                        cctvList.show();
                        cctvList.open();
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
            
            const intersects = raycaster.intersectObjects( HelperObjects , true);
            if ( intersects.length > 0  ) {
                const intersect = intersects[ 0 ];
                if ( intersect.object !== transformControl.object ) {
                    transformControl.attach( intersect.object);
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
                intersect.object.device.placement = false;
                intersect.object.device.location = " ";
                child.remove( intersect.object );
                HelperObjects.splice( HelperObjects.indexOf( intersect.object ), 1 );
            }
        } else if (controllerParams.isViewMode){
            if ( intersects.length > 0 ) {
                const intersect = intersects[ 0 ];
                controls.enabled = false;
                alert(intersect.object.device);   // 여기가 팝업 또는 화면 분할해서 cctv 정보 제공 영역
            }
        } else {
            onDownPosition.x = event.clientX;
            onDownPosition.y = event.clientY;
        }
        requestRenderIfNotRequested();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
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
    
        updateCrossMenu(cctvData);
        if(detailinfo !== undefined ){
            
            sample.floors[detailinfo].scale.set(10,10,10);
            sceneR.add(sample.floors[detailinfo]);
        } else {
            for(const idx in sample.floors){
                sample.floors[idx].scale.set(1,1,1);
                sceneL.add(sample.floors[idx]);
                
            }
            controller.hide();
            cctvList.hide();
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


