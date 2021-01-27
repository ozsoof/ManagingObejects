

import * as THREE from './three.js/build/three.module.js';
import { GUI } from './node_modules/dat.gui/build/dat.gui.module.js';
import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from './three.js/examples/jsm/controls/TransformControls.js';
import { getSample, exportGLTF, getCCTV3d } from './sample3d.js';
import { getCctvData } from './datacontroller.js'
import { MinMaxGUIHelper, makeCamera, updateCamera } from './cameraController.js'
// import { createText }  from './textController.js';


function main() {
    
    const raycaster = new THREE.Raycaster(); 
    const pointer = new THREE.Vector2();  
    const onUpPosition = new THREE.Vector2();
    const onDownPosition = new THREE.Vector2(); 
    const HelperObjects = [];
    const pickPosition = {x: 0, y: 0};
    

    let transformControl;
    let renderRequested = false;
    let sliderPos = window.innerWidth;
    let detailinfo;
    let pickedObject = null;
    let pickedObjectSavedColor =0;
    let textFont, textMesh, textGeo, planeTextMesh = null;
    let text , planeText ="";
    let hover = 0;
    let floorPositionHelper=[];

    let savedTextMesh=null;

   
    function loadFont() {
        
        const loader = new THREE.FontLoader();
        loader.load( './three.js/examples/fonts/Helvetiker_bold.typeface.json', function ( response ) {
            
            textFont = response;
            // console.log(textFont);
        } );
    }
    
    loadFont();
    
    // let textMesh, textGeo, textmMaterials;
    // let text = "three.js";
    const canvas =document.querySelector('.container'); 
    const renderer = new THREE.WebGLRenderer({
        // canvas:canvas,
        alpha: true,
        antialias: true,
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas.appendChild( renderer.domElement);
    const camera = makeCamera();
    camera.position.set(-150, 780, 1650);
    camera.lookAt(-150,680,680);
    
    
    {
        const light = new THREE.DirectionalLight(0xffffff,1);
        light.position.set(2,2,4);
        camera.add(light);
    }
    
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0,520,-50);
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableDamping=true;
    controls.addEventListener('change', () => {
        resetFadeout();

        // console.log("camera :",camera.position);
        requestRenderIfNotRequested();
    });
 
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
        const deviceMaterial = new THREE.MeshPhongMaterial( {color:0xDC143C });
        const object = new THREE.Mesh( deviceGeometry, deviceMaterial);
        object.rotation.y = 3.0;
        let child= sceneR.children[sceneR.children.length-1];
        console.log(sceneR);
        object.position.x = ((Math.random() * 1400) % 100);
        object.position.y = 35;
        object.position.z = 0; 
        
        object.device = data;
        object.device.placement = true;
        object.device.location =child.name;
        console.log(object.device);
        child.add(object);
        HelperObjects.push(object);
        return object;
    };
    
    const gui = new GUI();
    let floorList = gui.addFolder('floors');
    let cctvList = gui.addFolder('getCCTV');
    let controller = gui.addFolder('controller');
    const crossMenu = [];

    const controllerParams = {  // controller parameters
        createObject: addObject,
        isViewMode : false,
        isRemoveMode: false,
        isReplacementMode: false, 
        exportGLTF: ()=>{ exportGLTF(sceneL); },
    };
    
    const cctvData = getCctvData;
    let cctvs = {};
    cctvData.cctv.map((object, idx) => {
        const name = "cctv_" + object.camera_no;
        cctvs = { ...cctvs,
            [name]:()=>{addObject(object)},
        };
    });

    let params = {};
    sample.floors.map((floor, idx)=> {
        const name = floor.name;
        params = { ...params,
            [name]:false,
        };
    });
    
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
            //requestRenderIfNotRequested(); 
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
    window.addEventListener( 'mouseout',() => {
        clearPickPosition();
        requestRenderIfNotRequested();
    });

    const getSelectedFloor = () => {
        for (const key in params){
            if(params[key]===true){
                sliderPos = 0;
                camera.position.set(-2889,372, -3195);
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
        camera.position.set(-150, 780, 1650);
    };
    
    function onPointerUp( event ) {
        onUpPosition.x = event.clientX;
        onUpPosition.y = event.clientY;
        if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) transformControl.detach();
        // render();
        controls.update();        
        requestRenderIfNotRequested();
    }

    function setPlaneText( idx ) {
        const matLite = new THREE.MeshBasicMaterial( {
            color: 0x006699
        } );
        console.log(" idx set in PlaneText : ",sample.floors[idx].name.length);
        planeText =  sample.floors[idx].name.length > 3 ? sample.floors[idx].name: " "+sample.floors[idx].name;
    
        const shapes = textFont.generateShapes( planeText , 90 );

        const geometry = new THREE.ShapeBufferGeometry( shapes );

        geometry.computeBoundingBox();
        const xMid = 0;
        geometry.translate( xMid, 0, 0 );
        planeTextMesh = new THREE.Mesh( geometry, matLite );
        planeTextMesh.position.z = -90;
        planeTextMesh.position.y = 20;
        planeTextMesh.position.x = -110;
        planeTextMesh.rotation.x = Math.PI * -.5;
        planeTextMesh.rotation.z =  Math.PI * -0.035;
        // sceneR 카메라 시점 조정용 주석
        //controls.target.set(sample.floors[idx].position.x, sample.floors[idx].position.y, sample.floors[idx].position.z);
        // controls.update();
        console.log(" detail in set PlaneText :", sample.floors[idx]);
        sample.floors[idx].add(planeTextMesh);
    }


    function createText() {
        textGeo = new THREE.TextGeometry( text, {
            font: textFont,
            size: 60,
            height: 20,
            curveSegments: 4,
            bevelThickness: 2,
            bevelSize: 1.5,
            bevelEnabled: true
        } );
        textGeo.computeBoundingBox();
        const materials = [
            new THREE.MeshPhongMaterial( { color: 0x00008B, flatShading: true } ), // front
            new THREE.MeshPhongMaterial( { color: 0x00008B } ) // side
        ];
        textMesh = new THREE.Mesh( textGeo, materials );
        // console.log("camera.position.x :", camera.position.x ,
        // "camera.position.y :", camera.position.y, "camera.position.x :", camera.position.z  )
        textMesh.position.x = -50;
        textMesh.position.y = 800;
        textMesh.position.z = -20;
        textMesh.rotation.x = camera.rotation.x;
        textMesh.rotation.y = camera.rotation.y;
        textMesh.rotation.z = camera.rotation.z;
    }
        
    function onPointerMove( event ) {
        setPickPosition(event);
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
        }else {  // material이 같으면 색깔로 타게팅 대상을 식별하는 건 불가능 하다.
            if(sliderPos === window.innerWidth){
                event.preventDefault();   
                pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
                
                sceneL.remove(textMesh);
                
                raycaster.setFromCamera( pointer, camera );
                const intersectedObjects = raycaster.intersectObjects(sample.floors,true);
                
                if (intersectedObjects.length) {
                    pickedObject = intersectedObjects[0].object;
                    const pickedFloor = pickedObject.parent.name; 
                    text=pickedFloor;
                    hover = pickedObject.parent.position.y + 20;
                    createText();
                    sceneL.add(textMesh);
                }
                requestRenderIfNotRequested();
            } 
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
                console.log(intersect.object.device);   // 여기가 팝업 또는 화면 분할해서 cctv 정보 제공 영역
            }
        } else {
            onDownPosition.x = event.clientX;
            onDownPosition.y = event.clientY;
            
            if(sliderPos === window.innerWidth){
                event.preventDefault();   
                pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
                raycaster.setFromCamera( pointer, camera );
                const intersectedObjects = raycaster.intersectObjects(sample.floors,true);
                if (intersectedObjects.length) {
                    pickedObject = intersectedObjects[0].object;
                    const pickedFloor = pickedObject.parent.name;
                    // console.log("picked object is here", pickedFloor,pickedObject);
                    text=pickedFloor;
                    hover = pickedObject.parent.position.y + 20;
                    controls.target.set(20, hover, -50);
                    controls.update();
                    
                    // params[text]=true;
                    // detailinfo = getSelectedFloor();
                }
                //console.log("camera :", camera );
                //control.target.set()
            }   

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

    function setPickPosition(event) {
        const pos = getCanvasRelativePosition(event);
        pickPosition.x = (pos.x / window.innerWidth ) * 2 - 1;
        pickPosition.y = (pos.y /window.innerHeight) * -2 + 1;
    }
    
    function clearPickPosition() {
        pickPosition.x = -100000;
        pickPosition.y = -100000;
    }

    function getCanvasRelativePosition(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * window.innerWidth /rect.width,
            y: (event.clientY - rect.top) * window.innerHeight / rect.height,
        };
    }

    const resetFadeout = ()=>{
        let cameraP = [camera.position.x < 0 ? -1 * camera.position.x : camera.position.x,
            camera.position.y < 0 ? -1 * camera.position.y : camera.position.y,
            camera.position.z < 0 ? -1 * camera.position.z : camera.position.z];
        cameraP.forEach( (position) => {
            
            // console.log(params[detailinfo]);
            if(camera.far < position) {
                params[detailinfo]=false;
                // console.log(params[detailinfo]);
                getSelectedFloor();
                sliderPos = window.innerWidth;
                camera.position.set(-150, 780, 1650);
                requestRenderIfNotRequested()
            }  
        });
            
    }

    const setZoomIn = ()=>{
        
        let isSetSceneR = false;
        if ( camera.position.x <  150 && camera.position.x > 40 ) {
            if( camera.position.y < 750 && camera.position.y > 0) { 
                if( camera.position.z < 40 && camera.position.z > -200)
                { 
                    isSetSceneR = true;
                }
            }
        }
        
        // console.log(params[detailinfo]);
        if(isSetSceneR) {
            //params[detailinfo]=false;
            // console.log(params[detailinfo]);
            getSelectedFloor();
            sliderPos = 0;
            
            requestRenderIfNotRequested()
        }  

            
    }

    clearPickPosition();

    function render(time) {
        renderRequested = false;
        // console.log(pointer.x, pointer.y);
        //console.log("camera position", camera.position);
        renderer.setScissorTest( false );
        renderer.clear();
        renderer.setScissorTest( true );
        
        updateCrossMenu(cctvData);
        for(const idx in sample.floors){
            sample.floors[idx].scale.set(1,1,1);
            sceneL.add(sample.floors[idx]);  
        }
        if(detailinfo !== undefined ){
            
            sample.floors[detailinfo].scale.set(5,5,5);
            // floorPositionHelper[]
            console.log("before Scene " ,sample.floors[detailinfo]);
            // sample.floor[detailinfo]
            sceneR.add(sample.floors[detailinfo]); 
            setPlaneText(detailinfo);
            // camera.position.set(-4760,2182, 2200);
            
            
        } else {
            controller.hide();
            cctvList.hide();
            controls.target.set(20, hover, -50);
        }
        
        
        renderer.setScissor(0,0, sliderPos, window.innerHeight);
        renderer.render(sceneL, camera);
        renderer.setScissor(sliderPos, 0, window.innerWidth, window.innerHeight);
        renderer.render(sceneR, camera);
    }
    requestRenderIfNotRequested();
}
main();


