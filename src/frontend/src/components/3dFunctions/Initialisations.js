/*
 * Created Date: 23.01.2024 13:09:11
 * Author: Tobias Mink
 * 
 * Last Modified: 28.03.2024 16:59:03
 * Modified By: Tobias Mink
 * 
 * Description: A Collection of initialisation functions, which will be called
 *              in the mounted function in 3DView.js. This includes the creation
 *              of the main/sub scene and various tools.
 */

import * as THREE from 'three';
import { CameraSettings } from './CameraSettings.js';
import { SegmentationTool } from './Tools.js';
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
import * as CSG from 'three-bvh-csg';

export class Initialisations {

  constructor() {
    this.cameraSettings = new CameraSettings();
    this.segmentationTool = new SegmentationTool();

    this.measurement = {
      css2DRenderer: {
        position: "absolute",
        top: "35px",
        color: "white",
        pointerEvents: "none"
      }      
    }

    this.segmentation = {
      css2DRenderer: {
        position: "absolute",
        top: "35px",
        color: "white",
        pointerEvents: 'none'
      },
      brushCut: {
        name: "brushToCutWith",
        positionOffset: 5,
        color: 0x00FFFB,
        attached: false,
        material: {
          opacity: 0,
          transparent: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: 0.2,
          polygonOffsetUnits: 0.2,
          side: THREE.DoubleSide,
          premultipliedAlpha: true,
          receiveShadow: true,
          visible: false
        },
        mat: {
          side: THREE.FrontSide,
          opacity: 1,
          transparent: false,
          depthWrite: true,
          name: "segmentationBrush_mat"
        }
      },
      brushObject: {
        colors: [ 0x214CEC, 0x0ABA28, 0xF80909 ],
        resultBrush: null,
        originalMaterial: null,
        material: {
          opacity: 0.05,
          transparent: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: 0.2,
          polygonOffsetUnits: 0.2,
          side: THREE.DoubleSide,
          premultipliedAlpha: true,
          receiveShadow: true,
          visible: false
        },
        mat: {
          side: THREE.FrontSide,
          opacity: 1,
          transparent: false,
          depthWrite: true
        },
        resultObject: {
          flatShading: false,
          polygonOffset: true,
          polygonOffsetUnits: 0.1,
          polygonOffsetFactor: 0.1,
          castShadow: true,
          receiveShadow: true
        }
      }
    }

    this.main = {
      renderer: {
        backgroundColor: 0x263238,
        backgroundColorIntensity: 1,
        antialias: true,
        shadowMapEnabled: true,
        shadowMapType: THREE.PCFSoftShadowMap,
        outputEncoding: THREE.SRGBColorSpace
      },
      scene: {
        name: "SceneMain"
      },
      camera: {
        attributes: {
          fov: 45,
          near: 0.01,
          far: 2000
        },
        name: "CameraMain"
      },
      light: {
        ambientLight: {
          color: 0xb0bec5,
          intensity: 0.35,
          name: "ambientMain"
        },
        directionalLight: {
          color: 0xffffff,
          intensity: 3.5,
          position: { x: -1, y: -3, z: 0 },
          name: "directionalMain"
        }
      },
      controls: {
        arcball: {
          maxDownTime: 0,
          maxInterval: 0,
          cursorZoom: true,
          gizmosVisible: false
        }
      },
      postProcessing: {
        outlinePass: {
          color: "#FFFFFF",
          pulsePeriod: 2,
          edgeStrength: 4,
          edgeThickness: 2,
          edgeGlow: 0.5
        }
      }
    }

    this.sub = {
      renderer: {
        backgroundColor: 0x263238,
        backgroundColorIntensity: 1,
        shadowMapEnabled: true,
        shadowMapType: THREE.PCFSoftShadowMap
      },
      scene: {
        name: "SceneSub"
      },
      camera: {
        attributes: { 
          fov: 50,
          near: 1,
          far: 1000
        }
      },
      light: {
        ambientLight: {
          color: 0xffffff
        }
      }
    }
  }

  /**
   * Initialize the measurement tool.
   * @param { object } document 
   * @param { object } canvas 
   * @param { object } params 
   */
  initMeasurementTool( document, canvas, params ) {
    /* Create CSS2D-Renderer and adjust its attributes */
    params.css2DRenderer = new CSS2DRenderer()
    params.css2DRenderer.setSize( canvas.clientWidth,
      canvas.clientHeight );
    params.css2DRenderer.domElement.style.position = 
      this.measurement.css2DRenderer.position
    params.css2DRenderer.domElement.style.top = 
      this.measurement.css2DRenderer.top
    params.css2DRenderer.domElement.style.color = 
      this.measurement.css2DRenderer.color
    params.css2DRenderer.domElement.style.pointerEvents = 
      this.measurement.css2DRenderer.pointerEvents
    /* Append the CSS2D-Renderer to document */
    document.body.appendChild( params.css2DRenderer.domElement)

    // Create new Raycaster
    params.raycaster = new THREE.Raycaster();
    params.pointer = new THREE.Vector2();

    params.lineID = String(Date.now());
  }

  /**
   * Initialize the segmentation tool
   * @param { object } main 
   * @param { object } stTool 
   * @param { object } centerOfObjects 
   */
  initSegmentationTool( main, stTool, centerOfObjects ) {
    /* Create new map to override attributes of new brushes */
    stTool.materialMap = new Map();

    /* Create evaluator for csg purposes. It will produce the final result of 
     * the operation. */
    stTool.csgEvaluator = new CSG.Evaluator();
    stTool.csgEvaluator.attributes = [ 'position', 'normal' ];

    /* Create a brush to cut with.
     * This brush can be moved and will be used to cut the objects. */
    const brushToCutWith = new CSG.Brush( new THREE.BoxGeometry(5, 10, 10), 
      new CSG.GridMaterial() );
    brushToCutWith.name = this.segmentation.brushCut.name;
    /* Move segmentation brush to the loaded objects, according to their 
     * position */
    brushToCutWith.position.set( 
      centerOfObjects.x - this.segmentation.brushCut.positionOffset, 
      centerOfObjects.y, centerOfObjects.z );
    /* Create parameter entry */
    stTool.brushToCutWith = {
      brush: brushToCutWith,
	    brushColor: this.segmentation.brushCut.color,
      attached: this.segmentation.brushCut.attached
    }
    /* Update brushesOfObjects */
    this.segmentationTool.updateBrush( brushToCutWith, main );
    /* Initialize brush materials */
    stTool.brushToCutWith.brush.material.opacity = 
      this.segmentation.brushCut.material.opacity;
	  stTool.brushToCutWith.brush.material.transparent = 
      this.segmentation.brushCut.material.transparent;
	  stTool.brushToCutWith.brush.material.depthWrite = 
    this.segmentation.brushCut.material.depthWrite;
	  stTool.brushToCutWith.brush.material.polygonOffset = 
      this.segmentation.brushCut.material.polygonOffset;
	  stTool.brushToCutWith.brush.material.polygonOffsetFactor = 
      this.segmentation.brushCut.material.polygonOffsetFactor;
	  stTool.brushToCutWith.brush.material.polygonOffsetUnits = 
      this.segmentation.brushCut.material.polygonOffsetUnits;
	  stTool.brushToCutWith.brush.material.side = 
      this.segmentation.brushCut.material.side;
	  stTool.brushToCutWith.brush.material.premultipliedAlpha = 
      this.segmentation.brushCut.material.premultipliedAlpha;
    stTool.brushToCutWith.brush.material.color.set( 
      stTool.brushToCutWith.brushColor )
    stTool.brushToCutWith.brush.receiveShadow = 
      this.segmentation.brushCut.material.receiveShadow;
    stTool.brushToCutWith.brush.visible = 
      this.segmentation.brushCut.material.visible;
    /* Add brush to scene */
    main.scene.add( stTool.brushToCutWith.brush );
    /* Create material map for transparent to opaque variants */
    let mat;
	  mat = stTool.brushToCutWith.brush.material.clone();
	  mat.side = this.segmentation.brushCut.mat.side;
	  mat.opacity = this.segmentation.brushCut.mat.opacity;
	  mat.transparent = this.segmentation.brushCut.mat.transparent;
	  mat.depthWrite = this.segmentation.brushCut.mat.depthWrite;
    mat.name = this.segmentation.brushCut.mat.name
	  stTool.materialMap.set( stTool.brushToCutWith.brush.material, mat );
    
    /* ## Initialize brushesOfObjects ## */
    /* Create a brush for every object in scene, so that every object can be 
     * used. */
    main.objects.allObjects.forEach( (object, idx) => {
      const brush = new CSG.Brush( object.children[0].geometry.clone(), 
        new CSG.GridMaterial() );
      brush.name = object.children[0].name;
      brush.position.set( object.children[0].position.x, 
        object.children[0].position.y, object.children[0].position.z );
      brush.scale.setScalar( 1 );
      stTool.brushesOfObjects.push( {
        brush: brush,
	      brushColor: this.segmentation.brushObject.colors[idx],
        resultBrush: this.segmentation.brushObject.resultBrush,
        originalMaterial: this.segmentation.brushObject.originalMaterial
      } );
    })
    /* Update brushesOfObjects */
    stTool.brushesOfObjects.forEach( brush => {
      this.segmentationTool.updateBrush( brush.brush, main );
    })
    /* Initialize brush materials */
    stTool.brushesOfObjects.forEach( brush => {
      brush.brush.material.opacity = 
        this.segmentation.brushObject.material.opacity;
	    brush.brush.material.transparent = 
        this.segmentation.brushObject.material.transparent;
	    brush.brush.material.depthWrite = 
        this.segmentation.brushObject.material.depthWrite;
	    brush.brush.material.polygonOffset = 
        this.segmentation.brushObject.material.polygonOffset;
	    brush.brush.material.polygonOffsetFactor = 
        this.segmentation.brushObject.material.polygonOffsetFactor;
	    brush.brush.material.polygonOffsetUnits = 
        this.segmentation.brushObject.material.polygonOffsetUnits;
	    brush.brush.material.side = 
        this.segmentation.brushObject.material.side;
	    brush.brush.material.premultipliedAlpha = 
        this.segmentation.brushObject.material.premultipliedAlpha;
      brush.brush.material.color.set( brush.brushColor )
      brush.brush.receiveShadow = 
        this.segmentation.brushObject.material.receiveShadow;
      brush.brush.visible = 
        this.segmentation.brushObject.material.visible;
    } );
    /* Add brushesOfObjects to scene */
    stTool.brushesOfObjects.forEach( brush => {
      main.scene.add( brush.brush );
    } );
    /* Create material map for transparent to opaque variants */
    stTool.brushesOfObjects.forEach( brush => {
      mat = brush.brush.material.clone();
      mat.side = this.segmentation.brushObject.mat.side
      mat.opacity = this.segmentation.brushObject.mat.opacity;
      mat.transparent = this.segmentation.brushObject.mat.transparent;
      mat.depthWrite = this.segmentation.brushObject.mat.depthWrite;
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
      brush.resultObject = new THREE.Mesh( new THREE.BufferGeometry(), 
      new THREE.MeshStandardMaterial( {
        flatShading: this.segmentation.brushObject.resultObject.flatShading,
        polygonOffset: 
          this.segmentation.brushObject.resultObject.polygonOffset,
        polygonOffsetUnits: 
          this.segmentation.brushObject.resultObject.polygonOffsetUnits,
        polygonOffsetFactor: 
          this.segmentation.brushObject.resultObject.polygonOffsetFactor
      } ) );
      brush.resultObject.castShadow = 
        this.segmentation.brushObject.resultObject.castShadow;
      brush.resultObject.receiveShadow = 
        this.segmentation.brushObject.resultObject.receiveShadow;
      brush.originalMaterial = brush.resultObject.material;
      main.scene.add( brush.resultObject );
    } );
  }

  /**
   * Initializes the main scene and its attributes
   * @param { object } params 
   */
  mainInit( params ) {
    /* All loaded meshes in main scene */
    params.objectsInMain = [];

    /* Create renderer */
    params.renderer = new THREE.WebGLRenderer( {
      canvas: params.canvas,
      antialias: this.main.renderer.antialias
    } );
    params.renderer.setSize( params.canvas.clientWidth,
      params.canvas.clientHeight );
    params.renderer.setClearColor( this.main.renderer.backgroundColor, 
      this.main.renderer.backgroundColorIntensity );
    params.renderer.shadowMap.enabled = 
      this.main.renderer.shadowMapEnabled;
    params.renderer.shadowMap.type = this.main.renderer.shadowMapType;
    params.renderer.outputEncoding = this.main.renderer.outputEncoding;
      
    /* Create scene */
    params.scene = new THREE.Scene();
    params.scene.name = this.main.scene.name

    /* Create camera */
    const aspect = params.canvas.clientWidth / params.canvas.clientHeight;
    params.camera = new THREE.PerspectiveCamera( 
      this.main.camera.attributes.fov, aspect, this.main.camera.attributes.near, 
      this.main.camera.attributes.far );
    params.camera.name = this.main.camera.name

    /* Create light */
    params.directionalLight = new THREE.DirectionalLight( 
      this.main.light.directionalLight.color,
      this.main.light.directionalLight.intensity );
    params.directionalLight.position.set( 
      this.main.light.directionalLight.position.x,
      this.main.light.directionalLight.position.y,
      this.main.light.directionalLight.position.z );
    params.scene.add( params.directionalLight, params.directionalLight.target );
    params.directionalLight.name = this.main.light.directionalLight.name;

    params.ambientlight = new THREE.AmbientLight( 
      this.main.light.ambientLight.color, 
      this.main.light.ambientLight.intensity );
    params.scene.add( params.ambientlight );
    params.ambientlight.name = this.main.light.ambientLight.name;

    /* Create controls */
    params.arcBallControls = new ArcballControls( params.camera,
      params.renderer.domElement, params.scene );
    params.arcBallControls._maxDownTime = 
      this.main.controls.arcball.maxDownTime;
    params.arcBallControls._maxInterval = 
      this.main.controls.arcball.maxInterval;
    params.arcBallControls.cursorZoom = this.main.controls.arcball.cursorZoom;
    params.arcBallControls.setGizmosVisible( 
      this.main.controls.arcball.gizmosVisible );

    params.transformControls = new TransformControls( params.camera,
      params.renderer.domElement );
    params.transformControls.addEventListener( 'dragging-changed', e => {
      params.arcBallControls.enabled = !e.value;
    } );
    params.transformControls.addEventListener( 'objectChange', () => {
      params.needsUpdate = true;
    } )
    params.scene.add( params.transformControls );

    /* Create raycaster */
    params.raycaster = new THREE.Raycaster();
    params.pointer = new THREE.Vector2();
    
    /* Post processing */
    params.composer = new EffectComposer( params.renderer );

    params.renderPass = new RenderPass( params.scene, params.camera );
    params.composer.addPass( params.renderPass );

    params.outlinePass = new OutlinePass( new THREE.Vector2(
      params.canvas.clientWidth, params.canvas.clientHeight ),
      params.scene, params.camera );
    params.outlinePass.hiddenEdgeColor.set( 
      this.main.postProcessing.outlinePass.color )
    params.outlinePass.pulsePeriod = 
      this.main.postProcessing.outlinePass.pulsePeriod;
    params.outlinePass.edgeStrength = 
      this.main.postProcessing.outlinePass.edgeStrength;
    params.outlinePass.edgeThickness = 
      this.main.postProcessing.outlinePass.edgeThickness;
    params.outlinePass.edgeGlow = 
      this.main.postProcessing.outlinePass.edgeGlow;
    params.composer.addPass( params.outlinePass );

    // Shader
    params.effectFXAA = new ShaderPass( FXAAShader );
    params.effectFXAA.uniforms[ 'resolution' ].value.set(
      1 / params.canvas.clientWidth, 1 / params.canvas.clientHeight );
    params.composer.addPass( params.effectFXAA );

    params.gammaCorrectionShader = new ShaderPass( GammaCorrectionShader );
    params.composer.addPass( params.gammaCorrectionShader )
  }

  /**
   * Initializes the sub scene and its attributes
   * @param { object } params 
   */
  subInit( params ) {
    /* Mesh in sub scene */
    params.object = [];

    /* Create Renderer */
    params.renderer = new THREE.WebGLRenderer( { canvas: params.canvas } );
    params.renderer.setPixelRatio( params.canvas.devicePixelRatio );
    params.renderer.setSize( params.canvas.clientWidth,
      params.canvas.clientHeight );
    params.renderer.setClearColor( this.sub.renderer.backgroundColor,
      this.sub.renderer.backgroundColorIntensity );
    params.renderer.shadowMap.enabled = this.sub.renderer.shadowMapEnabled;
    params.renderer.shadowMap.type = this.sub.renderer.shadowMapType;

    /* Create Scene */
    params.scene = new THREE.Scene();
    params.scene.name = this.sub.scene.name;

    /* Create Camera */
    const aspect = params.canvas.clientWidth / params.canvas.clientHeight;
    params.camera = new THREE.PerspectiveCamera( this.sub.camera.fov, aspect, 
      this.sub.camera.near, this.sub.camera.far );

    /* Create Light */
    params.light = new THREE.AmbientLight( this.sub.light.ambientLight.color );
    params.scene.add( params.light );

    /* Create Controls */
    params.orbitControls = new OrbitControls( params.camera,
      params.renderer.domElement );
  }
}