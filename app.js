import * as THREE from 'https://unpkg.com/three@0.120.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.120.0/examples/jsm/controls/OrbitControls.js';
import * as dat from 'https://unpkg.com/three@0.120.0/examples/jsm/libs/dat.gui.module.js';

let container;      	// keeping the canvas here for easy access
let scene;
let camera;
let renderer;

let objectControls;     // instance to regulate controls.
let cameraControls;

let controls = [];      // array of instances from a class (new in javascript)
let cubes = []; 	    // meshes, subjects of the scene
let cub = new THREE.Object3D();

let numcubes = 3;       // increase the number of cubes.

// create some random colors
function getColor()
{   // reduce letter choices for a different palate
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for( let i=0; i<3; i++ )
    {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

class Controller
{
    constructor( cube, controller )
    {
        this.cube = cube;
        this.controller = controller; // hacky

        // available data for the instantiations of the function
        this.rotationSpeed = 0.05;
        this.scale = 1;
        this.x = 0.5;
        this.y = 0.5;
        this.z = 0.5;
        this.a = 0.1;
        this.b = 0.1;
        this.c = 0.1;
        this.d = 0.1;
        this.e = 0.1;
        this.f = 0.1;
        this.theta = 0.1;
        this.inv = false;
        this.parameters = { a: false, }
    }

    doTranslation() {
        // you have two options, either use the
        // helper function provided by three.js
        // new THREE.Matrix4().makeTranslation(3,3,3);
        // or set the matrix by hand.  // try using makeTranslation instead later.
        // 1. create a new Three.Matrix4()
        // 2. set the values to the appropriate values, and
        // 3. the appropriate controls set by dat.gui ~ perhaps: controls[some index].x, y, and z.
        // 4. then apply the matrix to the ** mesh **.
        // this.cube.applyMatrix4( translationMatrix );

        // what happens if we applyMatrix to the geometry here instead of mesh?
        // cube.geometry applyMatrix(translationMatrix);
        // cube.geometry.verticesNeedUpdate = true;
        if (controls[this.controller].parameters.a)
            this.doTranslationInv();
        else {
            let tmatrix = new THREE.Matrix4();
            let x = controls[this.controller].x, y = controls[this.controller].y, z = controls[this.controller].z;
            tmatrix.set(
                1, 0, 0, x,
                0, 1, 0, y,
                0, 0, 1, z,
                0, 0, 0, 1);
            this.cube.applyMatrix4(tmatrix);
        }
    }

    doTranslationInv()
    {
        let itmatrix = new THREE.Matrix4();
        let x = controls[this.controller].x, y = controls[this.controller].y, z = controls[this.controller].z;
        itmatrix.set(
            1, 0, 0, -x,
            0, 1, 0, -y,
            0, 0, 1, -z,
            0, 0, 0, 1);
        this.cube.applyMatrix4(itmatrix);
        // just do the inverse - you can call it from doTranslation() if you like if the
        // dat.gui is set.

        // apply the matrix to the ** mesh **.

    }

    doScale()
    {
        // similar steps as doTranslate except you scale.
        // left in the code accessing dat.gui controls.
    

        console.log( "Inverse is "  + this.parameters['a'] );
        console.log( "this controller = "  + this.controller );
        console.log( "sx = "  + controls[this.controller].x );
        console.log("sy = " + controls[this.controller].y);
        console.log( "sz = "  + controls[this.controller].z );

        if (controls[this.controller].parameters.a)
            this.doScaleInv();
        else {
            let scaleMatrix = new THREE.Matrix4();
            let x = controls[this.controller].x, y = controls[this.controller].y, z = controls[this.controller].z;
            scaleMatrix.set(
                x, 0, 0, 0,
                0, y, 0, 0,
                0, 0, z, 0,
                0, 0, 0, 1);

            this.cube.geometry.applyMatrix4(scaleMatrix);
            this.cube.geometry.verticesNeedUpdate = true;
        }
        //const cntrl = controls[this.controller];


        //  this.cube.applyMatrix4( scaleMatrix );  // for scale, scale the geometry not the mesh as seen on left.
        //  this.cube.geometry.applyMatrix4(scaleMatrix);
        //  this.cube.geometry.verticesNeedUpdate = true;

    }

    doScaleInv()  // doScale & doScaleInv should be combined into 1 function.
    {

        let iscaleMatrix = new THREE.Matrix4();
        let x = controls[this.controller].x, y = controls[this.controller].y, z = controls[this.controller].z;
        iscaleMatrix.set(
            1/x, 0, 0, 0,
            0, 1/y, 0, 0,
            0, 0, 1/z, 0,
            0, 0, 0, 1);

        this.cube.geometry.applyMatrix4(iscaleMatrix);
        this.cube.geometry.verticesNeedUpdate = true;
        // scale the geometry not the mesh


    }
    doRotationX() {
        // you need sin and con to rotate along theta.
        if (controls[this.controller].parameters.a)
            this.doInvRotationX();
        else {
            let rx = new THREE.Matrix4();
            let theta = controls[this.controller].theta
            rx.set(
                1, 0, 0, 0,
                0, Math.cos(theta), -Math.sin(theta), 0,
                0, Math.sin(theta), Math.cos(theta), 0,
                0, 0, 0, 1);

            this.cube.geometry.applyMatrix4(rx);
            this.cube.geometry.verticesNeedUpdate = true;
            // scale the geometry not the mesh
        }
    }


    doInvRotationX() {
        // you need sin and con to rotate along theta.
        let rx = new THREE.Matrix4();
        let theta = controls[this.controller].theta
        rx.set(
            1, 0, 0, 0,
            0, Math.cos(-theta), -Math.sin(-theta), 0,
            0, Math.sin(-theta), Math.cos(-theta), 0,
            0, 0, 0, 1);

        this.cube.geometry.applyMatrix4(rx);
        this.cube.geometry.verticesNeedUpdate = true;
        // scale the geometry not the mesh
    }


    doRotationY() {
        // you need sin and con to rotate along theta.
        if (controls[this.controller].parameters.a)
            this.doInvRotationY();
        else {
            let ry = new THREE.Matrix4();
            let theta = controls[this.controller].theta
            ry.set(
                Math.cos(theta), 0, Math.sin(theta), 0,
                0, 1, 0, 0,
                -Math.sin(theta), 0, Math.cos(theta), 0,
                0, 0, 0, 1);

            this.cube.geometry.applyMatrix4(ry);
            this.cube.geometry.verticesNeedUpdate = true;
        }
        // scale the geometry not the mesh
    }

    doInvRotationY() {

        // you need sin and con to rotate along theta.
        let ry = new THREE.Matrix4();
        let theta = controls[this.controller].theta
        ry.set(
            Math.cos(-theta), 0, Math.sin(-theta), 0,
            0, 1, 0, 0,
            -Math.sin(-theta), 0, Math.cos(-theta), 0,
            0, 0, 0, 1);

        this.cube.geometry.applyMatrix4(ry);
        this.cube.geometry.verticesNeedUpdate = true;
        // scale the geometry not the mesh
    }

    doRotationZ() {
        // you need sin and con to rotate along theta.
        if (controls[this.controller].parameters.a)
            this.doInvRotationZ();
        else {
            let rz = new THREE.Matrix4();
            let theta = controls[this.controller].theta
            rz.set(
                Math.cos(theta), -Math.sin(theta), 0, 0,
                Math.sin(theta), Math.cos(theta), 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1);

            this.cube.geometry.applyMatrix4(rz);
            this.cube.geometry.verticesNeedUpdate = true;
            // scale the geometry not the mesh
        }
    }

    doInvRotationZ() {
        // you need sin and con to rotate along theta.
        let rz = new THREE.Matrix4();
        let theta = controls[this.controller].theta
        rz.set(
            Math.cos(-theta), -Math.sin(-theta), 0, 0,
            Math.sin(-theta), Math.cos(-theta), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1);

        this.cube.geometry.applyMatrix4(rz);
        this.cube.geometry.verticesNeedUpdate = true;
        // scale the geometry not the mesh
    }

    doShear() {
        if (controls[this.controller].parameters.a)
            this.doInvShear();
        else {
            let sm = new THREE.Matrix4();
            let a = controls[this.controller].a, b = controls[this.controller].b, c = controls[this.controller].c, d = controls[this.controller].d;
            let e = controls[this.controller].e, f = controls[this.controller].f;

            sm.set(
                1, a, b, 0,
                c, 1, d, 0,
                e, f, 1, 0,
                0, 0, 0, 1
            );
            this.cube.geometry.applyMatrix4(sm);
            this.cube.geometry.verticesNeedUpdate = true;
        }
    }

    doInvShear() {
        let sm = new THREE.Matrix4();
        let a = controls[this.controller].a, b = controls[this.controller].b, c = controls[this.controller].c, d = controls[this.controller].d;
        let e = controls[this.controller].e, f = controls[this.controller].f;

        sm.set(
            1, -a, -b, 0,
            -c, 1, -d, 0,
            -e, -f, 1, 0,
            0, 0, 0, 1
        );
        this.cube.geometry.applyMatrix4(sm);
        this.cube.geometry.verticesNeedUpdate = true;

    }


    setChecked( prop )  // checkbox hack - consider making this cleaner :D
    {
        if (this.parameters[prop] === true )
            this.parameters[prop] = true;
        else
            this.parameters[prop] = false;
    }
}


function createCubes()
{
    // Create Geometry ---- we will do this differently? Can you do better?
    const boxWidth  = 2;
    const boxHeight = 2;
    const boxDepth  = 2;

    let distance = boxWidth + boxWidth * .5;

    cubes = [];
    let startdistance = -((numcubes) * distance)/2;
    startdistance -= distance/2;
    for (let i=0; i< numcubes; i++)
    {
        let geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        startdistance += distance;
        cubes.push( createCube( geometry, getColor(), startdistance, 'cube') );

    }

}

// Creating a single Cube here.
function createCube( geometry, color, xpos, name )
{
    const material = new THREE.MeshPhongMaterial( {color} );
    //const material = new THREE.MeshNormalMaterial();
    material.transparent = true;

    // create a Mesh containing the geometry and material
    let cube = new THREE.Mesh( geometry, material );
    cube.name = name;

    // add the cube to the scene
    cub.add(cube);
    cube.position.x = xpos;
    return cube;
}


function addControls( controlObject )
{
    //  https://codepen.io/justgooddesign/pen/sbGLC  checkbox
    const gui = new dat.GUI();
    let parameter = {a:false, b:false }
    gui.add(controlObject, 'rotationSpeed', -0.1, 0.1).step(0.01);
    gui.add(controlObject, 'scale', 0, 2).step(0.1);
    gui.add(controlObject, 'x', -5, 5).step(0.1);
    gui.add(controlObject, 'y', -5, 5).step(0.1);
    gui.add(controlObject, 'z', -5, 5).step(0.1);
    gui.add(controlObject, 'a', -5, 5).step(0.1);
    gui.add(controlObject, 'b', -5, 5).step(0.1);
    gui.add(controlObject, 'c', -5, 5).step(0.1);
    gui.add(controlObject, 'd', -5, 5).step(0.1);
    gui.add(controlObject, 'e', -5, 5).step(0.1);
    gui.add(controlObject, 'f', -5, 5).step(0.1);
    gui.add(controlObject.parameters, 'a').name('Inverse').listen().onChange(function(){controlObject.setChecked("a")});

    gui.add(controlObject, 'doTranslation');
    gui.add(controlObject, 'doScale');
    gui.add(controlObject, 'doShear');
    gui.add(controlObject, 'theta', -Math.PI, Math.PI).step(0.1);
    gui.add(controlObject, 'doRotationX');
    gui.add(controlObject, 'doRotationY');
    gui.add(controlObject, 'doRotationZ');

    // you will need to add controls for shear
}

// -----------------------------------------------------------------------
// bottom functions same as earlier project
// -----------------------------------------------------------------------
function createCamera()
{
    // Create a Camera  -------------------------------------------------
    const aspect = container.clientWidth / container.clientHeight;
    const fov=50;           // fov = Field Of View
    const near = 0.1;          // the near clipping plane
    const far = 100;          // the far clipping plane
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    // camera.position.set( 0, 0, 10 );
    // every object is initially created at ( 0, 0, 0 )
    // we'll move the camera **back** a bit so that we can view the scene
    camera.position.x = -2;   // x+ is to the right.
    camera.position.y = 6;    // y+ is up.
    camera.position.z = 4;   // z+ moves camera closer (to us). z- further away.
    camera.position.set( -10, 10, 20 );
    //camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    camera.lookAt( scene.position );
}


function createCameraControls()
{
    cameraControls = new OrbitControls( camera, container );
}


function createLights()
{
    // Create a directional light
    const light1 = new THREE.DirectionalLight( 0xffffff, 1.0 );
    // move the light back, right and up a bit
    light1.position.set( 4, 4, 8 );
    light1.castShadow = 'true';
    // remember to add the light to the scene
    scene.add( light1 );

    /* play around with multiple lights
    // Create another directional light */
    const light2 = new THREE.DirectionalLight( 0xffffff, 0.7 );
    // move the light back, left and down a bit */
    light2.position.set( -20, -20, 10 );
    // remember to add the light to the scene
    scene.add( light2 );
	//light1.target(0,0,0) - light points by default to origin

}

function createHelperGrids()
{
    // Create a Helper Grid ---------------------------------------------
    let size = 40;
    let divisions = 40;

    // Ground
    let gridHelper = new THREE.GridHelper( size, divisions, 0xff5555, 0x444488 );
    scene.add( gridHelper );

    //  Vertical
    let gridGround = new THREE.GridHelper( size, divisions, 0x55ff55, 0x667744 );
    gridGround.rotation.x = Math.PI / 2;
    scene.add( gridGround );
}

function createRenderer()
{
    //renderer = new THREE.WebGLRenderer();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    // we set this according to the div container.
    renderer.setSize( container.clientWidth, container.clientHeight );
    renderer.setClearColor( 0x000000, 1.0 );
    container.appendChild( renderer.domElement );  // adding 'canvas; to container here
    // render, or 'create a still image', of the scene
}

//
// set the animation loop - setAnimationLoop  will do all the work for us.
function play()
{
    renderer.setAnimationLoop( ( timestamp ) =>
    {
        update( timestamp );
        render();
    } );

    // we used the funky - arrow function for our function here, for more details
    // on this syntax see here:
    // https://www.w3schools.com/js/js_arrow_function.asp
}


function update( timestamp )
{
    // don't use thee timestamp this time.

    cubes.forEach((cube, ndx) =>
    {       // speed control by the gui
        cube.rotation.x += controls[ndx].rotationSpeed;
        cube.scale.set(controls[ndx].scale, controls[ndx].scale, controls[ndx].scale);
       // controls[ndx].doTranslation();

    });
    cub.rotation.x += controls[numcubes].rotationSpeed;
    //forEach iterates of array elements [], for more details on
    // for each see here: https://www.w3schools.com/jsref/jsref_foreach.asp
}


// called by play
function render( )
{
    // render, or 'create a still image', of the scene
    renderer.render( scene, camera );
}


function onWindowResize()
{
    // set the aspect ratio to match the new browser window aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;

    // update the camera's frustum - so that the new aspect size takes effect.
    camera.updateProjectionMatrix();

    // update the size of the renderer AND the canvas (done for us!)
    renderer.setSize( container.clientWidth, container.clientHeight );
}


function init()
{
    // Get a reference to the container element that will hold our scene
    container = document.querySelector('#scene-container');

    // Just set this resizing up right away - we are suing of window here.
    window.addEventListener( 'resize', onWindowResize );

    // Create a Bare Scene-----------------------------------------------
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x555555 )

    // Create a Camera  -------------------------------------------------
    createCamera();

    // Let there be Light  ---------------------------------------------
    createLights();

    // Create a Grids Horizontal & Vertical -----------------------------
    createHelperGrids();

    // Enable the Camera to move around
    createCameraControls();

    // Create the subject of
    let geometry = new THREE.BoxGeometry(2, 2, 2);
    cub = createCube(geometry, getColor(), 0, 'cube');
    scene.add(cub);
    createCubes();

    // Create gui controls ---
    controls = [];
    for (let i=0; i< numcubes; i++)
    {
        //cub.add(cubes[i])
        controls.push(new Controller(cubes[i], i));
        addControls(controls[i]);
    }
    controls.push(new Controller(cub, numcubes));
    addControls(controls[numcubes]);
   
    // Create & Install Renderer ---------------------------------------
    createRenderer();

    play();

    renderer.render( scene, camera );  // renders once.

    // -----------------------------------------------------------------------
}

// call the init function to set everything up
init();
