/*
 * Created Date: 15.01.2024 17:22:44
 * Author: Tobias Mink
 * 
 * Last Modified: 25.01.2024 15:14:28
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
      lightColor: 0xffffff,
      outline: {
        color: '#FFFFFF',
        pulsePeriod: 2,
        edgeStrength: 4,
        edgeThickness: 2,
        edgeGlow: 0.5
      }
    },
    camera: null,
    light: null,
    arcBallControls: null,
    transformControls: null,
    raycaster: null,
    pointer: null,
    composer: null,
    renderPass: null,
    outlinePass: null,
    effectFXAA: null,
    gammaCorrectionShader: null,
    ctrlDown: false
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