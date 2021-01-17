import * as THREE from './three.js/build/three.module.js';
import { GUI } from './node_modules/dat.gui/build/dat.gui.module.js';;
import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from './three.js/examples/jsm/controls/TransformControls.js';

let container;
let camera, scene, renderer;
let isShiftDown = false;
const HelperObjects = [];


const canvas = document.querySelector('#c');  //0111
// const positions = [];
const point = new THREE.Vector3();
const raycaster = new THREE.Raycaster();  
const pointer = new THREE.Vector2();  
const onUpPosition = new THREE.Vector2();
const onDownPosition = new THREE.Vector2();                                                

const geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
const material = new THREE.MeshLambertMaterial( { color: 0xDC143C } );
let transformControl;
let rollOverMesh, rollOverMaterial;
let controls;
let cctvID=1;

const params = {  // 0111 여기서 메뉴 모드 추가
    createObject: addObject,
    isViewMode : false,
    isRemoveMode: false,
    isReplacementMode: false, 
};

init();
animate();

function init() {

    container = document.getElementById( 'container' );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 250, 1000 );
    scene.add( camera );

    scene.add( new THREE.AmbientLight( 0xf0f0f0 ) );
    const light = new THREE.SpotLight( 0xffffff, 1.5 );
    light.position.set( 0, 1500, 200 );
    light.angle = Math.PI * 0.2;
    light.castShadow = true;
    light.shadow.camera.near = 200;
    light.shadow.camera.far = 2000;
    light.shadow.bias = - 0.000222;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add( light );
    
    const planeGeometry = new THREE.PlaneBufferGeometry( 2000, 2000 );
    planeGeometry.rotateX( - Math.PI / 2 );
    const planeMaterial = new THREE.ShadowMaterial( { opacity: 0.2 } );

    const plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.position.y =  -200;
    plane.receiveShadow = true;
    scene.add( plane );

    const helper = new THREE.GridHelper( 2000, 100 );
    helper.position.y = - 199;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    scene.add( helper );

    renderer = new THREE.WebGLRenderer( { canvas:canvas, antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    //renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );

    const gui = new GUI();
    gui.add( params, 'createObject' );
    gui.add( params, 'isViewMode').listen().onChange(() => {
        // isViewMode = isViewMode ? false : true;
        params.isRemoveMode = params.isViewMode ? false: params.isRemoveMode;
        params.isReplacementMode = params.isViewMode ? false: params.isReplacementMode;
        console.log("replacementMode :", params.isReplacementMode, "remove : ", params.isRemoveMode, "getinfo : ", params.isViewMode);
        
    })
    gui.add( params, 'isRemoveMode' ).listen().onChange(() => {
        //params.isRemoveMode = params.isRemoveMode ? false : true;
        params.isViewMode = params.isRemoveMode ? false : params.isViewMode;
        params.isReplacementMode = params.isRemoveMode ? false : params.isReplacementMode;
        console.log("replacementMode :", params.isReplacementMode, "remove : ", params.isRemoveMode, "getinfo : ", params.isViewMode);
    
    });
    gui.add( params, 'isReplacementMode').listen().onChange(() => {
        //      params.isReplacementMode = params.isReplacementMode ? false : true;
        params.isViewMode = params.isReplacementMode ? false : params.isViewMode;
        params.isRemoveMode = params.isReplacementMode ? false : params.isRemoveMode;
        console.log("replacementMode :", params.isReplacementMode, "remove : ", params.isRemoveMode, "getinfo : ", params.isViewMode);
    
    });

    gui.open();

    // Controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.damping = 0.2;
    controls.addEventListener( 'change', render );

    transformControl = new TransformControls( camera, renderer.domElement );
    transformControl.addEventListener( 'change', render );
    transformControl.addEventListener( 'dragging-changed', function ( event ) {

        controls.enabled = ! event.value;

    } );
    scene.add( transformControl );

    transformControl.addEventListener( 'objectChange', function () {

        // updateSplineOutline();

    } );

    document.addEventListener( 'pointerdown', onPointerDown, false );
    // document.addEventListener( 'pointerdown', onPointerDown, false );
    document.addEventListener( 'pointerup', onPointerUp, false );
    document.addEventListener( 'pointermove', onPointerMove, false );
    document.addEventListener( 'keydown', onDocumentKeyDown, false );
    document.addEventListener( 'keyup', onDocumentKeyUp, false );

    window.addEventListener( 'resize', onWindowResize, false ); //0111
}

function onWindowResize() {   //0111
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function addObject( position ) {

    const material = new THREE.MeshLambertMaterial( { color: 0xDC143C } );
    const object = new THREE.Mesh( geometry, material );

    if ( position ) {

        object.position.copy( position );

    } else {

        // object.position.x = Math.random() * 1000 - 500;
        // object.position.y = Math.random() * 600;
        // object.position.z = Math.random() * 800 - 400;
        object.position.x = Math.random() * 1000 - 500;
        object.position.y = 300;
        object.position.z = 100;

    }

    object.castShadow = true;
    object.receiveShadow = true;
    object.deviceID = "cctv-"+cctvID++;

    scene.add( object );
    HelperObjects.push( object );
    return object;

}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}

function onPointerUp() {
    onUpPosition.x = event.clientX;
    onUpPosition.y = event.clientY;

    if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) transformControl.detach();

}

function onPointerMove( event ) {

    if(params.isReplacementMode){
        event.preventDefault();
        
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( pointer, camera );
        const intersects = raycaster.intersectObjects( HelperObjects );
    
        if ( intersects.length > 0 ) {

            // const object = intersects[ 0 ].object;
            const intersect = intersects[ 0 ];
            
            if ( intersect.object !== transformControl.object ) {
                transformControl.attach( intersect.object );
            }
            
        }
        
    } 
}

function onPointerDown( event ) {
    console.log("isRemoveMode : ", params.isRemoveMode, "isShiftDown :" , isShiftDown);
    
    event.preventDefault();

    pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( HelperObjects );

    if(params.isRemoveMode){

        if ( intersects.length > 0 ) {
            const intersect = intersects[ 0 ];
            // delete cube

            if (!isShiftDown ) {
                    scene.remove( intersect.object );

                    HelperObjects.splice( HelperObjects.indexOf( intersect.object ), 1 );

            } 
            else {
                console.log("isShiftDown")
                const voxel = new THREE.Mesh( geometry, material );
                voxel.position.copy( intersect.point ).add( intersect.face.normal );
                voxel.position.divideScalar( 20 ).floor().multiplyScalar( 20 ).addScalar( 10 );
                scene.add( voxel );

                HelperObjects.push( voxel );
            }
        }
    } else if (params.isViewMode){
        if ( intersects.length > 0 ) {
            const intersect = intersects[ 0 ];
            controls.enabled = false;
            alert(intersect.object.deviceID);
        }
    } else {
        
        onDownPosition.x = event.clientX;
        onDownPosition.y = event.clientY;
    }

    render();

}


function onDocumentKeyDown( event ) {

    switch ( event.keyCode ) {

        case 16: isShiftDown = true; break;

    }

}

function onDocumentKeyUp( event ) {

    switch ( event.keyCode ) {

        case 16: isShiftDown = false; break;

    }

}