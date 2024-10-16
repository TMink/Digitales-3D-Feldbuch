<!--
 Created Date: 23.09.2024 10:14:23
 Author: Tobias Mink
 
 Modified By: Tobias Mink
 
 Description: 
 --> This system is being implemented as part of a master's thesis and enables 4D analysis and visualization of the stratigraphy of an excavation

<template>
  <div id="wrapper">
    <Navigation active_tab_prop="2" />
            </v-card>  
          </v-row>
            </v-card>
            </v-card>   
          </v-row>
            </v-card>
          </v-row>
                <DropzoneBackground :style="{ backgroundColor: isDragOver ? '#1e81b0' : 'transparent', transition: 'background-color 0.2s ease', }">
                  <p v-if="isDragOver">Drop here</p>
                </DropzoneBackground>
              </VueFlow>
            </v-card>
          </v-row>
          </v-row>
            </v-card>
          </v-row>
            </v-card>
          </v-row>
      </v-row>
  </div>
</template>

  

  }

  
  
  /**
   * 
   * 
   */
    }
  }
  

      }
    }


    if( getNodes.value.length != 0 ) {
      for( const[_, value] of Object.entries(getNodes.value) ) {
        }
      }
    }
  
    if( getNodes.value.length != 0 ) {
        }
      }
    }

  /**
   * 
   * 
   */
    }
    /**
     * 3D-Editor
     */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 45, canvas.clientWidth / canvas.clientHeight, 0.01, 2000 );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    });
    renderer.setPixelRatio( canvas.devicePixelratio )
    renderer.setClearColor( 0x263238, 1);
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;
    function animate() {
	    renderer.render( scene, camera );
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }
    renderer.setAnimationLoop( animate );
  })
</script>

<script>
export default {
  name: 'StratiTool',
}
</script>

<style>
@import '../components/graph-editor-components/style.css';
</style>