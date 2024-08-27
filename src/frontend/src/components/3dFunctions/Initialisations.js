/*
 * Created Date: 23.01.2024 13:09:11
 * Author: Tobias Mink
 * 
 * Last Modified: 27.08.2024 14:20:30
 * Modified By: Julian Hardtung
 * 
 * Description: A Collection of initialisation functions, which will be called
 *              in the mounted function in 3DView.js. This includes the creation
 *              of the mainSceneParams/subSceneParams scene and various tools.
 */

import { Raycaster, Vector2, BoxGeometry, DoubleSide, FrontSide, Mesh, 
  BufferGeometry, MeshStandardMaterial, WebGLRenderer, PCFSoftShadowMap, 
  LinearSRGBColorSpace, Scene, PerspectiveCamera, DirectionalLight, 
  AmbientLight, ShaderMaterial, Vector3, HemisphereLight, ShadowMaterial, 
  IcosahedronGeometry, PlaneGeometry, VSMShadowMap, sRGBEncoding, 
  MeshPhongMaterial } from 'three';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { ArcballControls } from
'three/examples/jsm/controls/ArcballControls.js';
import { TransformControls } from
'three/examples/jsm/controls/TransformControls.js';
import { OrbitControls } from
'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 
'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 
'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 
'three/examples/jsm/postprocessing/OutlinePass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { GammaCorrectionShader } from
'three/examples/jsm/shaders/GammaCorrectionShader';
import { CSS2DRenderer } from 
'three/examples/jsm/renderers/CSS2DRenderer'
import { Evaluator, Brush, GridMaterial } from 'three-bvh-csg';

import * as TWEEN from '@tweenjs/tween.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import vertexShader from './shaders/blob/vertexShader.glsl';
import fragmentShader from './shaders/blob/fragmentShader.glsl';

import { exParams } from './Parameter';
import { uniform } from 'three/examples/jsm/nodes/core/UniformNode.js';

export class Initialisations {

  constructor( segmentationTool ) {
    this.segmentationTool = segmentationTool;
    this.shader = {
      PerlinNoise: {
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      }
    }
  }

  /**
   * Initialize the measurement tool.
   * @param { object } document 
   * @param { object } canvas 
   * @param { object } params 
   */
  initMeasurementTool( canvas, mmTool, document ) {
    /* Create CSS2D-Renderer and adjust its attributes */
    mmTool.css2DRenderer = new CSS2DRenderer()
    mmTool.css2DRenderer.setSize( canvas.clientWidth, canvas.clientHeight );
    mmTool.css2DRenderer.domElement.style.position = mmTool.css2DRendererParams.position;
    mmTool.css2DRenderer.domElement.style.top = mmTool.css2DRendererParams.top;
    mmTool.css2DRenderer.domElement.style.color = mmTool.css2DRendererParams.color;
    mmTool.css2DRenderer.domElement.style.pointerEvents = mmTool.css2DRendererParams.pointerEvents;
    mmTool.css2DRenderer.domElement.style.zIndex = "2"; // Always above canvas
    /* Append the CSS2D-Renderer to document */
    document.body.appendChild( mmTool.css2DRenderer.domElement)

    /* Create new Raycaster */
    mmTool.raycaster = new Raycaster();
    mmTool.pointer = new Vector2();

    mmTool.lineID = String(Date.now());
  }

  /**
   * Initialize the stToolParams tool
   * @param { object } main 
   * @param { object } stTool 
   * @param { object } centerOfObjects 
   */
  initSegmentationTool( objects, scene, list, stTool, centerOfObjects ) {
    /* Create new map to override attributes of new brushes */
    stTool.materialMap = new Map();

    /* Create evaluator for csg purposes. It will produce the final result of 
     * the operation. */
    stTool.csgEvaluator = new Evaluator();
    stTool.csgEvaluator.attributes = [ 'position', 'normal' ];

    /* Create a brush to cut with.
     * This brush can be moved and will be used to cut the objects. */
    const brushToCutWith = new Brush( new BoxGeometry(5, 10, 10), 
      new GridMaterial() );
    brushToCutWith.name = stTool.brushToCutWithParams.name;
    /* Move stToolParams brush to the loaded objects, according to their 
     * position */
    brushToCutWith.position.set( 
      centerOfObjects.x - stTool.brushToCutWithParams.positionOffset, 
      centerOfObjects.y, centerOfObjects.z );
    /* Create parameter entry */
    stTool.brushToCutWith = {
      brush: brushToCutWith,
      brushColor: stTool.brushToCutWithParams.color,
      attached: stTool.brushToCutWithParams.attached
    }
    /* Update brushesOfObjects */
    this.segmentationTool.updateBrush( brushToCutWith, list );
    /* Initialize brush materials */
    stTool.brushToCutWith.brush.material.opacity = 
      stTool.brushToCutWithParams.material.opacity;
    stTool.brushToCutWith.brush.material.transparent = 
      stTool.brushToCutWithParams.material.transparent;
    stTool.brushToCutWith.brush.material.depthWrite = 
      stTool.brushToCutWithParams.material.depthWrite;
    stTool.brushToCutWith.brush.material.polygonOffset = 
      stTool.brushToCutWithParams.material.polygonOffset;
    stTool.brushToCutWith.brush.material.polygonOffsetFactor = 
      stTool.brushToCutWithParams.material.polygonOffsetFactor;
    stTool.brushToCutWith.brush.material.polygonOffsetUnits = 
      stTool.brushToCutWithParams.material.polygonOffsetUnits;
    stTool.brushToCutWith.brush.material.side = DoubleSide;
    stTool.brushToCutWith.brush.material.premultipliedAlpha = 
      stTool.brushToCutWithParams.material.premultipliedAlpha;
    stTool.brushToCutWith.brush.material.color
      .set( stTool.brushToCutWith.brushColor )
    stTool.brushToCutWith.brush.receiveShadow = 
      stTool.brushToCutWithParams.material.receiveShadow;
    stTool.brushToCutWith.brush.visible = 
      stTool.brushToCutWithParams.material.visible;
    /* Add brush to scene */
    scene.add( stTool.brushToCutWith.brush );
    /* Create material map for transparent to opaque variants */
    let mat;
    mat = stTool.brushToCutWith.brush.material.clone();
    mat.side = FrontSide;
    mat.opacity = stTool.brushToCutWithParams.mat.opacity;
    mat.transparent = stTool.brushToCutWithParams.mat.transparent;
    mat.depthWrite = stTool.brushToCutWithParams.mat.depthWrite;
    mat.name = stTool.brushToCutWithParams.mat.name
    stTool.materialMap.set( stTool.brushToCutWith.brush.material, mat );
    
    /* ## Initialize brushesOfObjects ## */
    /* Create a brush for every object in scene, so that every object can be 
     * used. */
    objects.allObjects.forEach( (object, idx) => {
      /* Merge meshes of object */
      const geometryForBrush = [];
      object.traverse( ( child ) => {
        if( child instanceof Mesh ) {
          geometryForBrush.push(child.geometry.clone())
        }
      } )
      const geomMerge = BufferGeometryUtils.mergeGeometries(geometryForBrush)
      const brush = new Brush( geomMerge, new GridMaterial() );
      brush.name = object.children[0].name;
      brush.position.set( object.children[0].position.x, 
        object.children[0].position.y, object.children[0].position.z );
      brush.scale.setScalar( 1 );
      stTool.brushesOfObjects.push( {
        brush: brush,
        brushColor: stTool.brushesOfObjectsParams.colors[idx],
        resultBrush: stTool.brushesOfObjectsParams.resultBrush,
        originalMaterial: stTool.brushesOfObjectsParams.originalMaterial
      } );
    })
    /* Update brushesOfObjects */
    stTool.brushesOfObjects.forEach( brush => {
      this.segmentationTool.updateBrush( brush.brush, list );
    })
    /* Initialize brush materials */
    stTool.brushesOfObjects.forEach( brush => {
      brush.brush.material.opacity = 
        stTool.brushesOfObjectsParams.material.opa
        
      brush.brush.material.transparent = 
        stTool.brushesOfObjectsParams.material.transparent;
      brush.brush.material.depthWrite = 
        stTool.brushesOfObjectsParams.material.depthWrite;
      brush.brush.material.polygonOffset = 
        stTool.brushesOfObjectsParams.material.polygonOffset;
      brush.brush.material.polygonOffsetFactor = 
        stTool.brushesOfObjectsParams.material.polygonOffsetFactor;
      brush.brush.material.polygonOffsetUnits = 
        stTool.brushesOfObjectsParams.material.polygonOffsetUnits;
      brush.brush.material.side = DoubleSide;
      brush.brush.material.premultipliedAlpha = 
        stTool.brushesOfObjectsParams.material.premultipliedAlpha;
      brush.brush.material.color.set( brush.brushColor )
      brush.brush.receiveShadow = 
        stTool.brushesOfObjectsParams.material.receiveShadow;
      brush.brush.visible = 
        stTool.brushesOfObjectsParams.material.visible;
    } );
    /* Add brushesOfObjects to scene */
    stTool.brushesOfObjects.forEach( brush => {
      scene.add( brush.brush );
    } );
    /* Create material map for transparent to opaque variants */
    stTool.brushesOfObjects.forEach( brush => {
      mat = brush.brush.material.clone();
      mat.side = FrontSide;
      mat.opacity = stTool.brushesOfObjectsParams.mat.opacity;
      mat.transparent = stTool.brushesOfObjectsParams.mat.transparent;
      mat.depthWrite = stTool.brushesOfObjectsParams.mat.depthWrite;
      mat.name = brush.brush.name;
      stTool.materialMap.set( brush.brush.material, mat );
    } );
    stTool.materialMap.forEach( ( m0, m1, m2 ) => {
      m0.enableGrid = stTool.gridTexture;
      m1.enableGrid = stTool.gridTexture;
      m2.enableGrid = stTool.gridTexture;
    } );
    /* Add object displaying the result */
    stTool.brushesOfObjects.forEach( brush => {
      brush.resultObject = new Mesh( new BufferGeometry(), 
      new MeshStandardMaterial( {
        flatShading: stTool.brushesOfObjectsParams.resultObject.flatShading,
        polygonOffset: 
          stTool.brushesOfObjectsParams.resultObject.polygonOffset,
        polygonOffsetUnits: 
          stTool.brushesOfObjectsParams.resultObject.polygonOffsetUnits,
        polygonOffsetFactor: 
          stTool.brushesOfObjectsParams.resultObject.polygonOffsetFactor
      } ) );
      brush.resultObject.castShadow = 
        stTool.brushesOfObjectsParams.resultObject.castShadow;
      brush.resultObject.receiveShadow = 
        stTool.brushesOfObjectsParams.resultObject.receiveShadow;
      brush.originalMaterial = brush.resultObject.material;
      scene.add( brush.resultObject );
    } );
  }

  /**
   * Initializes the mainSceneParams scene and its attributes
   * @param { object } params 
   */
  mainInit( main ) {
    /* Create renderer */
    main.renderer = new WebGLRenderer( {
      canvas: main.canvas,
      antialias: main.rendererParams.antialias
    } );
    main.renderer.setPixelRatio(window.devicePixelRatio);
    main.renderer.setSize( main.canvas.clientWidth, main.canvas.clientHeight );
    main.renderer.setClearColor( main.rendererParams.backgroundColor, 
      main.rendererParams.backgroundColorIntensity );
    
    main.renderer.shadowMap.enabled = main.rendererParams.shadowMapEnabled;
    main.renderer.shadowMap.type = PCFSoftShadowMap;
    main.renderer.outputColorSpace = LinearSRGBColorSpace;
      
    /* Create scene */
    main.scene = new Scene();
    main.scene.name = main.sceneParams.name

    /* Create camera */
    const aspect = main.canvas.clientWidth / main.canvas.clientHeight;
    main.camera = new PerspectiveCamera( 
      main.cameraParams.attributes.fov, aspect, main.cameraParams.attributes.near, 
      main.cameraParams.attributes.far );
    main.camera.name = main.cameraParams.name

    /* Create light */
    main.directionalLight = new DirectionalLight( 
      main.lightParams.directional.color,
      main.lightParams.directional.intensity );
      main.directionalLight.position.set( 
      main.lightParams.directional.position.x,
      main.lightParams.directional.position.y,
      main.lightParams.directional.position.z );
    main.scene.add( main.directionalLight, main.directionalLight.target );
    main.directionalLight.name = main.lightParams.directional.name;

    main.ambientlight = new AmbientLight( main.lightParams.ambient.color, 
      main.lightParams.ambient.intensity );
    main.scene.add( main.ambientlight );
    main.ambientlight.name = main.lightParams.ambient.name;

    /* Create controls */
    main.arcBallControls = new ArcballControls( main.camera, 
      main.renderer.domElement, main.scene );
    main.arcBallControls._maxDownTime = main.controlsParams.arcball.maxDownTime;
    main.arcBallControls._maxInterval = main.controlsParams.arcball.maxInterval;
    main.arcBallControls.cursorZoom = main.controlsParams.arcball.cursorZoom;
    main.arcBallControls.setGizmosVisible( 
      main.controlsParams.arcball.gizmosVisible );

    main.transformControls = new TransformControls( main.camera,
      main.renderer.domElement );
    main.transformControls.addEventListener( 'dragging-changed', e => {
      main.arcBallControls.enabled = !e.value;
    } );
    main.transformControls.addEventListener( 'objectChange', () => {
      main.needsUpdate = true;
    } )
    main.scene.add( main.transformControls );

    /* Create raycaster */
    main.raycaster = new Raycaster();
    main.pointer = new Vector2();
    
    /* Post processing */
    main.composer = new EffectComposer( main.renderer );
    main.composer.setSize( window.innerWidth, window.innerHeight )

    main.renderPass = new RenderPass( main.scene, main.camera );
    main.composer.addPass( main.renderPass );
    
    main.outlinePass = new OutlinePass( new Vector2(
      window.innerWidth, window.innerHeight ),
      main.scene, main.camera );
    main.outlinePass.hiddenEdgeColor.set( 
      main.postProcessingParams.outlinePass.color )
    main.outlinePass.pulsePeriod = 
      main.postProcessingParams.outlinePass.pulsePeriod;
    main.outlinePass.edgeStrength = 
      main.postProcessingParams.outlinePass.edgeStrength;
    main.outlinePass.edgeThickness = 
      main.postProcessingParams.outlinePass.edgeThickness;
    main.outlinePass.edgeGlow = 
      main.postProcessingParams.outlinePass.edgeGlow;
    main.composer.addPass( main.outlinePass );
    
    // Shader
    main.effectFXAA = new ShaderPass( FXAAShader );
    main.effectFXAA.uniforms[ 'resolution' ].value.set(
      1 / window.innerWidth, 1 / window.innerHeight );
    main.composer.addPass( main.effectFXAA );

    main.gammaCorrectionShader = new ShaderPass( GammaCorrectionShader );
    main.composer.addPass( main.gammaCorrectionShader )
  }

  /**
   * Initializes the sub scene and its attributes
   * @param { object } params 
   */
  subInit( sub ) {
    /* Create Renderer */
    sub.renderer = new WebGLRenderer( { canvas: sub.canvas } );
    sub.renderer.setPixelRatio( sub.canvas.devicePixelRatio );
    sub.renderer.setSize( sub.canvas.clientWidth,
      sub.canvas.clientHeight );
    sub.renderer.setClearColor( sub.rendererParams.backgroundColor,
      sub.renderer.backgroundColorIntensity );
    sub.renderer.shadowMap.enabled = sub.rendererParams.shadowMapEnabled;
    sub.renderer.shadowMap.type = PCFSoftShadowMap;

    /* Create Scene */
    sub.scene = new Scene();
    sub.scene.name = sub.sceneParams.name;

    /* Create Camera */
    const aspect = sub.canvas.clientWidth / sub.canvas.clientHeight;
    sub.camera = new PerspectiveCamera( sub.cameraParams.fov, aspect, 
      sub.cameraParams.near, sub.cameraParams.far );

    /* Create Light */
    sub.light = new AmbientLight( sub.lightParams.ambient.color );
    sub.scene.add( sub.light );

    /* Create Controls */
    sub.orbitControls = new OrbitControls( sub.camera, 
      sub.renderer.domElement );
  }

  async mainInitNoObjects( main ) {
    
    main.scene = new Scene();

		main.camera = new PerspectiveCamera(25, main.canvas.clientWidth / main.canvas.clientHeight, 0.1, 1000);
		main.camera.position.set(0,1.5,-17);
    main.camera.updateProjectionMatrix();

		main.renderer = new WebGLRenderer( {
      canvas: main.canvas,
      antialias: main.rendererParams.antialias
    } );
    main.renderer.setSize( main.canvas.clientWidth, main.canvas.clientHeight );
    main.renderer.setClearColor( main.rendererParams.backgroundColor, 
      main.rendererParams.backgroundColorIntensity );
    main.renderer.shadowMap.enabled = main.rendererParams.shadowMapEnabled;
		main.renderer.shadowMap.type = VSMShadowMap
		main.renderer.outputEncoding = sRGBEncoding;

		main.controls = new OrbitControls(main.camera, main.renderer.domElement);
		main.controls.target = new Vector3(0, 1.5, 0);
		main.controls.enableDamping = true;
		main.controls.maxPolarAngle = Math.PI/2
		main.controls.minDistance = 2
    main.controls.maxDistance = 30
    main.controls.enablePan = false
    main.controls.ebableRotate = false

		// Directional (Key) Light

		main.directional_light = new DirectionalLight( 0xffffff, 0.8 )
		main.directional_light.position.set( 0, 5, 0 )
		main.directional_light.castShadow = true
		main.directional_light.shadow.mapSize.width = 1024
		main.directional_light.shadow.mapSize.height = 1024
		main.directional_light.shadow.camera.far = 24
		main.directional_light.shadow.radius = 5
		main.directional_light.shadow.bias = - 0.00006
		main.scene.add( main.directional_light )


		// Hemisphere (Fill) Light

		const hemisphere_light = new HemisphereLight( 0xffffff, 0x000000, 0.2 );
		hemisphere_light.position.set( 0, 6, 0 );
		main.scene.add( hemisphere_light );


		// Materials

		const white_material = new MeshPhongMaterial({color: 0xffffff,});
		const shadow_material = new ShadowMaterial({opacity: 0.3});


		// Ground Plane

		const ground_geometry = new PlaneGeometry(20, 20);
		const ground = new Mesh(ground_geometry, shadow_material);
		ground.receiveShadow = true;
		ground.rotateX(-Math.PI / 2);
		ground.position.set(0, -2, 0);
		main.scene.add(ground);


		// Icosahedron

		const icosahedron_geometry = new IcosahedronGeometry(1,0);
		const icosahedron = new Mesh( icosahedron_geometry, white_material );
		icosahedron.position.y = 3;
    icosahedron.scale.set(1.5, 1.5, 1.5)
		icosahedron.castShadow = true;
		main.scene.add(icosahedron);


		// Tween.js Tweening

		new TWEEN.Tween(icosahedron.position)
			.to( { y:3 }, 2000)
      .delay(1000)
			.yoyo(true)
			.repeat(Infinity)
			.easing(TWEEN.Easing.Cubic.Out)
			.start()
		;

		new TWEEN.Tween(icosahedron.rotation)
      .to({ y: "-" + (Math.PI/2) * 8}, 6000)
      // Math.PI/2 = 360degrees x8 rotations over 6 seconds
      .delay(1000)
      .repeat(Infinity)
      .easing(TWEEN.Easing.Cubic.Out)
      .start()
    ;

    new TWEEN.Tween(icosahedron.rotation)
      .to({ x: "-" + (Math.PI/2) * 9}, 14000)
      .delay(1000)
      .repeat(Infinity)
      .easing(TWEEN.Easing.Cubic.Out)
      .start()
		;

    new TWEEN.Tween(icosahedron.scale)
			.to( { x:1.25, y:1.25, z:1.25 }, 5000)
      .delay(1000)
			.yoyo(true)
			.repeat(Infinity)
			.easing(TWEEN.Easing.Cubic.Out)
			.start()
		;

    let object, loader = null;
    loader = new GLTFLoader();

    object = await new Promise( ( resolve ) => {
      loader.load(
      '../assets/3d_part/no_objects_default_3.glb',
        function( glb ) {
          glb.scene.traverse( ( child ) => {
            if ( child instanceof Mesh ) {
              child.name = "Default mesh";
              child.position.set( 0, 0, 0 );
            }
          } )
          resolve( glb.scene )
        }
      )
    });
    main.scene.add( object );
    object.scale.set(1.5, 1.5, 1.5)
    object.rotation.y = Math.PI / 1

	}
  
  async mainInitNoObjects2( main ) {
    main.scene = new Scene();

		main.camera = new PerspectiveCamera(25, main.canvas.clientWidth / main.canvas.clientHeight, 0.1, 1000);
		main.camera.position.set(0,1.5,-17);

		main.renderer = new WebGLRenderer( {
      canvas: main.canvas,
      antialias: main.rendererParams.antialias
    } );
    main.renderer.setSize( main.canvas.clientWidth, main.canvas.clientHeight );
    main.renderer.setClearColor( main.rendererParams.backgroundColor, 
      main.rendererParams.backgroundColorIntensity );
    main.renderer.shadowMap.enabled = main.rendererParams.shadowMapEnabled;
		// main.renderer.shadowMap.type = VSMShadowMap;
		// main.renderer.outputEncoding = sRGBEncoding;
    main.renderer.shadowMap.type = PCFSoftShadowMap;
    main.renderer.outputColorSpace = LinearSRGBColorSpace;
    

		main.controls = new OrbitControls(main.camera, main.renderer.domElement);
		main.controls.target = new Vector3(0, 1.5, 0);
		main.controls.enableDamping = true;
		main.controls.maxPolarAngle = Math.PI/2
		main.controls.minDistance = 2
    main.controls.maxDistance = 30
    main.controls.enablePan = false
    main.controls.ebableRotate = false
    main.controls.enabled = false
    

		// Directional (Key) Light
		main.directional_light = new DirectionalLight( 0xffffff, 1 )
		main.directional_light.position.set( 0, 5, -2 )
		main.directional_light.castShadow = true
		main.directional_light.shadow.mapSize.width = 1024
		main.directional_light.shadow.mapSize.height = 1024
		main.directional_light.shadow.camera.far = 24
		main.directional_light.shadow.radius = 5
		main.directional_light.shadow.bias = - 0.00006
		main.scene.add( main.directional_light )


		// Hemisphere (Fill) Light
		const hemisphere_light = new HemisphereLight( 0xffffff, 0x000000, 0.3 );
		hemisphere_light.position.set( 0, 6, 0 );
		// main.scene.add( hemisphere_light );


    // Uniforms
    const uniforms = {
      u_resolution: { type: 'v2', value: new Vector2( window.innerWidth, window.innerHeight ) },
      u_time: { type: 'f', value: 0.0 }
    }


		// Ground Plane
		const ground_geometry = new PlaneGeometry(200, 200);
		const ground = new Mesh(ground_geometry, new MeshStandardMaterial({color: 0x151d21}));
		ground.rotateY(-Math.PI);
    ground.position.set( 0, 0, 3 );
		main.scene.add(ground);


		// Icosahedron
		const icosahedron_geometry = new IcosahedronGeometry(4, 30);
		const icosahedron_material = new ShaderMaterial( {
      uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    } );
    icosahedron_material.wireframe = true;
		const icosahedron = new Mesh( icosahedron_geometry, icosahedron_material );
    icosahedron.position.y = 3;
    icosahedron.scale.set(0.3, 0.3, 0.3);
    // icosahedron.scale.set(1.5, 1.5, 1.5)
		icosahedron.castShadow = true;
    icosahedron.name = "ICO";
		main.scene.add(icosahedron);
    

    new TWEEN.Tween(icosahedron.rotation)
      .to({ y: "-" + (Math.PI/2) * 9}, 120000)
      .repeat(Infinity)
      .easing(TWEEN.Easing.Cubic.Out)
      .start()
		;

    
    // Text
    let object, loader = null;
    loader = new GLTFLoader();

    object = await new Promise( ( resolve ) => {
      loader.load(
      '../assets/3d_part/no_objects_default_3.glb',
        function( glb ) {
          glb.scene.traverse( ( child ) => {
            if ( child instanceof Mesh ) {
              child.name = "Default mesh";
              child.position.set( 0, 0, 0 );
            }
          } )
          resolve( glb.scene )
        }
      )
    });
    main.scene.add( object );
    // object.scale.set(1.5, 1.5, 1.5)
    object.rotation.y = Math.PI / 1;
	}
  
  initEnviroment( type ) {
    const env = exParams.envs[ type ];

    for( const [ designation, instances ] of Object.entries( env.components ) ) {
      switch( designation ) {
        case 'renderer':
          for( const renderer of instances ) {
            // Create renderer instance and connect it with canvas
            renderer.data = new THREE[renderer.type](renderer.params)
            
            // Apply methods and set properties
            this.applyMethodsAndSetProperties( renderer );
          }
          break;
        case 'scene':
          for( const scene of instances ) {
            // Create scene instance
            scene.data = new THREE[scene.type]();

            // Apply methods and set properties
            this.applyMethodsAndSetProperties( scene );
          }
          break;
        case 'camera':
          for( const camera of instances ) {
            // Create camera instance and connect it with canvas
            camera.data = new THREE[camera.type](...Object.values(camera.params))
            
            // Apply methods and set properties
            this.applyMethodsAndSetProperties( camera );
          }
          break;
        case 'light':
          for( const light of instances ) {
            // Create camera instance and connect it with canvas
            light.data = new THREE[light.type](...Object.values(light.params))
            
            // Apply methods and set properties
            this.applyMethodsAndSetProperties( light );
            
            // Add to scene
            if( light.addToScene ) {
              env.components.scene[0].data.add( light.data )
            }
          }
          break;
        case 'controls':
          for( const controls of instances ) {
            // Create camera instance and connect it with canvas
            switch(controls.type) {
              case 'ArcballControls':
                controls.data = new ArcballControls(...Object.values(controls.params))
                break;
              case 'TransformControls':
                controls.data = new TransformControls(...Object.values(controls.params))
                break;
              case 'OrbitControls':
                controls.data = new OrbitControls(...Object.values(controls.params))
                break;
              default:
                console.log( "Error" );
            }
            
            // Apply methods and set properties
            this.applyMethodsAndSetProperties( controls );
            
            // Add to scene
            if( controls.addToScene ) {
              env.components.scene[0].data.add( controls.data )
            }
          }
          break;
        case 'raycaster':
          for( const raycaster of instances ) {
            // Create camera instance and connect it with canvas
            raycaster.data = new THREE[raycaster.type]()
            
            // Apply methods and set properties
            this.applyMethodsAndSetProperties( raycaster );
          }
          break;
        case 'postProcessing':
          for( const process of instances ) {
            // Create camera instance and connect it with canvas
            switch( process.type ){
              case 'EffectComposer':
                if( Object.keys(process.params).length == 1) {
                  process.data = new EffectComposer(process.params.renderer)
                } else {
                  process.data = new EffectComposer(...Object.values(process.params))
                }
              break;
              case 'RenderPass':
                if( Object.keys(process.params).length == 1) {
                  process.data = new RenderPass(process.params)
                } else {
                  process.data = new RenderPass(...Object.values(process.params))
                }
              break;
              case 'OutlinePass':
                if( Object.keys(process.params).length == 1) {
                  process.data = new OutlinePass(process.params)
                } else {
                  process.data = new OutlinePass(...Object.values(process.params))
                }
              break;
            }

            // Apply methods and set properties
            this.applyMethodsAndSetProperties( process );

            // Add process to composer
            if( process.type != "EffectComposer" ) {
              env.components.postProcessing[0].data.addPass(process.data)
            }
          }
          break;
        case 'attributes':
          for( const [ key2, value2 ] of Object.entries(instances.list) ) {
            if( value2 == null ) {
              for( const check of instances.update ) {
                if( key2 == check.id ){
                  instances.list[key2] = new THREE[check.type](...Object.values(check.params))
                }
              }
            }
          }
          break;
        case 'shader':
          for( const shader of instances ) {
            // Create shader instance
            switch( shader.type ) {
              case 'FXAA':
                shader.data = new ShaderPass(FXAAShader)
                break;
              case 'GammaCorrection':
                shader.data = new ShaderPass(GammaCorrectionShader)
            }

            // Apply methods and set properties
            this.applyMethodsAndSetProperties( shader );

            // Add process to composer
            env.components.postProcessing[0].data.addPass(shader.data)

          }
          break;
        case 'externalShader':
          // Import new shader [ vertex, frag ]
          if( Object.keys(this.shader).length > 0 && env.components.attributes.list.externalShader.length > 0 ){
            for( const type of env.components.attributes.list.externalShader ) {
              env.components.externalShader[type] = 
              {
                data: {
                  vertexShader: this.shader[type].vertexShader,
                  fragmentShader: this.shader[type].fragmentShader
                }
              }
            }
          }
          break;
        case 'defaultObjects':
          // Create new geometries and materials
          for( const [ geomName, geomData ] of Object.entries( instances.geometries.list ) ) {
            if( geomData == null ) {
              for( const check of instances.geometries.initData ) {
                if( geomName == check.id ) {
                  if( geomName == "icosahedronMaterial"){
                    instances.geometries.list[geomName] = new THREE[check.type](check.params)
                  } else {
                    instances.geometries.list[geomName] = new THREE[check.type](...Object.values(check.params))
                  }
                }
              }
            }
          }
          // Create new mesh
          for( const [ meshName, meshData ] of Object.entries( instances.meshes ) ) {
            meshData.data = new THREE[meshData.type](...Object.values(meshData.params))
            // Apply methods and set properties
            this.applyMethodsAndSetProperties( meshData );
            // Add mesh to scene
            env.components.scene[0].data.add( meshData.data )
          }
          break;
        default:
          console.log( "No fitting key available" );
      }
    }
  }

  applyMethodsAndSetProperties( object ) {
    // Apply methods, if available
    if( Object.keys( object.methods ).length != 0 ) {
      for( const [key, value] of Object.entries(object.methods) ) {
        if( key == "addEventListener" ) {
          for( const [key2, value2] of Object.entries(value)) {
            this.executeFunctionApply(key, object.data, key2, value2);
          }
        } else if( key == "uniforms['resolution'].value.set" ) {
          object.data.uniforms['resolution'].value.set(...Object.values(value))
        } else {
          this.executeFunctionApply(key, object.data, ...Object.values(value))
        }
      }
    }
    
    // Set properties, if available
    if( Object.keys( object.properties ).length != 0 ) {
      for( const [key, value] of Object.entries(object.properties) ) {
        this.executeFunctionSet(key, object.data, value);
      }
    }
  }

  executeFunctionApply( functionName, context ) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
  }
  
  executeFunctionSet( functionName, context ) {
    var args = Array.prototype.slice.call(arguments, 2)[0];
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    if( args == "PCFSoftShadowMap" || args == "LinearSRGBColorSpace" ) {
      return context[func] = THREE[args]
    }
    return context[func] = args;
  }
	
}