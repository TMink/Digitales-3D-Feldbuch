import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module';



// globals
let camera, scene, renderer, stats, controls, object;
let planes, planeObjects, planeHelpers;
var container;
const eff = await preLoadModels()

const params = {
	animate: true,
	planeX: {
		constant: 0,
		negated: false,
		displayHelper: false
	},
	planeY: {
		constant: 0,
		negated: false,
		displayHelper: false
	},
	planeZ: {
		constant: 0,
		negated: false,
		displayHelper: false
	}
};

// Run
init()
animate()



function createPlaneStencilGroup( geometry, plane, renderOrder ) {

	const group = new THREE.Group();
	const baseMat = new THREE.MeshBasicMaterial();
	baseMat.depthWrite = false;
	baseMat.depthTest = false;
	baseMat.colorWrite = false;
	baseMat.stencilWrite = true;
	baseMat.stencilFunc = THREE.AlwaysStencilFunc;

	// back faces
	const mat0 = baseMat.clone();
	mat0.side = THREE.BackSide;
	mat0.clippingPlanes = [ plane ];
	mat0.stencilFail = THREE.IncrementWrapStencilOp;
	mat0.stencilZFail = THREE.IncrementWrapStencilOp;
	mat0.stencilZPass = THREE.IncrementWrapStencilOp;
	const mesh0 = new THREE.Mesh( geometry, mat0 );
	mesh0.renderOrder = renderOrder;
	group.add( mesh0 );

	// front faces
	const mat1 = baseMat.clone();
	mat1.side = THREE.FrontSide;
	mat1.clippingPlanes = [ plane ];
	mat1.stencilFail = THREE.DecrementWrapStencilOp;
	mat1.stencilZFail = THREE.DecrementWrapStencilOp;
	mat1.stencilZPass = THREE.DecrementWrapStencilOp;
	const mesh1 = new THREE.Mesh( geometry, mat1 );
	mesh1.renderOrder = renderOrder;
	group.add( mesh1 );
	return group;

}



// Init
function init()
{
    // Scene
    scene = new THREE.Scene();
    scene.add( new THREE.AxesHelper( 5 ) )
    
    
    
    // Camera
    camera = new THREE.PerspectiveCamera( 36, window.innerWidth / window.innerHeight, 0.25, 20000 );
    camera.position.set(1,0,0);
    
    
    
    // Lights
    scene.add( new THREE.AmbientLight( 0xffffff) );
    
    
    
    // Box
    const cubegeometry = new THREE.BoxGeometry( 1, 1, 1 );
    //const cubematerial = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true});
    //const cube = new THREE.Mesh( cubegeometry, cubematerial );
    //scene.add( cube );



    // Excavation side
    const textureLoader = new THREE.TextureLoader();
    const textureYay = textureLoader.load("models/excavation/15_17-07 SE07011+012+013+014+015+016+017+018+019+020.jpg");
    
    var myMesh = new THREE.Mesh();

    const material2 = new THREE.MeshStandardMaterial( {
        map: textureYay,
	    clippingPlanes: planes,
	    clipShadows: true,
	    shadowSide: THREE.DoubleSide,
        side: THREE.DoubleSide
    } );
    
    eff.traverse( function( child ) 
    {
        if( child instanceof THREE.Mesh )
        {
            child.material = material2;
            myMesh = child;
        }
    });
    
    //scene.add( eff );
    
    var boundBox = new THREE.BoxHelper(eff, 0xffff00);
    scene.add(boundBox);
    
    var geometry2 = myMesh.geometry
    
    // Get center of Mesh
    var center = new THREE.Vector3();
    var box = new THREE.Box3().setFromObject(eff);
    box.getCenter(center);
    
    
    var center1 = new THREE.Vector3(center.x, 0, 0);
    var center2 = new THREE.Vector3(0, center.y, 0);
    var center3 = new THREE.Vector3(0, 0, center.z);
    
    
    // Create PLanes For stencil-clipping
    planes = [
        new THREE.Plane(),
	    new THREE.Plane( new THREE.Vector3(  0, -1,  0 ), 0 ),
	    new THREE.Plane( new THREE.Vector3(  0,  0, -1 ), 0 )
    ];
    
    planeHelpers = planes.map( p => new THREE.PlaneHelper( p, 200, 0xffffff ));
    planeHelpers.forEach( ph => {
        ph.visible = true;
	    scene.add( ph );
    } );

    const geometry = new THREE.TorusKnotGeometry( 0.4, 0.15, 220, 60 );

    object = new THREE.Group();
    scene.add( object );

    // Set up clip plane rendering
    planeObjects = [];
    const planeGeom = new THREE.PlaneGeometry( 4, 4 );
        for ( let i = 0; i < 3; i ++ ) {
	        const poGroup = new THREE.Group();
	        const plane = planes[ i ];
	        const stencilGroup = createPlaneStencilGroup( geometry2, plane, i + 1 );
	        // plane is clipped by the other clipping planes
	        const planeMat = new THREE.MeshStandardMaterial( {
			    color: 0xE91E63,
			    metalness: 0.1,
			    roughness: 0.75,
			    clippingPlanes: planes.filter( p => p !== plane ),
			    stencilWrite: true,
			    stencilRef: 0,
			    stencilFunc: THREE.NotEqualStencilFunc,
			    stencilFail: THREE.ReplaceStencilOp,
			    stencilZFail: THREE.ReplaceStencilOp,
			    stencilZPass: THREE.ReplaceStencilOp,
		    } );
	
            const po = new THREE.Mesh( planeGeom, planeMat );
	        po.onAfterRender = function ( renderer ) {
		        renderer.clearStencil();
	        };
	        
            po.renderOrder = i + 1.1;
	        object.add( stencilGroup );
	        poGroup.add( po );
	        planeObjects.push( po );
	        scene.add( poGroup );
    }

    const material = new THREE.MeshStandardMaterial( {
        map: textureYay,
	    clippingPlanes: planes,
	    clipShadows: true,
	    shadowSide: THREE.DoubleSide,
        side: THREE.DoubleSide
    } );

    // add the color
    const clippedColorFront = new THREE.Mesh( geometry2, material );
    clippedColorFront.castShadow = true;
    clippedColorFront.renderOrder = 6;
    object.add( clippedColorFront );

    
    // Stats
    stats = Stats();
    document.body.appendChild(stats.dom);
    
    

    // Renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x263238 );
    window.addEventListener( 'resize', onWindowResize );
    document.body.appendChild( renderer.domElement );

    renderer.localClippingEnabled = true;
    
    
    
    // Controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set(center.x, center.y, center.z);
    camera.position.set(center.x, center.y - 15, center.z);
    controls.update();

    // GUI

    const gui = new GUI();
    gui.add( params, 'animate' );

    const planeX = gui.addFolder( 'planeX' );
    planeX.add( params.planeX, 'displayHelper' ).onChange( v => planeHelpers[ 0 ].visible = v );
    planeX.add( params.planeX, 'constant' ).min( - 100 ).max( 100 ).onChange( d => planes[ 0 ].constant = d );
    planeX.add( params.planeX, 'negated' ).onChange( () => {
	    planes[ 0 ].negate();
	    params.planeX.constant = planes[ 0 ].constant;
    } );
    planeX.open();

    const planeY = gui.addFolder( 'planeY' );
    planeY.add( params.planeY, 'displayHelper' ).onChange( v => planeHelpers[ 1 ].visible = v );
    planeY.add( params.planeY, 'constant' ).min( - 100 ).max( 100 ).onChange( d => planes[ 1 ].constant = d );
    planeY.add( params.planeY, 'negated' ).onChange( () => {
	    planes[ 1 ].negate();
	    params.planeY.constant = planes[ 1 ].constant;
    } );
    planeY.open();

    const planeZ = gui.addFolder( 'planeZ' );
    planeZ.add( params.planeZ, 'displayHelper' ).onChange( v => planeHelpers[ 2 ].visible = v );
    planeZ.add( params.planeZ, 'constant' ).min( - 100 ).max( 100 ).onChange( d => planes[ 2 ].constant = d );
    planeZ.add( params.planeZ, 'negated' ).onChange( () => {
	    planes[ 2 ].negate();
	    params.planeZ.constant = planes[ 2 ].constant;
    } );
    planeZ.open();

}



// Resize Funktion
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}



// Animate Funktion
function animate() {
    requestAnimationFrame( animate );

    for ( let i = 0; i < planeObjects.length; i ++ ) {
	    const plane = planes[ i ];
	    const po = planeObjects[ i ];
	    plane.coplanarPoint( po.position );
	    po.lookAt(
		    po.position.x - plane.normal.x,
		    po.position.y - plane.normal.y,
		    po.position.z - plane.normal.z,
	    );
    }
    
    stats.begin();
    renderer.render( scene, camera );
    stats.end();

}



// Preload
async function preLoadModels() {

    const objLoader = new OBJLoader()
    const result = await objLoader.loadAsync
    (
        "models/excavation/15_17-07 SE07011+012+013+014+015+016+017+018+019+020.obj",
        (object) => {
           
        }
    );
    return result

}