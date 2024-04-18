/*
 * Created Date: 15.01.2024 17:22:44
 * Author: Tobias Mink
 * 
 * Last Modified: 17.04.2024 16:09:25
 * Modified By: Tobias Mink
 * 
 * Description: 
 */

export const exParams = {

  origionalState: null,

  initTokens: {
    main: false,
    sub: false
  },

  envs: {
    threeDPart_withoutObjects: {
      canvas: null,
      objects: {
        defaultObjects: [
          {
            data: null,
            path: '../assets/3d_part/no_objects_default_3.glb',
            methods: {
              "position.set": { x: 0, y: 0, z: 0 }
            },
            properties: {
              "name": "noObjectsSign",
              "rotation.z": Math.PI / 1
            },
            addToScene: true
          } 
        ]
      },
      components: {
        attributes: {
          list: {
            externalShader: ["PerlinNoise"],
            controlsTargetVector: null,
            shaderResolutionVector: null,
            uniforms: {
              u_resolution: {
                type: 'v2',
                get value() {
                  return exParams.envs.threeDPart_withoutObjects.components.attributes.list.shaderResolutionVector;
                }
              },
              u_time: {
                type: 'f',
                value: 0.0
              }
            }
          },
          update: [
            {
              id: "controlsTargetVector",
              type: "Vector3",
              params: { x: 0, y: 1.5, z: 0 },
            },
            {
              id: "shaderResolutionVector",
              type: "Vector2",
              params: {
                get width() {
                  return exParams.envs.threeDPart_withoutObjects.window.innerWidth;
                },
                get height() {
                  return exParams.envs.threeDPart_withoutObjects.window.innerHeight;
                }
              },
            }
          ]
        },
        renderer: [
          {
            data: null,
            type: "WebGLRenderer",
            params: {
              get canvas() {
                return exParams.envs.threeDPart_withoutObjects.canvas
              },
              antialias: true
            },
            methods: {
              "setSize": {
                get width() {
                  return exParams.envs.threeDPart_withoutObjects.canvas.clientWidth
                },
                get height() {
                  return exParams.envs.threeDPart_withoutObjects.canvas.clientHeight
                }
              },
              "setClearColor": {
                backgroundColor: 0x263238,
                backgroundColorIntensity: 1
              }
            },
            properties: {
              "shadowMap.enabled": true,
              "shadowMap.type": "PCFSoftShadowMap",
              "outputColorSpace": "LinearSRGBColorSpace"
            }
          }
        ],
        scene: [
          {
            data: null,
            type: "Scene",
            params: {},
            methods: {},
            properties: {
              "name": "sceneDefault"
            }
          }
        ],
        camera: [
          {
            data: null,
            type: "PerspectiveCamera",
            params: {
              fov: 25,
              get aspect() {
                return exParams.envs.threeDPart_withoutObjects.canvas.clientWidth / exParams.envs.threeDPart_withoutObjects.canvas.clientHeight;
              },
              near: 0.01,
              far: 1000
            },
            methods: {
              "position.set": { x: 0, y: 1.5, z: -17 }
            },
            properties: {
              "name": "CameraDefault"
            }
          }
        ],
        light: [
          {
            data: null,
            type: "HemisphereLight",
            params: {
              skyColor: 0xffffff,
              groundColor: 0x000000,
              intensity: 1
            },
            methods: {
              "position.set": { x: 0, y: 6, z: 0 }
            },
            properties: {
              "name": "ambientLightMain",
            },
            addToScene: true
          },
          {
            data: null,
            type: "DirectionalLight",
            params: {
              color: 0xffffff,
              intensity: 1,
            },
            methods: {
              "position.set": { x: 0, y: 5, z: -2 }
            },
            properties: {
              "name": "directionalLightMain",
              "castShadow": true,
              "shadow.mapSize.width": 1024,
              "shadow.mapSize.height": 1024,
              "shadow.camera.far": 24,
              "shadow.radius": 5,
              "shadow.bias": -0.00006
            },
            addToScene: true
          }
        ],
        controls: [
          {
            data: null,
            type: "OrbitControls",
            params: {
              get object() {
                return exParams.envs.threeDPart_withoutObjects.components.camera[0].data;
              },
              get domElement() {
                return exParams.envs.threeDPart_withoutObjects.components.renderer[0].data.domElement;
              }
            },
            methods: {},
            properties: {
              get target() {
                return exParams.envs.threeDPart_withoutObjects.components.attributes.list.controlsTargetVector;
              },
              "enableDamping": true,
              "maxPolarAngle": Math.PI/2,
              "minDistance": 2,
              "maxDistance": 30,
              "enablePan": false,
              "ebableRotate": false,
              "enabled": false,
            },
            addToScene: false
          }
        ],
        shader: [],
        externalShader: {},
        defaultObjects: {
          geometries: {
            list: {
              groundGeometry: null,
              groundMaterial: null,
              icosahedronGeometry: null,
              icosahedronMaterial: null
            },
            initData: [
              {
                id: "groundGeometry",
                type: "PlaneGeometry",
                params: {
                  width: 200,
                  height: 200
                }
              },
              {
                id: "groundMaterial",
                type: "MeshStandardMaterial",
                params: {
                  color: 0x151d21
                }
              },
              {
                id: "icosahedronGeometry",
                type: "IcosahedronGeometry",
                params: {
                  radius: 4,
                  detail: 30
                }
              },
              {
                id: "icosahedronMaterial",
                type: "ShaderMaterial",
                params: {
                  get uniforms() {
                    return exParams.envs.threeDPart_withoutObjects.components.attributes.list.uniforms;
                  },
                  get vertexShader() {
                    return exParams.envs.threeDPart_withoutObjects.components.externalShader["PerlinNoise"].data.vertexShader;
                  },
                  get fragmentShader() {
                    return exParams.envs.threeDPart_withoutObjects.components.externalShader["PerlinNoise"].data.fragmentShader;
                  }
                }
              }
            ]
          },
          meshes: {
            ground: {
              data: null,
              type: "Mesh",
              params: {
                get groundGeometry() {
                  return exParams.envs.threeDPart_withoutObjects.components.defaultObjects.geometries.list.groundGeometry;
                },
                get groundMaterial() {
                  return exParams.envs.threeDPart_withoutObjects.components.defaultObjects.geometries.list.groundMaterial;
                }
              },
              methods: {
                "rotateY": -Math.PI,
                "position.set": { x: 0, y: 0, z: 3 }
              },
              properties: {},
              addToScene: true
            },
            icosahedron: {
              data: null,
              type: "Mesh",
              params: {
                get icosahedronGeometry() {
                  return exParams.envs.threeDPart_withoutObjects.components.defaultObjects.geometries.list.icosahedronGeometry;
                },
                get icosahedronMaterial() {
                  return exParams.envs.threeDPart_withoutObjects.components.defaultObjects.geometries.list.icosahedronMaterial;
                }
              },
              methods: {
                "position.set": {x: 0, y: 3, z: 0},
                "scale.set": {x: 0.3, y: 0.3, z: 0.3}
              },
              properties: {
                "name": "ICO",
                "material.wireframe": true,
                "castShadow": true
              },
              addToScene: true
            }
          }
        }
      },
      reset: null
    },
    threeDPart_withAllObjects: {
      canvas: null,
      window: null,
      activityID: null,
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
      components: {
        attributes: {
          list: {
            externalShader: [],
            outlinePassVector: null,
            raycastPointer: null,
            ctrlDown: false,
            needsUpdate: false,
            annotationButtonPressed: false,
          },
          update: [
            {
              id: "outlinePassVector",
              type: "Vector2",
              params: {
                get width() {
                  return exParams.envs.threeDPart_withAllObjects.window.innerWidth;
                },
                get height() {
                  return exParams.envs.threeDPart_withAllObjects.window.innerHeight;
                }
              },
              methods: {},
              properties: {}
            },
            {
              id: "raycastPointer",
              type: "Vector2",
              params: {},
              methods: {},
              properties: {}
            }
          ]
        },
        renderer: [
          {
            data: null,
            type: "WebGLRenderer",
            params: {
              get canvas() { return exParams.envs.threeDPart_withAllObjects.canvas },
              antialias: true
            },
            methods: {
              "setSize": {
                get width() {
                  return exParams.envs.threeDPart_withAllObjects.canvas.clientWidth;
                },
                get height() {
                  return exParams.envs.threeDPart_withAllObjects.canvas.clientHeight;
                }
              },
              "setClearColor": {
                backgroundColor: 0x263238,
                backgroundColorIntensity: 1
              },
            },
            properties: {
              "shadowMap.enabled": true,
              "shadowMap.type": "PCFSoftShadowMap",
              "outputColorSpace": "LinearSRGBColorSpace"
            }
          }
        ],
        scene: [
          {
            data: null,
            type: "Scene",
            methods: {},
            properties: {
              "name": "SceneMain"
            }
          }
        ],
        camera: [
          {
            data: null,
            type: "PerspectiveCamera",
            params: {
              fov: 45,
              get aspect() {
                return exParams.envs.threeDPart_withAllObjects.canvas.clientWidth / exParams.envs.threeDPart_withAllObjects.canvas.clientHeight;
              },
              near: 0.01,
              far: 2000
            },
            methods: {},
            properties: {
              "name": "CameraMain"
            },
            addToScene: true
          }
        ],
        light: [
          {
            data: null,
            type: "AmbientLight",
            params: {
              color: 0xb0bec5,
              intensity: 1
            },
            methods: {},
            properties: {
              "name": "ambientMain",
            },
            addToScene: true
          },
          {
            data: null,
            type: "DirectionalLight",
            params: {
              color: 0xffffff,
              intensity: 3.5,
            },
            methods: {
              "position.set": { x: -1, y: -3, z: 0 }
            },
            properties: {
              "name": "directionalMain",
            },
            addToScene: true
          }
        ],
        controls: [
          {
            data: null,
            type: "ArcballControls",
            params: {
              get camera() {
                return exParams.envs.threeDPart_withAllObjects.components.camera[0].data;
              },
              get domElement() {
                return exParams.envs.threeDPart_withAllObjects.components.renderer[0].data.domElement;
              },
              get scene() {
                return exParams.envs.threeDPart_withAllObjects.components.scene[0].data;
              }
            },
            methods: {
              "setGizmosVisible": { value: false },
            },
            properties: {
              "maxDownTime": 0,
              "maxInterval": 0,
              "cursorZoom": true,
            },
            addToScene: false
          },
          {
            data: null,
            type: "TransformControls",
            params: {
              get object() {
                return exParams.envs.threeDPart_withAllObjects.components.camera[0].data;
              },
              get domElement() {
                return exParams.envs.threeDPart_withAllObjects.components.renderer[0].data.domElement;
              }
            },
            methods: {
              "addEventListener": {
                "dragging-changed": e => {
                  // Which controls should be swapped with?
                  const arcBallControls = { 
                    set enabled(e) {
                      return exParams.envs.threeDPart_withAllObjects.components.controls[0].data.enabled = !e.value
                    }
                  }
                  arcBallControls.enabled = e;
                },
                "objectChange": () => {
                  const components = { 
                    get attributes() { 
                      return exParams.envs.threeDPart_withAllObjects.components
                    } 
                  }
                  components.attributes.needsUpdate = true; 
                }
              }
            },
            properties: {},
            addToScene: true
          }
        ],
        raycaster: [
          {
            data: null,
            type: "Raycaster",
            params: {},
            methods: {},
            properties: {},
            addToScene: true
          }
        ],
        postProcessing: [
          {
            data: null,
            type: "EffectComposer",
            params: {
              get renderer() {
                return exParams.envs.threeDPart_withAllObjects.components.renderer[0].data;
              }
            },
            methods: {
              "setSize": {
                get width() {
                  return exParams.envs.threeDPart_withAllObjects.window.innerWidth;
                },
                get height() {
                  return exParams.envs.threeDPart_withAllObjects.window.innerHeight;
                }
              }
            },
            properties: {},
            addToScene: true
          },
          {
            data: null,
            type: "RenderPass",
            params: {
              get scene() {
                return exParams.envs.threeDPart_withAllObjects.components.scene[0].data;
              },
              get camera() {
                return exParams.envs.threeDPart_withAllObjects.components.camera[0].data;
              }
            },
            methods: {},
            properties: {},
            addToScene: true
          },
          {
            data: null,
            type: "OutlinePass",
            params: {
              get resolution() {
                return exParams.envs.threeDPart_withAllObjects.components.attributes.list.outlinePassVector;
              },
              get scene() {
                return exParams.envs.threeDPart_withAllObjects.components.scene[0].data;
              },
              get camera() {
                return exParams.envs.threeDPart_withAllObjects.components.camera[0].data;
              }
            },
            methods: {
              "hiddenEdgeColor.set": 0xffffff
            },
            properties: {
              "pulsePeriod": 2,
              "edgeStrength": 4,
              "edgeThickness": 2,
              "edgeGlow": 0.5
            },
            addToScene: true
          }
        ],
        shader: [
          {
            data: null,
            type: "FXAA",
            params: {},
            methods: {
              "uniforms['resolution'].value.set": {
                get width() {
                  return 1 / exParams.envs.threeDPart_withAllObjects.window.innerWidth;
                },
                get height() {
                  return 1 / exParams.envs.threeDPart_withAllObjects.window.innerHeight;
                }
              }
            },
            properties: {},
            addToScene: true
          },
          {
            data: null,
            type: "GammaCorrection",
            params: {},
            methods: {},
            properties: {},
            addToScene: true
          }
        ],
      },
      reset: null
    },
    threeDPart_withSpecificObject: {
      canvas: null,
      window: null,
      activityID: null,
      object: [],
      components: {
        attributes: {
          list: {
            controlsTargetVector: null
          },
          update: [
            {
              id: "controlsTargetVector",
              type: "Vector3",
              params: { x: 0, y: 1.5, z: 0 },
            }
          ]
        },
        renderer: [
          {
            data: null,
            type: "WebGLRenderer",
            params: {
              get canvas() { return exParams.envs.threeDPart_withSpecificObject.canvas },
              antialias: true
            },
            methods: {
              "setSize": {
                get width() {
                  return exParams.envs.threeDPart_withSpecificObject.canvas.clientWidth;
                },
                get height() {
                  return exParams.envs.threeDPart_withSpecificObject.canvas.clientHeight;
                }
              },
              "setClearColor": {
                backgroundColor: 0x263238,
                backgroundColorIntensity: 1
              },
              "setPixelRatio": {
                get devicePixelRatio() {
                  return exParams.envs.threeDPart_withSpecificObject.canvas.devicePixelRatio;
                }
              }
            },
            properties: {
              "shadowMap.enabled": true,
              "shadowMap.type": "PCFSoftShadowMap",
              "outputColorSpace": "LinearSRGBColorSpace"
            }
          }
        ],
        scene: [
          {
            data: null,
            type: "Scene",
            methods: {},
            properties: {
              "name": "SceneMain"
            }
          }
        ],
        camera: [
          {
            data: null,
            type: "PerspectiveCamera",
            params: {
              fov: 45,
              get aspect() {
                return exParams.envs.threeDPart_withSpecificObject.canvas.clientWidth / exParams.envs.threeDPart_withAllObjects.canvas.clientHeight;
              },
              near: 0.01,
              far: 2000
            },
            methods: {},
            properties: {
              "name": "CameraSub"
            },
            addToScene: true
          }
        ],
        light: [
          {
            data: null,
            type: "AmbientLight",
            params: {
              color: 0xb0bec5,
              intensity: 1
            },
            methods: {},
            properties: {
              "name": "ambientSub",
            },
            addToScene: true
          }
        ],
        controls: [
          {
            data: null,
            type: "OrbitControls",
            params: {
              get object() {
                return exParams.envs.threeDPart_withSpecificObject.components.camera[0].data;
              },
              get domElement() {
                return exParams.envs.threeDPart_withSpecificObject.components.renderer[0].data.domElement;
              }
            },
            methods: {},
            properties: {
              get target() {
                return exParams.envs.threeDPart_withSpecificObject.components.attributes.list.controlsTargetVector;
              },
              "enableDamping": true,
              "maxPolarAngle": Math.PI/2,
              "minDistance": 2,
              "maxDistance": 30,
              "enablePan": false,
              "ebableRotate": false,
              "enabled": false,
            },
            addToScene: true
          }
        ]
      },
      reset: null
    },
    // 3D-Part
    defaultMain: {
      canvas: null,
      objects: {
        defaultObjects: [
          {
            data: null,
            path: '../assets/3d_part/no_objects_default_3.glb',
            methods: {
              "position.set": { x: 0, y: 0, z: 0 }
            },
            properties: {
              "name": "noObjectsSign",
              "rotation.z": Math.PI / 1
            },
            addToScene: true
          } 
        ]
      },
      components: {
        attributes: {
          list: {
            externalShader: ["PerlinNoise"],
            controlsTargetVector: null,
            shaderResolutionVector: null,
            uniforms: {
              u_resolution: {
                type: 'v2',
                get value() {
                  return exParams.envs.defaultMain.components.attributes.list.shaderResolutionVector;
                }
              },
              u_time: {
                type: 'f',
                value: 0.0
              }
            }
          },
          update: [
            {
              id: "controlsTargetVector",
              type: "Vector3",
              params: { x: 0, y: 1.5, z: 0 },
            },
            {
              id: "shaderResolutionVector",
              type: "Vector2",
              params: {
                get width() {
                  return exParams.envs.defaultMain.window.innerWidth;
                },
                get height() {
                  return exParams.envs.defaultMain.window.innerHeight;
                }
              },
            }
          ]
        },
        renderer: [
          {
            data: null,
            type: "WebGLRenderer",
            params: {
              get canvas() {
                return exParams.envs.defaultMain.canvas
              },
              antialias: true
            },
            methods: {
              "setSize": {
                get width() {
                  return exParams.envs.defaultMain.canvas.clientWidth
                },
                get height() {
                  return exParams.envs.defaultMain.canvas.clientHeight
                }
              },
              "setClearColor": {
                backgroundColor: 0x263238,
                backgroundColorIntensity: 1
              }
            },
            properties: {
              "shadowMap.enabled": true,
              "shadowMap.type": "PCFSoftShadowMap",
              "outputColorSpace": "LinearSRGBColorSpace"
            }
          }
        ],
        scene: [
          {
            data: null,
            type: "Scene",
            params: {},
            methods: {},
            properties: {
              "name": "sceneDefault"
            }
          }
        ],
        camera: [
          {
            data: null,
            type: "PerspectiveCamera",
            params: {
              fov: 25,
              get aspect() {
                return exParams.envs.defaultMain.canvas.clientWidth / exParams.envs.defaultMain.canvas.clientHeight;
              },
              near: 0.01,
              far: 1000
            },
            methods: {
              "position.set": { x: 0, y: 1.5, z: -17 }
            },
            properties: {
              "name": "CameraDefault"
            }
          }
        ],
        light: [
          {
            data: null,
            type: "HemisphereLight",
            params: {
              skyColor: 0xffffff,
              groundColor: 0x000000,
              intensity: 1
            },
            methods: {
              "position.set": { x: 0, y: 6, z: 0 }
            },
            properties: {
              "name": "ambientLightMain",
            },
            addToScene: true
          },
          {
            data: null,
            type: "DirectionalLight",
            params: {
              color: 0xffffff,
              intensity: 1,
            },
            methods: {
              "position.set": { x: 0, y: 5, z: -2 }
            },
            properties: {
              "name": "directionalLightMain",
              "castShadow": true,
              "shadow.mapSize.width": 1024,
              "shadow.mapSize.height": 1024,
              "shadow.camera.far": 24,
              "shadow.radius": 5,
              "shadow.bias": -0.00006
            },
            addToScene: true
          }
        ],
        controls: [
          {
            data: null,
            type: "OrbitControls",
            params: {
              get object() {
                return exParams.envs.defaultMain.components.camera[0].data;
              },
              get domElement() {
                return exParams.envs.defaultMain.components.renderer[0].data.domElement;
              }
            },
            methods: {},
            properties: {
              get target() {
                return exParams.envs.defaultMain.components.attributes.list.controlsTargetVector;
              },
              "enableDamping": true,
              "maxPolarAngle": Math.PI/2,
              "minDistance": 2,
              "maxDistance": 30,
              "enablePan": false,
              "ebableRotate": false,
              "enabled": false,
            },
            addToScene: false
          },
        ],
        shader: [],
        externalShader: {},
        defaultObjects: {
          geometries: {
            list: {
              groundGeometry: null,
              groundMaterial: null,
              icosahedronGeometry: null,
              icosahedronMaterial: null
            },
            initData: [
              {
                id: "groundGeometry",
                type: "PlaneGeometry",
                params: {
                  width: 200,
                  height: 200
                }
              },
              {
                id: "groundMaterial",
                type: "MeshStandardMaterial",
                params: {
                  color: 0x151d21
                }
              },
              {
                id: "icosahedronGeometry",
                type: "IcosahedronGeometry",
                params: {
                  radius: 4,
                  detail: 30
                }
              },
              {
                id: "icosahedronMaterial",
                type: "ShaderMaterial",
                params: {
                  get uniforms() {
                    return exParams.envs.defaultMain.components.attributes.list.uniforms;
                  },
                  get vertexShader() {
                    return exParams.envs.defaultMain.components.externalShader["PerlinNoise"].data.vertexShader;
                  },
                  get fragmentShader() {
                    return exParams.envs.defaultMain.components.externalShader["PerlinNoise"].data.fragmentShader;
                  }
                }
              }
            ]
          },
          meshes: {
            ground: {
              data: null,
              type: "Mesh",
              params: {
                get groundGeometry() {
                  return exParams.envs.defaultMain.components.defaultObjects.geometries.list.groundGeometry;
                },
                get groundMaterial() {
                  return exParams.envs.defaultMain.components.defaultObjects.geometries.list.groundMaterial;
                }
              },
              methods: {
                "rotateY": -Math.PI,
                "position.set": { x: 0, y: 0, z: 3 }
              },
              properties: {},
              addToScene: true
            },
            icosahedron: {
              data: null,
              type: "Mesh",
              params: {
                get icosahedronGeometry() {
                  return exParams.envs.defaultMain.components.defaultObjects.geometries.list.icosahedronGeometry;
                },
                get icosahedronMaterial() {
                  return exParams.envs.defaultMain.components.defaultObjects.geometries.list.icosahedronMaterial;
                }
              },
              methods: {
                "position.set": {x: 0, y: 3, z: 0},
                "scale.set": {x: 0.3, y: 0.3, z: 0.3}
              },
              properties: {
                "name": "ICO",
                "material.wireframe": true,
                "castShadow": true
              },
              addToScene: true
            }
          }
        }
      },
    },
    threeDPartMain: {
      canvas: null,
      window: null,
      activityID: null,
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
      components: {
        attributes: {
          list: {
            externalShader: [],
            outlinePassVector: null,
            ctrlDown: false,
            needsUpdate: false,
            annotationButtonPressed: false,
          },
          update: [
            {
              id: "outlinePassVector",
              type: "Vector2",
              params: {
                get width() {
                  return exParams.envs.threeDPartMain.window.innerWidth;
                },
                get height() {
                  return exParams.envs.threeDPartMain.window.innerHeight;
                }
              },
            }
          ]
        },
        renderer: [
          {
            data: null,
            type: "WebGLRenderer",
            params: {
              get canvas() { return exParams.envs.threeDPartMain.canvas },
              antialias: true
            },
            methods: {
              "setSize": {
                get width() {
                  return exParams.envs.threeDPartMain.canvas.clientWidth;
                },
                get height() {
                  return exParams.envs.threeDPartMain.canvas.clientHeight;
                }
              },
              "setClearColor": {
                backgroundColor: 0x263238,
                backgroundColorIntensity: 1
              },
            },
            properties: {
              "shadowMap.enabled": true,
              "shadowMap.type": "PCFSoftShadowMap",
              "outputColorSpace": "LinearSRGBColorSpace"
            }
          }
        ],
        scene: [
          {
            data: null,
            type: "Scene",
            methods: {},
            properties: {
              "name": "SceneMain"
            }
          }
        ],
        camera: [
          {
            data: null,
            type: "PerspectiveCamera",
            params: {
              fov: 45,
              get aspect() {
                return exParams.envs.threeDPartMain.canvas.clientWidth / exParams.envs.threeDPartMain.canvas.clientHeight;
              },
              near: 0.01,
              far: 2000
            },
            methods: {},
            properties: {
              "name": "CameraMain"
            }
          }
        ],
        light: [
          {
            data: null,
            type: "AmbientLight",
            params: {
              color: 0xb0bec5,
              intensity: 1
            },
            methods: {},
            properties: {
              "name": "ambientMain",
            }
          },
          {
            data: null,
            type: "DirectionalLight",
            params: {
              color: 0xffffff,
              intensity: 3.5,
            },
            methods: {
              "position.set": { x: -1, y: -3, z: 0 }
            },
            properties: {
              "name": "directionalMain",
            }
          }
        ],
        controls: [
          {
            data: null,
            type: "ArcballControls",
            params: {
              get camera() {
                return exParams.envs.threeDPartMain.components.camera[0].data;
              },
              get domElement() {
                return exParams.envs.threeDPartMain.components.renderer[0].data.domElement;
              },
              get scene() {
                return exParams.envs.threeDPartMain.components.scene[0].data;
              }
            },
            methods: {
              "setGizmosVisible": false
            },
            properties: {
              "maxDownTime": 0,
              "maxInterval": 0,
              "cursorZoom": true,
            },
            addToScene: false
          },
          {
            data: null,
            type: "TransformControls",
            params: {
              get object() {
                return exParams.envs.threeDPartMain.components.camera[0].data;
              },
              get domElement() {
                return exParams.envs.threeDPartMain.components.renderer[0].data.domElement;
              }
            },
            methods: {
              "addEventListener": {
                "dragging-changed": e => {
                  // Which controls should be swapped with?
                  const arcBallControls = { 
                    set enabled(e) {
                      return exParams.envs.threeDPartMain.components.controls[0].data.enabled = !e.value
                    }
                  }
                  arcBallControls.enabled = e;
                },
                "objectChange": () => {
                  const components = { 
                    get attributes() { 
                      return exParams.envs.threeDPartMain.components
                    } 
                  }
                  components.attributes.needsUpdate = true; 
                }
              }
            },
            properties: {},
            addToScene: true
          }
        ],
        raycaster: [
          {
            data: null,
            type: "Raycaster",
            params: {
              name: "raycasterMain"
            },
            methods: {},
            properties: {}
          }
        ],
        postProcessing: [
          {
            data: null,
            type: "EffectComposer",
            params: {
              get renderer() {
                return exParams.envs.threeDPartMain.components.renderer[0].data;
              }
            },
            methods: {
              "setSize": {
                get width() {
                  return exParams.envs.threeDPartMain.window.innerWidth;
                },
                get height() {
                  return exParams.envs.threeDPartMain.window.innerHeight;
                }
              }
            },
            properties: {}
          },
          {
            data: null,
            type: "RenderPass",
            params: {
              get scene() {
                return exParams.envs.threeDPartMain.components.scene[0].data;
              },
              get camera() {
                return exParams.envs.threeDPartMain.components.camera[0].data;
              }
            },
            methods: {},
            properties: {}
          },
          {
            data: null,
            type: "OutlinePass",
            params: {
              get resolution() {
                return exParams.envs.threeDPartMain.components.attributes.list.outlinePassVector;
              },
              get scene() {
                return exParams.envs.threeDPartMain.components.scene[0].data;
              },
              get camera() {
                return exParams.envs.threeDPartMain.components.camera[0].data;
              }
            },
            methods: {
              "hiddenEdgeColor.set": 0xffffff
            },
            properties: {
              "pulsePeriod": 2,
              "edgeStrength": 4,
              "edgeThickness": 2,
              "edgeGlow": 0.5
            }
          }
        ],
        shader: [
          {
            data: null,
            type: "FXAA",
            params: {},
            methods: {
              "uniforms['resolution'].value.set": {
                get width() {
                  return 1 / exParams.envs.threeDPartMain.window.innerWidth;
                },
                get height() {
                  return 1 / exParams.envs.threeDPartMain.window.innerHeight;
                }
              }
            },
            properties: {}
          },
          {
            data: null,
            type: "GammaCorrection",
            params: {},
            methods: {},
            properties: {}
          }
        ],
      }
    },
    threeDPartSub: {},
  },

  tools: {
    measurement: {},
    annotation: {},
    cutting: {}
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
    methods: {
      "addEventListener": {
        "dragging-changed": e => {
          const arcBall = {
            set data2(para) {
              exParams.main.arcBallControls.enabled = !para.value
            }
          }
          arcBall.data2 = e
        },
        "objectChange": () => {
          const components = { 
            get attributes() { 
              return exParams.main
            },
          }
          components.attributes.needsUpdate = true;
        }
      }
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
        intensity: 1
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
    annotationButtonPressed: false
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
          opacity: 0,
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
        opacity: 0,
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