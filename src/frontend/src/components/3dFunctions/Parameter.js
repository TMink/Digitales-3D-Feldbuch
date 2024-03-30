/*
 * Created Date: 15.01.2024 17:22:44
 * Author: Tobias Mink
 * 
 * Last Modified: 30.03.2024 06:18:14
 * Modified By: Tobias Mink
 * 
 * Description: 
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
    rendererParams: {
      backgroundColor: 0x263238,
      backgroundColorIntensity: 1,
      antialias: true,
      shadowMapEnabled: true
    },
    scene: null,
    sceneParams: {
      instance: null,
      name: "SceneMain",
    },
    camera: null,
    cameraParams: {
      name: "CameraMain",
      attributes: {
        fov: 45,
        near: 0.01,
        far: 2000
      }
    },
    ambientLight: null,
    directionalLight: null,
    lightParams: {
      ambient: {
        name: "ambientMain",
        color: 0xb0bec5,
        intensity: 0.35
      },
      directional: {
        name: "directionalMain",
        color: 0xffffff,
        intensity: 3.5,
        position: { x: -1, y: -3, z: 0 }
      }
    },
    arcBallControls: null,
    transformControls: null,
    controlsParams: {
      arcball: {
        maxDownTime: 0,
        maxInterval: 0,
        cursorZoom: true,
        gizmosVisible: false
      }
    },
    raycaster: null,
    pointer: null,
    composer: null,
    renderPass: null,
    outlinePass: null,
    effectFXAA: null,
    gammaCorrectionShader: null,
    postProcessingParams: {
      outlinePass: {
        color: "#FFFFFF",
        pulsePeriod: 2,
        edgeStrength: 4,
        edgeThickness: 2,
        edgeGlow: 0.5
      }
    },
    ctrlDown: false,
    needsUpdate: false,
    annotationButtonPressed: false,
  },

  sub: {
    canvas: null,
    object: [],
    renderer: null,
    rendererParams: {
      backgroundColor: 0x263238,
      backgroundColorIntensity: 1,
      shadowMapEnabled: true
    },
    scene: null,
    sceneParams: {
      name: "SceneSub"
    },
    camera: null,
    cameraParams: {
      fov: 50,
      near: 1,
      far: 1000
    },
    light: null,
    lightParams: {
      ambient: {
        color: 0xffffff
      }
    },
    orbitControls: null,
  },

  mmTool: {
    lineID: null,
    line: null,
    lineParams: {
      color: 0x0000ff,
      frustrumCulled: false,
    },
    measurementLable: null,
    measurementLableParams: {
      element: "div",
      className: "lable",
      marginTop: "-1em"
    },
    ballParams: {
      size: { x:0.03, y:6, z:4},
      color: 0xffff00
    },
    alertParams: {
      noName: "Please enter a name first",
      dupName: "Name already taken"
    },
    drawingLine: false,
    intersectsMeasurement: null,
    raycaster: null,
    pointer: null,
    css2DRenderer: null,
    css2DRendererParams: {
      position: "absolute",
        top: "35px",
        color: "white",
        pointerEvents: "none"
    }
  },
  
  anTool: {
    annotations: [],
    lableParams: {
      element: "div",
      className: "lable",
      marginTop: "-1em"
    },
    boxParams: {
      size: { x: 0.01, y: 0.01, z: 0.01 },
      color: 0xffff00
    }
  },

  stTool: {
    materialMap: null,
    csgEvaluator: null,
    brushToCutWith: null,
    brushToCutWithParams: {
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
          premultipliedAlpha: true,
          receiveShadow: true,
          visible: false
        },
        mat: {
          opacity: 1,
          transparent: false,
          depthWrite: true,
          name: "segmentationBrush_mat"
        }
    },
    brushesOfObjects: [],
    brushesOfObjectsParams: {
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
        premultipliedAlpha: true,
        receiveShadow: true,
        visible: false
      },
      mat: {
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
    },
    gridTexture: false,
  },
}