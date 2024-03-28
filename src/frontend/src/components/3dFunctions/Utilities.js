/*
 * Created Date: 08.01.2024 14:43:50
 * Author: Tobias Mink
 * 
 * Last Modified: 28.03.2024 18:38:09
 * Modified By: Tobias Mink
 * 
 * Description: A Collections of various functions that are used all over the 
 *              3DPart in many different situations for minor changes or 
 *              generell maintenence.
 */

import * as THREE from 'three';
import { fromOfflineDB } from '../../ConnectionToOfflineDB.js'
import { toRaw } from 'vue';

export class Utilities {
  
  /**
   * Gets the group of an given object in scene.
   * @param { object } object 
   * @returns THREE.Group<any>
   */
  getGroup( object ) {
    var groupObject = object;
    while ( !( groupObject instanceof THREE.Group ) ) {
      groupObject = groupObject.parent;
    }
    
    return groupObject;
  }

  /**
   * Gets the center of an object/group of objects.
   * @param { object } object 
   * @returns THREE.Vector3
   */
  getModelCenter( object ) {
    var groupObject = object;
    while ( !( groupObject instanceof THREE.Group ) ) {
      groupObject = groupObject.parent;
    }

    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject( groupObject );
    const center = new THREE.Vector3();
    boundingBox.getCenter( center );

    return center;
  }

  /**
   * Gets the barycenter of an object/group of objects.
   * @param {*} objects 
   * @returns THREE.Vector3
   */
  getBarycenter( objects ) {
    var groupObjects = objects;
    const groupObjectsCenter = []
    const center = new THREE.Vector3()
    
    groupObjects.forEach( groupObject => {
      while ( !( groupObject instanceof THREE.Group ) ) {
        groupObject = groupObject.parent;
      }
      
      const boundingBox = new THREE.Box3();
      boundingBox.setFromObject( groupObject );
      const center = new THREE.Vector3();
      boundingBox.getCenter( center );
      
      groupObjectsCenter.push( center );
    } )

    // Find barycenter of object centers
    groupObjectsCenter.forEach( object => {
      center.x += object.x;
      center.y += object.y;
      center.z += object.z;
    } )

    center.x = center.x / 3;
    center.y = center.y / 3;
    center.z = center.z / 3;

    return center
  }

  /**
   * Get camera position an rotation.
   * @param { object } camera 
   * @returns object
   */
  getCameraData( camera ) {
    const cameraData = {
      position: [ camera.position.x, camera.position.y, camera.position.z ],
      rotation: [ camera.rotation.x, camera.rotation.y, camera.rotation.z ]
    }

    return cameraData;
  }

  /**
   * Sets new camera position and rotation.
   * @param { object } camera 
   * @param { object } cameraData 
   */
  setCamera( camera, cameraData ) {
    camera.position.set( cameraData.position[ 0 ], cameraData.position[ 1 ],
      cameraData.position[ 2 ] );
    camera.rotation.set( cameraData.rotation[ 0 ], cameraData.rotation[ 1 ],
      cameraData.rotation[ 2 ]);
  }

  /**
   * Updates the autofilllists in IndexedDB.
   * @param { object } storeName 
   * @param { object } item 
   */
  async updateAutoFillList( storeName, item ) {
    const newEditor = {};

      const editorsFromDB = await fromOfflineDB.getAllObjects('AutoFillLists', 
        storeName);
      if ( editorsFromDB.length > 0 ) {
        let hasItem = false;
        
        editorsFromDB.forEach( element => {
          if ( element.item == item ) {
            hasItem = true;
          }
        })
        if ( !hasItem && item != '' ) {
          newEditor._id = String(Date.now())
          newEditor.item = toRaw(item)
        }
      } else if ( item != '' ) {
        newEditor._id = String(Date.now())
        newEditor.item = toRaw(item)
      }
      if ( !!Object.keys(newEditor).length ) {
        await fromOfflineDB.addObject(newEditor, 'AutoFillLists', storeName)
      }
  }

  /**
   * Updates positions and autofill lists in IndexedDB
   * @param { any } root 
   * @param { any } t 
   * @param { object } posInfo 
   */
  async savePosition( root, t, posInfo ) {

    //convert from vue proxy to JSON object
    const rawPosition = toRaw(posInfo);
    rawPosition.count = Number(rawPosition.count);
    rawPosition.lastChanged = Date.now();
    
    var positionFromDb = await fromOfflineDB.getObject(rawPosition._id, 'Positions', 'positions');
    if ( positionFromDb.hasSubNumber ) {
      var newSubNumber = this.calcSubNumber(rawPosition, positionFromDb);
      rawPosition.subNumber = newSubNumber;
    } else {
      rawPosition.subNumber = '';
    }

    await fromOfflineDB.updateObject(rawPosition, 'Positions', 'positions');

    this.updateAutoFillList( 'datings', posInfo.dating )
    this.updateAutoFillList( 'titles', posInfo.title )
    this.updateAutoFillList( 'materials', posInfo.material )
    this.updateAutoFillList( 'editors', posInfo.addressOf )

    root.vtoast.show({ message: t('saveSuccess')});
  }

  /**
   * Calculates a new SubNumber for a position.
   * @param { object } curPos 
   * @param { object } prevPos 
   * @returns 
   */
  calcSubNumber(curPos, prevPos) {
    if (prevPos == undefined) {
      return 1;
    }

    if (prevPos.positionNumber < curPos.positionNumber) {
      return 1;
    }
    
    var subNumber = prevPos.subNumber;

    if (
      curPos.placeID == prevPos.placeID &&
      curPos.positionNumber == prevPos.positionNumber &&
      curPos.right == prevPos.right &&
      curPos.up == prevPos.up &&
      curPos.height == prevPos.height &&
      curPos.dating == prevPos.dating &&
      curPos.title == prevPos.title &&
      curPos.date == prevPos.date &&
      !curPos.isSeparate) {
      return parseInt(subNumber);
    }

    return parseInt(subNumber) + 1;
  }

  /**
   * Updates the color value of a button.
   * @param { object } e 
   * @param { object } leftDrawer 
   */
  updateBtnColor( e, leftDrawer ) {
    if(e) {
      switch(e) {
        case "btn1":
          if (leftDrawer.btnColors[0] == "background") {
            leftDrawer.btnColors[0] = "transparent"
          } else {
            leftDrawer.btnColors[0] = "background"
          }
          leftDrawer.btnColors[1] = "transparent"
          leftDrawer.btnColors[2] = "transparent"
          leftDrawer.btnColors[3] = "transparent"
          break;
        case "btn2":
          leftDrawer.btnColors[0] = "transparent"
          if (leftDrawer.btnColors[1] == "background") {
            leftDrawer.btnColors[1] = "transparent"
          } else {
            leftDrawer.btnColors[1] = "background"
          }
          leftDrawer.btnColors[2] = "transparent"
          leftDrawer.btnColors[3] = "transparent"
          break;
        case "btn3":
          leftDrawer.btnColors[0] = "transparent"
          leftDrawer.btnColors[1] = "transparent"
          if (leftDrawer.btnColors[2] == "background") {
            leftDrawer.btnColors[2] = "transparent"
          } else {
            leftDrawer.btnColors[2] = "background"
          }
          leftDrawer.btnColors[3] = "transparent"
          break;
        case "btn4":
          leftDrawer.btnColors[0] = "transparent"
          leftDrawer.btnColors[1] = "transparent"
          leftDrawer.btnColors[2] = "transparent"
          if (leftDrawer.btnColors[3] == "background") {
            leftDrawer.btnColors[3] = "transparent"
          } else {
            leftDrawer.btnColors[3] = "background"
          }
          break;
        default:
          console.log("error")
      }
    }
  }

  /**
   * Gets loaded new objects.
   * @param { object } alreadyLoadedIDs 
   * @param { object } objectsInDB 
   * @param { object } objectsToBeLoaded 
   */
  getNewObjects( alreadyLoadedIDs, objectsInDB, objectsToBeLoaded ) {
    alreadyLoadedIDs.forEach( id => {
      objectsInDB.forEach( object => {
        if ( id != object._id ) {
          objectsToBeLoaded.push( object )
        } else {
        }
      } )
    } )
  }

  /**
   * Gets loaded old objects.
   * @param { object } alreadyLoadedIDs 
   * @param { object } objectsInDB 
   * @returns 
   */
  getOldObject( alreadyLoadedIDs, objectsInDB ) {
    return alreadyLoadedIDs.filter( x => !objectsInDB.includes( x ) )
  }

  /**
   * Compares ids with place ids in local storage.
   * @param {*} arrayToBeChecked 
   */
  checkIDs( arrayToBeChecked ) {
    arrayToBeChecked.forEach( arrA => {
      if ( !exParams.main.objects.place._ids.some( id => id === arrA._id ) ) {
        objectsToBeLoaded.push( arrA )
      }
    } );
  }

}