/*
 * Created Date: 15.01.2024 17:22:44
 * Author: Tobias Mink
 * 
 * Last Modified: 28.03.2024 16:49:27
 * Modified By: Tobias Mink
 * 
 * Description: 
 */

/*

*/

export const exParams = {

  initTokens: {
    main: false,
    sub: false
  },

  main: {
    canvas: null,
    objects: {
      token: false,
      allObjects: [],
      place: {
        _ids: [],
        titles: [],
        groups: [],
        amount: 0,
        entry: [] // { _id: null, placeID: null, title: null, group: null }
      },
      position: {
        _ids: [],
        titles: [],
        groups: [],
        amount: 0,
        entry: [] // { _id: null, positionID: null, title: null, group: null,
                  //   position: null, bbox:null }
      },
    },
    renderer: null,
    scene: null,
    sceneParams: {
      bgColor: 0x263238,
      directionalLightColor: 0xffffff,
      ambientLightColor: 0xb0bec5,
      outline: {
        color: '#FFFFFF',
        pulsePeriod: 2,
        edgeStrength: 4,
        edgeThickness: 2,
        edgeGlow: 0.5
      }
    },
    camera: null,
    ambientLight: null,
    directionalLight: null,
    arcBallControls: null,
    transformControls: null,
    raycaster: null,
    pointer: null,
    composer: null,
    renderPass: null,
    outlinePass: null,
    effectFXAA: null,
    gammaCorrectionShader: null,
    ctrlDown: false,
    needsUpdate: false,


    annotationButtonPressed: false,
  },

  sub: {
    canvas: null,
    object: [],
    renderer: null,
    scene: null,
    sceneParams: {
      bgColor: 0x263238,
      lightColor: 0xffffff
    },
    camera: null,
    light: null,
    orbitControls: null,
  },

  mmTool: {
    lineID: null,
    line: null,
    measurementLable: null,
    drawingLine: false,
    intersectsMeasurement: null,
    raycaster: null,
    pointer: null,
    css2DRenderer: null,
  },
  
  anTool: {
    annotations: [],
  },

  stTool: {
    materialMap: null,
    csgEvaluator: null,

    brushToCutWith: null,
    brushesOfObjects: [],
    
    // brush1: null,
    // brush1Shape: 'mesh',
	  // brush1Complexity: 1,
	  // brush1Color: '#ffffff',
    
    // brush2: null,
	  // brush2Shape: 'box',
	  // brush2Complexity: 1,
	  // brush2Color: '#ffffff',
    
    // brush3: null,
	  // brush3Shape: 'mesh',
	  // brush3Complexity: 1,
	  // brush3Color: '#ffffff',
    
    // brush4: null,
	  // brush4Shape: 'mesh',
	  // brush4Complexity: 1,
	  // brush4Color: '#ffffff',

    resultObject: null,
    resultObject2: null,
    resultObject3: null,
    originalMaterial: null,
    edgesHelper: null,
    gridTexture: false
  },
  
  placeID: null,
  cameraIDsInDB: null,
  cameraInDB: null,
  linesInDB: null,
  placeInDB:null,

  utilities: null,
  controlSettings: null,
  cameraSettings: null,
  objectFilter: null,
  garbageCollection: null,
  modelInteraktion: null,
  lineTool: null,
  initialisations: null,

  selectedObjects: [],
}