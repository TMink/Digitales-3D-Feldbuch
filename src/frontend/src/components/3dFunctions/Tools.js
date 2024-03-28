/*
 * Created Date: 15.01.2024 11:05:52
 * Author: Tobias Mink
 * 
 * Last Modified: 28.03.2024 16:56:52
 * Modified By: Tobias Mink
 * 
 * Description: A collection of all created tools. The initialisation of each 
 *              tool takes place in Initialisations.js.
 *              These classes contain the logic behind each tool and can be 
 *              imported inside 3DView.js for further usage.
 */

import * as THREE from 'three';
import { CSS2DObject } from 
  'three/examples/jsm/renderers/CSS2DRenderer'
import { fromOfflineDB } from '../../ConnectionToOfflineDB.js'
import { toRaw } from 'vue';
import { Brush } from 'three-bvh-csg';

export class LineTool {

  constructor() {
    this.lineParams = {
      color: 0x0000ff,
      frustrumCulled: false,
    }
    this.lableParams = {
      element: "div",
      className: "lable",
      marginTop: "-1em"
    }
    this.ballParams = {
      size: { x: 0.03, y: 6,z: 4},
      color: 0xffff00
    }
    this.alertParams = {
      noName: "Please enter a name first",
      dupName: "Name already taken"
    }
  }
  
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
          color: this.lineParams.color,
        }),
      )

      line.name = name;
      line.frustumCulled = this.lineParams.frustrumCulled;

      return line
  }

  createLable( name, distance, position ) {
    const lableDiv = document.createElement( this.lableParams.element );
    lableDiv.className = this.lableParams.className;
    lableDiv.innerText = distance
    lableDiv.style.marginTop = this.lableParams.marginTop;
    const measurementLable = new CSS2DObject( lableDiv );
    measurementLable.name = name;
    const vec3 = new THREE.Vector3( position.x, position.y, position.z );
    measurementLable.position.copy( vec3 );
    
    return measurementLable
  }

  createBall( name, pos ) {
    const geometry = new THREE.SphereGeometry( this.ballParams.size.x, this.ballParams.size.y, this.ballParams.size.z );
    const material = new THREE.MeshBasicMaterial( { color: this.ballParams.color } );
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
      root.vtoast.show({ message: t( this.alertParams.noName )});
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
        root.vtoast.show({ message: t( this.alertParams.dupName )});
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
      size: { x: 0.01, y: 0.01, z: 0.01 },
      color: 0xffff00
    }
  }
  
  /**
   * Creates a new label as an 2D-Sprite. This lable can be added to any
   * THREE.Object3D.
   * @param { String } name 
   * @param { String } annotationName 
   * @param { object } position 
   * @returns 
   */
  createLable( name, annotationName, position ) {
    /* Create new div-container element for CSS2D-Object */
    const lableDiv = document.createElement( this.lableParams.element );
    
    /* Adapt div-container parameters */
    lableDiv.className = this.lableParams.className;
    lableDiv.innerText = annotationName
    lableDiv.style.marginTop = this.lableParams.marginTop;

    /* Create new CSS2D-Object inside the div-container */
    const measurementLable = new CSS2DObject( lableDiv );

    /* Adapt CSS2D-Object parameters */
    measurementLable.name = name;
    
    /* Create new vector */
    const vec3 = new THREE.Vector3( position[0], position[1], position[2] );
    
    /* Change position of CSS2D-Object in relation to the new vector */
    measurementLable.position.copy( vec3 );
    
    /* Return the CSS2D-Object */
    return measurementLable
  }

  /**
   * Creates a THREE.Mesh based on the THREE.BoxGeometry.
   * @param { String } name
   * @returns 
   */
  createBox( name ) {
    /* Create geometry */
    const geometry = new THREE.BoxGeometry( this.boxParams.size.x, 
      this.boxParams.size.y, this.boxParams.size.z );
      
    /* Create material */
    const material = new THREE.MeshBasicMaterial( { 
      color: this.boxParams.color } );

    /* Create mesh from geometry and material */
    const box = new THREE.Mesh( geometry, material );
    
    /* Change name of the object */
    box.name = name;
    
    /* Return object */
    return box; 
  }

  /**
   * Updates UI to match the new textfield input.
   * @param { object } annotatTool 
   */
  updateTitle( annotatTool ) {
    if ( annotatTool.texttoken ) {
      /* Overrides the given title with the string inside the textfield. */
      annotatTool.title = annotatTool.textField;
      annotatTool.texttoken = false;
    }
  }

  /**
   * Updates the text of an annotation and updateds the ui and IndexedDB.
   * @param { any } root 
   * @param { any } t 
   * @param { object } annotatTool 
   * @param { THREE.Scene } scene 
   */
  async saveAnnotationTitle( root, t, annotatTool, scene ) {
    let idToBeRenamed = null;
    let token = true;

    /* Get all annotations in IndexedDB */
    const annotationsInDB = await fromOfflineDB.getAllObjects(
      'Annotations', 'annotations' );
    
    /* New names cant be blank, undefined or already taken */
    /* Check if new name is " " or undefined */
    if( annotatTool.textField == "" || annotatTool.textField == undefined ) {
      token = false
      /* Alert the user if no name in entered */
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
        /* Alert the user if the name is already taken */
        root.vtoast.show({ message: t('Name already taken')});
      }
    }

    /* If the new name meet the criteria from above, adapt the new name */
    if( token ) {
      annotatTool.infoBlock.forEach( element => {
        if ( element.lableName === annotatTool.title ) {
          element.lableName = annotatTool.textField;
          idToBeRenamed = element._id;
        }
      } )
  
      /* Find the annotation with the id that matches the one that will be 
       * changed. */
      const annotationInDB = annotationsInDB.find( 
        e => e._id === idToBeRenamed );
      /* Rename line */
      annotationInDB.lableName = annotatTool.textField;
      /* Update the entry in IndexedDB */
      await fromOfflineDB.updateObject( annotationInDB, 'Annotations', 
        'annotations' );
  
      /* Update the drop down menue */
      this.updateAnnotationMenue( annotatTool );
      /* Update the text of the CSS2D-Object */
      this.updateAnnotationInnerText( annotationInDB.boxName, 
        annotatTool.textField, scene );
      annotatTool.texttoken = true;
    }
  }

  /**
   * Updates all entrys of the drop down menue.
   * @param { object } annotatTool 
   */
  updateAnnotationMenue( annotatTool ) {
    annotatTool.allTitles = [];
    annotatTool.infoBlock.forEach( element => {
      annotatTool.allTitles.push( element.lableName );
    })
  }

  /**
   * Updates the text of an annotation in scene
   * @param { String } boxName 
   * @param { String } newLable 
   * @param { THREE.Scene } scene 
   */
  updateAnnotationInnerText( boxName, newLable, scene ) {
    const boxToChange = scene.getObjectByName( boxName )
    boxToChange.children[0].element.innerText = newLable
  }

  /**
   * Search through all annotations, locate the one wich should be removed and
   * remove it from scene, ui and IndexedDB.
   * @param { any } placeInDB 
   * @param { object } annotatTool 
   * @param { THREE.scene } scene 
   */
  async deleteAnnotation( placeInDB, annotatTool, scene ) {
    let idToBeDeleted = null

    /* Get all annotations in IndexedDB */
    const annotationsInDB = await fromOfflineDB.getAllObjects(
      'Annotations', 'annotations' );
    
    /* Disposes the geoemetry and material of the box, removes the CSS2D-Object
     * and clears the ui entrys. */
    annotatTool.infoBlock.forEach( element => {
      if ( element.lableName === annotatTool.title ) {
        idToBeDeleted = element._id;
        
        const index = annotatTool.infoBlock.indexOf(element)

        /* Get the CSS2D- and box-Object from scene */
        const lable = scene.getObjectByName(annotatTool.infoBlock[index]._id)
        const box = scene.getObjectByName(annotatTool.infoBlock[index].boxName)

        /* Remove attached CSS2D-Object and dispose geometry and material of the 
         * box object. Afterwards remove it from scene. */
        box.remove( lable );
        box.geometry.dispose();
        box.material.dispose();
        scene.remove( box );

        /* Remove the CSS2D-Object */
        lable.remove()

        /* Delete menue item */
        annotatTool.textField = null
        annotatTool.infoBlock.splice(index, 1)
      }
    })

    /* Find annotation with id that matches the one that will be 
     * changed. */
    const annotationInDB = annotationsInDB.find( e => e._id === idToBeDeleted );
    /* Remove annotation-id from list of the current place */
    const index = placeInDB.lines.indexOf(annotationInDB._id);
    placeInDB.annotations.splice( index, 1 );
    /* Remove annotation from IndexedDB */
    await fromOfflineDB.deleteObject( annotationInDB, 'Annotations', 'annotations' );
    /* Update place entry in IndexedDB */
    await fromOfflineDB.updateObject( structuredClone(toRaw(placeInDB)), 
      'Places', 'places' )

    /* Remove title from ui */
    annotatTool.title = null;
    /* Update menue content */
    this.updateAnnotationMenue( annotatTool );
  }
}

export class ModelInteraktion {
  
  /**
   * Updates the color of an object
   * @param { String } color 
   * @param { THREE.Group } modelGroup 
   */
  changeColor( color, modelGroup ) {
    if ( color != null && modelGroup != null ) {

      modelGroup.traverse( (child) => {
        if ( child instanceof THREE.Mesh) {
          console.log(typeof(color))
          child.material.color = new THREE.Color( color );
        }
      })
    }
  }
  
}

export class SegmentationTool {

  /**
   * Updates the position and color attributes of a brush.
   * @param { Brush } brush 
   * @param { object } params 
   */
  updateBrush( brush, params ) {

    /* Dispose currently used geometry and return a non-index version of an 
     * indexed BufferGeometry. */
    brush.geometry.dispose();
    brush.geometry = brush.geometry.toNonIndexed();
  
    /* Update position */
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
  
    /* Set new color attribute */
    brush.geometry.setAttribute( 'color', new THREE.BufferAttribute( array, 3 ) );
    brush.prepareGeometry();
    params.needsUpdate = true;
  }

  /**
   * Make all objects in scene invisible and all brushes visible and vice 
   * versa.
   * @param { object } stTool 
   * @param { object } main 
   */
  async switchToSegmentationMode( stTool, main ) {   
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
     * Attach transform controls to brush, to be able to move it.
     * Detach if they are already attached.
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

  /**
   * Show controls or hide them
   * @param { object } main 
   */
  displayControls( main ) {
    if( main.transformControls.visible ) {
      main.transformControls.visible = false;
    } else {
      main.transformControls.visible = true;
    }
  }

}