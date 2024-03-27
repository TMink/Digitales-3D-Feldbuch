/*
 * Created Date: 15.01.2024 11:05:52
 * Author: Tobias Mink
 * 
 * Last Modified: 27.03.2024 19:11:30
 * Modified By: Tobias Mink
 * 
 * Description: 
 */

import * as THREE from 'three';
import { CSS2DObject } from 
  'three/examples/jsm/renderers/CSS2DRenderer'
import { fromOfflineDB } from '../../ConnectionToOfflineDB.js'
import { toRaw } from 'vue';

import { MeshBVHVisualizer } from 'three-mesh-bvh';
import {
	Brush,
	Evaluator,
	EdgesHelper,
	TriangleSetHelper,
	logTriangleDefinitions,
	GridMaterial
} from 'three-bvh-csg';

export class LineTool {
  
  createLine( name, position ) {  
    const points = [];
      points.push( new THREE.Vector3(position[0], position[1], position[2]),
                   new THREE.Vector3(position[3], position[4], position[5]) );

      const geometry = new THREE.BufferGeometry().setFromPoints(
        points
      )

      /* Create line */
      const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: 0x0000ff,
        }),
      )

      line.name = name;
      line.frustumCulled = false;

      return line
  }

  createLable( name, distance, position ) {
    const lableDiv = document.createElement( "div" );
    lableDiv.className = "lable";
    lableDiv.innerText = distance
    lableDiv.style.marginTop = "-1em";
    const measurementLable = new CSS2DObject( lableDiv );
    measurementLable.name = name;
    const vec3 = new THREE.Vector3( position.x, position.y, position.z );
    measurementLable.position.copy( vec3 );
    
    return measurementLable
  }

  createBall( name, pos ) {
    const geometry = new THREE.SphereGeometry( 0.03, 6, 4 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.name = name;
    return {
      sphere: sphere,
      position: {
        x: pos[0],
        y: pos[1],
        z: pos[2]
      }
    }
  }
  
  createBalls( names, position ) {
    const pos = [ 
      [ position[0], position[1], position[2] ],
      [ position[3], position[4], position[5] ]
    ]
    
    const spheres = []

    names.forEach( (_, i) => {
      spheres.push( this.createBall( names[ i ], pos[ i ] ))
    } )

    return spheres
  }
  
  updateTitle( measureTool ) {
    if ( measureTool.texttoken ) {
      measureTool.title = measureTool.textField;
      measureTool.texttoken = false;
    }
  }

  async saveLineTitle( root, t, measureTool, scene ) {
    let idToBeRenamed = null;
    let token = true;

    const linesInDB = await fromOfflineDB.getAllObjects(
      'Lines', 'lines' );
    
    /* New names cant be blank, undefined or already taken */
    /* Check if new name is " " or undefined */
    if( measureTool.textField == "" || measureTool.textField == undefined ) {
      token = false
      root.vtoast.show({ message: t('Please enter a name first')});
    } else {
      /* Check if the name is already taken */
      var notTaken = true
      linesInDB.forEach( line => {
        if( line.name.split(" -")[0] === measureTool.textField ) {
          notTaken = false;
        }
      } )
      if( !notTaken ) {
        token = false;
        root.vtoast.show({ message: t('Name already taken')});
      }
    }

    /* If the new name meet the criteria from above */
    if( token ) {
      measureTool.infoBlock.forEach( element => {
        if ( element.name === measureTool.title ) {
          element.name = measureTool.textField + " - " + measureTool.title.split("- ")[1];
          idToBeRenamed = element._id;
        }
      } )
  
      /* Rename line in IndexedDb */
      const lineInDB = linesInDB.find( e => e._id === idToBeRenamed );
      lineInDB.name = measureTool.textField + " - " + lineInDB.name.split('- ')[1];
      lineInDB.lable.distance = measureTool.textField + " \n " + lineInDB.name.split('- ')[1];
      await fromOfflineDB.updateObject( lineInDB, 'Lines', 'lines' );

      measureTool.textField = measureTool.textField + " - " + lineInDB.name.split('- ')[1];
  
      this.updateLineMenue( measureTool );
      this.updateLineInnerText( lineInDB.line.name, 
        measureTool.textField.split('- ')[0] + " \n " + lineInDB.name.split('- ')[1], scene );
      measureTool.texttoken = true;
    }
  }

  async deleteLine( placeInDB, measureTool, scene ) {
    let idToBeDeleted = null
    const linesInDB = await fromOfflineDB.getAllObjects(
      'Lines', 'lines' );
      
    measureTool.infoBlock.forEach( element => {
      if ( element.name === measureTool.title ) {
        idToBeDeleted = element._id;
        
        const index = measureTool.infoBlock.indexOf(element)

        /* Delte line from sceneMain */
        const line = scene.getObjectByName(measureTool.infoBlock[index].line)
        const lable = scene.getObjectByName(measureTool.infoBlock[index].lable)
        const firstBall = scene.getObjectByName(measureTool.infoBlock[index].balls[0])
        const secondBall = scene.getObjectByName(measureTool.infoBlock[index].balls[1])

        line.remove( lable );
        line.geometry.dispose();
        line.material.dispose();
        scene.remove( line );

        firstBall.geometry.dispose();
        firstBall.material.dispose();
        scene.remove( firstBall );

        secondBall.geometry.dispose();
        secondBall.material.dispose();
        scene.remove( secondBall );

        /* Delete menue item */
        measureTool.textField = null
        measureTool.infoBlock.splice(index, 1)
      }
    })

    /* Delete from IndexedDb */
    const lineInDB = linesInDB.find( e => e._id === idToBeDeleted );
    const index = placeInDB.lines.indexOf(lineInDB.name);
    placeInDB.lines.splice( index, 1 );
    await fromOfflineDB.deleteObject( lineInDB, 'Lines', 'lines' );
    await fromOfflineDB.updateObject( structuredClone(toRaw(placeInDB)), 
      'Places', 'places' )

    measureTool.title = null;
    this.updateLineMenue( measureTool );
  }

  updateLineMenue( measureTool ) {
    measureTool.allTitles = [];
    measureTool.infoBlock.forEach( element => {
      measureTool.allTitles.push( element.name );
    })
  }

  updateLineInnerText( lineName, newLable, scene ) {
    const lineToChange = scene.getObjectByName( lineName )
    lineToChange.children[0].element.innerText = newLable
  }

  findLineCenter( lineStart, lineEnd ) {
    return { 
      x: (lineEnd.x - lineStart.x) / 2 + lineStart.x, 
      y: (lineEnd.y - lineStart.y) / 2 + lineStart.y,
      z: (lineEnd.z - lineStart.z) / 2 + lineStart.z };
  }
  
}

export class AnnotationTool {

  constructor() {
    this.lableParams = {
      element: "div",
      className: "lable",
      marginTop: "-1em"
    }
    this.boxParams = { 
      size: { width: 0.01, height: 0.01, depth: 0.01 },
      color: 0xffff00
    }
  }

  createLable( name, annotationName, position ) {
    const lableDiv = document.createElement( this.lableParams.element );
    lableDiv.className = this.lableParams.className;
    lableDiv.innerText = annotationName
    lableDiv.style.marginTop = this.lableParams.marginTop;
    const measurementLable = new CSS2DObject( lableDiv );
    measurementLable.name = name;
    const vec3 = new THREE.Vector3( position[0], position[1], position[2] );
    measurementLable.position.copy( vec3 );
    
    return measurementLable
  }

  createBox( name, pos ) {
    const geometry = new THREE.BoxGeometry( this.boxParams.size.width, 
      this.boxParams.size.height, this.boxParams.size.depth );
    const material = new THREE.MeshBasicMaterial( { 
      color: this.boxParams.color } );
    const box = new THREE.Mesh( geometry, material );
    box.name = name;
    return box; 
  }

  updateTitle( annotatTool ) {
    if ( annotatTool.texttoken ) {
      annotatTool.title = annotatTool.textField;
      annotatTool.texttoken = false;
    }
  }

  async saveLineTitle( root, t, annotatTool, scene ) {
    let idToBeRenamed = null;
    let token = true;

    const annotationsInDB = await fromOfflineDB.getAllObjects(
      'Annotations', 'annotations' );
    
    /* New names cant be blank, undefined or already taken */
    /* Check if new name is " " or undefined */
    if( annotatTool.textField == "" || annotatTool.textField == undefined ) {
      token = false
      root.vtoast.show({ message: t('Please enter a name first')});
    } else {
      /* Check if the name is already taken */
      var notTaken = true
      annotationsInDB.forEach( annotation => {
        if( annotation.lableName === annotatTool.textField ) {
          notTaken = false;
        }
      } )
      if( !notTaken ) {
        token = false;
        root.vtoast.show({ message: t('Name already taken')});
      }
    }

    /* If the new name meet the criteria from above */
    if( token ) {
      annotatTool.infoBlock.forEach( element => {
        if ( element.lableName === annotatTool.title ) {
          element.lableName = annotatTool.textField;
          idToBeRenamed = element._id;
        }
      } )
  
      /* Rename line in IndexedDb */
      const annotationInDB = annotationsInDB.find( e => e._id === idToBeRenamed );
      annotationInDB.lableName = annotatTool.textField;
      await fromOfflineDB.updateObject( annotationInDB, 'Annotations', 'annotations' );

      annotatTool.textField = annotatTool.textField;
  
      this.updateAnnotationMenue( annotatTool );
      this.updateAnnotationInnerText( annotationInDB.boxName, annotatTool.textField, 
        scene );
      annotatTool.texttoken = true;
    }
  }

  updateAnnotationMenue( annotatTool ) {
    annotatTool.allTitles = [];
    annotatTool.infoBlock.forEach( element => {
      annotatTool.allTitles.push( element.lableName );
    })
  }

  updateAnnotationInnerText( boxName, newLable, scene ) {
    const boxToChange = scene.getObjectByName( boxName )
    boxToChange.children[0].element.innerText = newLable
  }

  async deleteLine( placeInDB, annotatTool, scene ) {
    let idToBeDeleted = null
    const annotationsInDB = await fromOfflineDB.getAllObjects(
      'Annotations', 'annotations' );
      
    annotatTool.infoBlock.forEach( element => {
      if ( element.lableName === annotatTool.title ) {
        idToBeDeleted = element._id;
        
        const index = annotatTool.infoBlock.indexOf(element)

        /* Delte line from sceneMain */
        const lable = scene.getObjectByName(annotatTool.infoBlock[index]._id)
        const box = scene.getObjectByName(annotatTool.infoBlock[index].boxName)

        box.remove( lable );
        box.geometry.dispose();
        box.material.dispose();
        scene.remove( lable );

        lable.remove()

        /* Delete menue item */
        annotatTool.textField = null
        annotatTool.infoBlock.splice(index, 1)
      }
    })

    /* Delete from IndexedDb */
    const annotationInDB = annotationsInDB.find( e => e._id === idToBeDeleted );
    const index = placeInDB.lines.indexOf(annotationInDB._id);
    placeInDB.lines.splice( index, 1 );
    await fromOfflineDB.deleteObject( annotationInDB, 'Annotations', 'annotations' );
    await fromOfflineDB.updateObject( structuredClone(toRaw(placeInDB)), 
      'Places', 'places' )

    annotatTool.title = null;
    this.updateAnnotationMenue( annotatTool );
  }
}

export class ModelInteraktion {
  
  changeColor( color, modelGroup ) {
    if ( color != null && modelGroup != null ) {

      modelGroup.traverse( (child) => {
        if ( child instanceof THREE.Mesh) {
          child.material.color = new THREE.Color( color );
        }
      })
    }
  }
  
}

export class SegmentationTool {
  
  updateBrush( brush, params ) {

    brush.geometry.dispose();
  
    brush.geometry = brush.geometry.toNonIndexed();
  
    const position = brush.geometry.attributes.position;
    const array = new Float32Array( position.count * 3 );
    for ( let i = 0, l = array.length; i < l; i += 9 ) {
  
      array[ i + 0 ] = 1;
      array[ i + 1 ] = 0;
      array[ i + 2 ] = 0;
  
      array[ i + 3 ] = 0;
      array[ i + 4 ] = 1;
      array[ i + 5 ] = 0;
  
      array[ i + 6 ] = 0;
      array[ i + 7 ] = 0;
      array[ i + 8 ] = 1;
  
    }
  
    brush.geometry.setAttribute( 'color', new THREE.BufferAttribute( array, 3 ) );
    brush.prepareGeometry();
    params.needsUpdate = true;
  
  }

  async switchToSegmentationMode( stTool, main ) {
    
    /**
     * Make all objects in scene invisible and all brushes visible and vice 
     * versa
     */
    if( !stTool.brushToCutWith.brush.visible ) {
      main.objects.allObjects[0].children[0].visible = false;
      stTool.brushToCutWith.brush.visible = true;
      stTool.brushesOfObjects.forEach( ( brush ) => {
        brush.brush.visible = true;
        brush.resultObject.visible = true;
      } )
    } else {
      stTool.brushToCutWith.brush.visible = false;
      stTool.brushesOfObjects.forEach( ( brush ) => {
        brush.brush.visible = false;
        brush.resultObject.visible = false;
      } )
      main.objects.allObjects[0].children[0].visible = true;
    }
    
    /**
     * Attach transform controls to brush, to be able to move it
     * Detach if they are already attached
     */
    if( !stTool.brushToCutWith.attach ) {
      main.transformControls.attach( stTool.brushToCutWith.brush );
      stTool.brushToCutWith.attach = true;
    } else {
      main.transformControls.detach();
      stTool.brushToCutWith.attach = false;
    }

    main.needsUpdate = true;

  }

  displayControls( main ) {
    if( main.transformControls.visible ) {
      main.transformControls.visible = false;
    } else {
      main.transformControls.visible = true;
    }
  }

}