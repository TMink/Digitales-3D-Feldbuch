/*
 * Created Date: 23.01.2024 13:09:11
 * Author: Tobias Mink
 * 
 * Last Modified: 21.03.2024 17:48:24
 * Modified By: Tobias Mink
 * 
 * Description: 
 */

import * as THREE from 'three';

import { CameraSettings } from './CameraSettings.js';

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
import * as BVH from 'three-mesh-bvh';
import * as CSG from 'three-bvh-csg';

import { SegmentationTool } from './Tools.js';
import { forEach } from 'jszip';

export class Initialisations {

  constructor() {
    this.cameraSettings = new CameraSettings();
  }

  initMeasurementTool( document, canvas, params ) {
    /* label Renderer */
    params.css2DRenderer = new CSS2DRenderer()
    params.css2DRenderer.setSize( canvas.clientWidth,
      canvas.clientHeight );
      params.css2DRenderer.domElement.style.position = 'absolute'
      params.css2DRenderer.domElement.style.top = '35px'
      params.css2DRenderer.domElement.style.color = "white"
      params.css2DRenderer.domElement.style.pointerEvents = 'none'
    document.body.appendChild( params.css2DRenderer.domElement)

    // Raycaster measurementTool
    params.raycaster = new THREE.Raycaster();
    params.pointer = new THREE.Vector2();

    // Variables
    params.lineID = String(Date.now());
  }

  initSegmentationTool( main, stTool, centerOfObjects ) {
    const segmentation = new SegmentationTool()
    
    // material map
    stTool.materialMap = new Map();

    // CSG
    stTool.csgEvaluator = new CSG.Evaluator();
    stTool.csgEvaluator.attributes = [ 'position', 'normal' ];

    /**
     *  - Create a brush to cut with -
     * This brush can be moved and will be used to cut the objects
     */
    const brushToCutWith = new CSG.Brush( new THREE.BoxGeometry(5, 10, 10), new CSG.GridMaterial() );
    brushToCutWith.name = "brushToCutWith";
    // move segmentation brush to the loaded objects, according to their position
    brushToCutWith.position.set( centerOfObjects.x - 5, centerOfObjects.y, centerOfObjects.z );
    brushToCutWith.scale.setScalar( 1 );
    // create parameter entry
    stTool.brushToCutWith = {
      brush: brushToCutWith,
	    brushColor: 0x00FFFB,
      attached: false
    }
    // --> update brushesOfObjects
    segmentation.updateBrush( stTool.brushToCutWith.brush, main );
    // --> initialize brush materials
    stTool.brushToCutWith.brush.material.opacity = 0;
	  stTool.brushToCutWith.brush.material.transparent = true;
	  stTool.brushToCutWith.brush.material.depthWrite = false;
	  stTool.brushToCutWith.brush.material.polygonOffset = true;
	  stTool.brushToCutWith.brush.material.polygonOffsetFactor = 0.2;
	  stTool.brushToCutWith.brush.material.polygonOffsetUnits = 0.2;
	  stTool.brushToCutWith.brush.material.side = THREE.DoubleSide;
	  stTool.brushToCutWith.brush.material.premultipliedAlpha = true;
    stTool.brushToCutWith.brush.material.color.set( stTool.brushToCutWith.brushColor )
    stTool.brushToCutWith.brush.receiveShadow = true;
    stTool.brushToCutWith.brush.visible = false;
    // --> add brush to scene
    main.scene.add( stTool.brushToCutWith.brush );
    // --> create material map for transparent to opaque variants
    let mat;
	  mat = stTool.brushToCutWith.brush.material.clone();
	  mat.side = THREE.FrontSide;
	  mat.opacity = 1;
	  mat.transparent = false;
	  mat.depthWrite = true;
    mat.name = "segmentationBrush_mat"
	  stTool.materialMap.set( stTool.brushToCutWith.brush.material, mat );

    console.log(main.objects.allObjects)
    /**
     * Initialize brushesOfObjects
     */
    // --> Create a brush for every object in scene, so that every object can be
    // --> used
    const brushColor = [ 0x214CEC, 0x0ABA28, 0xF80909 ]
    main.objects.allObjects.forEach( (object, idx) => {
      const brush = new CSG.Brush( object.children[0].geometry.clone(), new CSG.GridMaterial() );
      brush.name = object.children[0].name;
      brush.position.set( object.children[0].position.x, object.children[0].position.y, object.children[0].position.z );
      brush.scale.setScalar( 1 );
      // stTool.brushesOfObjects.push( brush );
      stTool.brushesOfObjects.push( {
        brush: brush,
	      brushColor: brushColor[idx],
        resultBrush: null,
        originalMaterial: null
      } );
    })
    // --> update brushesOfObjects
    stTool.brushesOfObjects.forEach( brush => {
      segmentation.updateBrush( brush.brush, main );
    })
    // --> initialize brush materials
    stTool.brushesOfObjects.forEach( brush => {
      brush.brush.material.opacity = 0.05;
	    brush.brush.material.transparent = true;
	    brush.brush.material.depthWrite = false;
	    brush.brush.material.polygonOffset = true;
	    brush.brush.material.polygonOffsetFactor = 0.2;
	    brush.brush.material.polygonOffsetUnits = 0.2;
	    brush.brush.material.side = THREE.DoubleSide;
	    brush.brush.material.premultipliedAlpha = true;
      brush.brush.material.color.set( brush.brushColor )
      brush.brush.receiveShadow = true;
      brush.brush.visible = false;
    } );
    // --> add brushesOfObjects to scene
    stTool.brushesOfObjects.forEach( brush => {
      main.scene.add( brush.brush );
    } );
    // --> create material map for transparent to opaque variants
    stTool.brushesOfObjects.forEach( brush => {
      mat = brush.brush.material.clone();
      mat.side = THREE.FrontSide;
      mat.opacity = 1;
      mat.transparent = false;
      mat.depthWrite = true;
      mat.name = brush.brush.name
      stTool.materialMap.set( brush.brush.material, mat );
    } );
    stTool.materialMap.forEach( ( m0, m1, m2 ) => {

      m0.enableGrid = stTool.gridTexture;
      m1.enableGrid = stTool.gridTexture;
      m2.enableGrid = stTool.gridTexture;
  
    } );
    // add object displaying the result
    stTool.brushesOfObjects.forEach( brush => {
      brush.resultObject = new THREE.Mesh( new THREE.BufferGeometry(), 
      new THREE.MeshStandardMaterial( {
        flatShading: false,
        polygonOffset: true,
        polygonOffsetUnits: 0.1,
        polygonOffsetFactor: 0.1
      } ) );
      brush.resultObject.castShadow = true;
      brush.resultObject.receiveShadow = true;
      brush.originalMaterial = brush.resultObject.material;
      main.scene.add( brush.resultObject );
    } );

    // -------------------------------------------------------------------------
    
    // // --> Create a brush for every object in scene, so that every object can be
    // // --> used
    // const brushColor = [ 0x214CEC, 0x0ABA28, 0xF80909 ]
    // let x = 0;
    // while ( x < 3 ){
    //   const brush = new CSG.Brush( main.objects.allObjects[0].children[0].geometry.clone(), new CSG.GridMaterial() );
    //   brush.name = "brush" + x;
    //   brush.position.set( 0, x+1, 0 );
    //   brush.scale.setScalar( 1 );
    //   stTool.brushesOfObjects.push( {
    //     brush: brush,
	  //     brushColor: brushColor[x],
    //     resultBrush: null,
    //     originalMaterial: null
    //   } );
    //   x++;
    // }
    // // --> update brushesOfObjects
    // stTool.brushesOfObjects.forEach( brush => {
    //   segmentation.updateBrush( brush.brush, main );
    // } );
    // // initialize brush materials
    // stTool.brushesOfObjects.forEach( brush => {
    //   brush.brush.material.opacity = 0.05;
	  //   brush.brush.material.transparent = true;
	  //   brush.brush.material.depthWrite = false;
	  //   brush.brush.material.polygonOffset = true;
	  //   brush.brush.material.polygonOffsetFactor = 0.2;
	  //   brush.brush.material.polygonOffsetUnits = 0.2;
	  //   brush.brush.material.side = THREE.DoubleSide;
	  //   brush.brush.material.premultipliedAlpha = true;
    //   brush.brush.material.color.set( brush.brushColor )
    //   brush.brush.receiveShadow = true;
    // } );
    // // --> add brushesOfObjects to scene
    // stTool.brushesOfObjects.forEach( brush => {
    //   main.scene.add( brush.brush );
    // } );
    // // --> create material map for transparent to opaque variants
    // stTool.brushesOfObjects.forEach( brush => {
    //   mat = brush.brush.material.clone();
    //   mat.side = THREE.FrontSide;
    //   mat.opacity = 1;
    //   mat.transparent = false;
    //   mat.depthWrite = true;
    //   mat.name = brush.brush.name
    //   stTool.materialMap.set( brush.brush.material, mat );
    // } );
    // stTool.materialMap.forEach( ( m0, m1, m2 ) => {

    //   m0.enableGrid = stTool.gridTexture;
    //   m1.enableGrid = stTool.gridTexture;
    //   m2.enableGrid = stTool.gridTexture;
    //   // m3.enableGrid = stTool.gridTexture;
  
    // } );
    // // add object displaying the result
    // stTool.brushesOfObjects.forEach( brush => {
    //   brush.resultObject = new THREE.Mesh( new THREE.BufferGeometry(), 
    //   new THREE.MeshStandardMaterial( {
    //     flatShading: false,
    //     polygonOffset: true,
    //     polygonOffsetUnits: 0.1,
    //     polygonOffsetFactor: 0.1
    //   } ) );
    //   brush.resultObject.castShadow = true;
    //   brush.resultObject.receiveShadow = true;
    //   brush.originalMaterial = brush.resultObject.material;
    //   main.scene.add( brush.resultObject );
    // } );

    // -------------------------------------------------------------------------
    
	  // stTool.brush1 = new CSG.Brush( main.objects.allObjects[0].children[0].geometry.clone(), new CSG.GridMaterial() );
    // stTool.brush1.name = "brush1"
    // stTool.brush1.position.set( 0, -2, 0 );
    // stTool.brush1.scale.setScalar( 1 );
	  // stTool.brush3 = new CSG.Brush( main.objects.allObjects[0].children[0].geometry.clone(), new CSG.GridMaterial() );
    // stTool.brush3.name = "brush3"
    // stTool.brush3.position.set( 0, -3, 0 );
    // stTool.brush3.scale.setScalar( 1 );
	  // stTool.brush4 = new CSG.Brush( main.objects.allObjects[0].children[0].geometry.clone(), new CSG.GridMaterial() );
    // stTool.brush4.name = "brush4"
    // stTool.brush4.position.set( 0, -4, 0 );
    // stTool.brush4.scale.setScalar( 1 );
	  // stTool.brush2 = new CSG.Brush( new THREE.BoxGeometry(1, 30, 30), new CSG.GridMaterial() );
    // stTool.brush2.name = "brush2"
	  // stTool.brush2.position.set( 0, -2, 0 );
	  // stTool.brush2.scale.setScalar( 1 );

    // update brushesOfObjects
    // segmentation.updateBrush( stTool.brush1, stTool.brush1Shape, 
    //   stTool.brush1Complexity, main );
    // segmentation.updateBrush( stTool.brush2, stTool.brush2Shape, 
    //   stTool.brush2Complexity, main );
    // segmentation.updateBrush( stTool.brush3, stTool.brush3Shape, 
    //   stTool.brush3Complexity, main );

    // initialize materials
	  // stTool.brush1.material.opacity = 0.15;
	  // stTool.brush1.material.transparent = true;
	  // stTool.brush1.material.depthWrite = false;
	  // stTool.brush1.material.polygonOffset = true;
	  // stTool.brush1.material.polygonOffsetFactor = 0.2;
	  // stTool.brush1.material.polygonOffsetUnits = 0.2;
	  // stTool.brush1.material.side = THREE.DoubleSide;
	  // stTool.brush1.material.premultipliedAlpha = true;
    // stTool.brush1.material.color.set( 0x214CEC )
    // stTool.brush1.receiveShadow = true;
    
	  // stTool.brush3.material.opacity = 0.15;
	  // stTool.brush3.material.transparent = true;
	  // stTool.brush3.material.depthWrite = false;
	  // stTool.brush3.material.polygonOffset = true;
	  // stTool.brush3.material.polygonOffsetFactor = 0.2;
	  // stTool.brush3.material.polygonOffsetUnits = 0.2;
	  // stTool.brush3.material.side = THREE.DoubleSide;
	  // stTool.brush3.material.premultipliedAlpha = true;
    // stTool.brush3.material.color.set( 0x0ABA28 )
    // stTool.brush3.receiveShadow = true;
    
	  // stTool.brush4.material.opacity = 0.15;
	  // stTool.brush4.material.transparent = true;
	  // stTool.brush4.material.depthWrite = false;
	  // stTool.brush4.material.polygonOffset = true;
	  // stTool.brush4.material.polygonOffsetFactor = 0.2;
	  // stTool.brush4.material.polygonOffsetUnits = 0.2;
	  // stTool.brush4.material.side = THREE.DoubleSide;
	  // stTool.brush4.material.premultipliedAlpha = true;
    // stTool.brush4.material.color.set( 0xF80909 )
    // stTool.brush4.receiveShadow = true;
    
	  // stTool.brush2.material.opacity = 0;
	  // stTool.brush2.material.transparent = true;
	  // stTool.brush2.material.depthWrite = false;
	  // stTool.brush2.material.polygonOffset = true;
	  // stTool.brush2.material.polygonOffsetFactor = 0.2;
	  // stTool.brush2.material.polygonOffsetUnits = 0.2;
	  // stTool.brush2.material.side = THREE.DoubleSide;
	  // stTool.brush2.material.premultipliedAlpha = true;
	  // stTool.brush2.material.roughness = 0.25;
	  // stTool.brush2.material.color.set( 0x00FFFB );
	  // stTool.brush2.receiveShadow = true;

    // attach to transform controls
    // main.transformControls.attach( stTool.brush2 );
    
    // add to scene
    // main.scene.add( stTool.brush1 );
    // main.scene.add( stTool.brush2 );
    // main.scene.add( stTool.brush3 );
    // main.scene.add( stTool.brush4 );

    // create material map for transparent to opaque variants
	  // let mat;
	  // mat = stTool.brush2.material.clone();
	  // mat.side = THREE.FrontSide;
	  // mat.opacity = 1;
	  // mat.transparent = false;
	  // mat.depthWrite = true;
    // mat.name = "brush2_mat"
	  // stTool.materialMap.set( stTool.brush2.material, mat );
    
	  // mat = stTool.brush1.material.clone();
	  // mat.side = THREE.FrontSide;
	  // mat.opacity = 1;
	  // mat.transparent = false;
	  // mat.depthWrite = true;
    // mat.name = "brush1_mat"
	  // stTool.materialMap.set( stTool.brush1.material, mat );
    
	  // mat = stTool.brush3.material.clone();
	  // mat.side = THREE.FrontSide;
	  // mat.opacity = 1;
	  // mat.transparent = false;
	  // mat.depthWrite = true;
    // mat.name = "brush3_mat"
	  // stTool.materialMap.set( stTool.brush3.material, mat );
    
	  // mat = stTool.brush4.material.clone();
	  // mat.side = THREE.FrontSide;
	  // mat.opacity = 1;
	  // mat.transparent = false;
	  // mat.depthWrite = true;
    // mat.name = "brush4_mat"
	  // stTool.materialMap.set( stTool.brush4.material, mat );

    // stTool.materialMap.forEach( ( m0, m1, m2 ) => {

    //   m0.enableGrid = stTool.gridTexture;
    //   m1.enableGrid = stTool.gridTexture;
    //   m2.enableGrid = stTool.gridTexture;
    //   // m3.enableGrid = stTool.gridTexture;
  
    // } );

    // add object displaying the result
	  // stTool.resultObject = new THREE.Mesh( new THREE.BufferGeometry(), 
    //   new THREE.MeshStandardMaterial( {
		//     flatShading: false,
		//     polygonOffset: true,
		//     polygonOffsetUnits: 0.1,
		//     polygonOffsetFactor: 0.1
	  // } ) );
	  // stTool.resultObject.castShadow = true;
	  // stTool.resultObject.receiveShadow = true;
	  // stTool.originalMaterial = stTool.resultObject.material;
	  // // main.scene.add( stTool.resultObject );
    
    // // add object displaying the result
	  // stTool.resultObject2 = new THREE.Mesh( new THREE.BufferGeometry(), 
    //   new THREE.MeshStandardMaterial( {
		//     flatShading: false,
		//     polygonOffset: true,
		//     polygonOffsetUnits: 0.1,
		//     polygonOffsetFactor: 0.1
	  // } ) );
	  // stTool.resultObject2.castShadow = true;
	  // stTool.resultObject2.receiveShadow = true;
	  // // main.scene.add( stTool.resultObject2 );
    
    // // add object displaying the result
	  // stTool.resultObject3 = new THREE.Mesh( new THREE.BufferGeometry(), 
    //   new THREE.MeshStandardMaterial( {
		//     flatShading: false,
		//     polygonOffset: true,
		//     polygonOffsetUnits: 0.1,
		//     polygonOffsetFactor: 0.1
	  // } ) );
	  // stTool.resultObject3.castShadow = true;
	  // stTool.resultObject3.receiveShadow = true;
	  // // main.scene.add( stTool.resultObject3 );

    // helpers
    // stTool.edgesHelper = new CSG.EdgesHelper();
	  // stTool.edgesHelper.color.set( 0xE91E63 );
	  // main.scene.add( stTool.edgesHelper );
    
  }

  mainInit( params ) {
    /* All loaded meshes in main scene */
    params.objectsInMain = [];

    /* Renderer */
    params.renderer = new THREE.WebGLRenderer( {
      canvas: params.canvas,
      antialias: true
    } );
    params.renderer.setSize( params.canvas.clientWidth,
      params.canvas.clientHeight );
    params.renderer.setClearColor( params.sceneParams.bgColor, 1 );
    params.renderer.shadowMap.enabled = true;
    params.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    params.renderer.outputEncoding = THREE.SRGBColorSpace;
      
    // Scene
    params.scene = new THREE.Scene();
    params.scene.name = "SceneMain"

    // Camera
    params.camera = this.cameraSettings.createPerspectiveCamera( 
      params.canvas );
    params.camera.name = "CameraMain"

    // Light
    params.directionalLight = new THREE.DirectionalLight( params.sceneParams.directionalLightColor, 3.5 );
    params.directionalLight.position.set( - 1, -3, 0 );
    params.scene.add( params.directionalLight, params.directionalLight.target );

    params.ambientlight = new THREE.AmbientLight( params.sceneParams.ambientLightColor, 0.35 );
    params.scene.add( params.ambientlight );
    params.ambientlight.name = "ambientMain"

    // Controls
    params.arcBallControls = new ArcballControls( params.camera,
      params.renderer.domElement, params.scene );
    params.arcBallControls._maxDownTime = 0;
    params.arcBallControls._maxInterval = 0;
    params.arcBallControls.cursorZoom = true;
    params.arcBallControls.setGizmosVisible( false );

    params.transformControls = new TransformControls( params.camera,
      params.renderer.domElement );
    params.transformControls.addEventListener( 'dragging-changed', e => {
      params.arcBallControls.enabled = !e.value;
    } );
    params.transformControls.addEventListener( 'objectChange', () => {
      params.needsUpdate = true;
    } )

    params.scene.add( params.transformControls );

    // Raycaster outlines
    params.raycaster = new THREE.Raycaster();
    params.pointer = new THREE.Vector2();
    
    // Post processing
    params.composer = new EffectComposer( params.renderer );

    params.renderPass = new RenderPass( params.scene, params.camera );
    params.composer.addPass( params.renderPass );

    params.outlinePass = new OutlinePass( new THREE.Vector2(
      params.canvas.clientWidth, params.canvas.clientHeight ),
      params.scene, params.camera );
    params.outlinePass.hiddenEdgeColor.set( params.sceneParams.outline.color )
    params.outlinePass.pulsePeriod = params.sceneParams.outline.pulsePeriod;
    params.outlinePass.edgeStrength = params.sceneParams.outline.edgeStrength;
    params.outlinePass.edgeThickness = params.sceneParams.outline.edgeThickness;
    params.outlinePass.edgeGlow = params.sceneParams.outline.edgeGlow;
    params.composer.addPass( params.outlinePass );

    // Shader
    params.effectFXAA = new ShaderPass( FXAAShader );
    params.effectFXAA.uniforms[ 'resolution' ].value.set(
      1 / params.canvas.clientWidth, 1 / params.canvas.clientHeight );
    params.composer.addPass( params.effectFXAA );

    params.gammaCorrectionShader = new ShaderPass( GammaCorrectionShader );
    params.composer.addPass( params.gammaCorrectionShader )
  }

  subInit( params ) {
    /* mesh in sub scene */
    params.object = [];

    /* Renderer */
    params.renderer = new THREE.WebGLRenderer( { canvas: params.canvas } );
    params.renderer.setPixelRatio( params.canvas.devicePixelRatio );
    params.renderer.setSize( params.canvas.clientWidth,
      params.canvas.clientHeight );
    params.renderer.setClearColor( params.sceneParams.bgColor, 1 );
    params.renderer.shadowMap.enabled = true;
    params.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    /* Scene */
    params.scene = new THREE.Scene();
    params.scene.name = "SceneSub"

    /* Camera */
    const aspect = params.canvas.clientWidth / params.canvas.clientHeight;
    params.camera = new THREE.PerspectiveCamera( 50, aspect, 1, 1000 );

    /* Light */
    params.light = new THREE.AmbientLight( params.sceneParams.lightColor );
    params.scene.add( params.light );

    /* Controls */
    params.orbitControls = new OrbitControls( params.camera,
      params.renderer.domElement );
  }
}