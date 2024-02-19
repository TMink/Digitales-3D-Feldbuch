/*
 * Created Date: 15.01.2024 14:52:11
 * Author: Tobias Mink
 * 
 * Last Modified: 23.01.2024 16:24:34
 * Modified By: Tobias Mink
 * 
 * Description: 
 */

import { UpdateIndexedDB } from './UpdateIndexedDB.js'
import { fromOfflineDB } from '../../ConnectionToOfflineDB.js'

export class ObjectFilter {

  async fieldSearch( typeSize, chosenObjects, inputs, menues, infos ) {
    const areNull = [];
    const notNull = [];
    var layers = [];

    /* Determin which field is 'null' and which is not */
    for ( let a = 0; a < typeSize; a++ ) {
      if ( inputs[ a ] == null ) {
        areNull.push( a );
      } else {
        notNull.push( a );
      }
    }

    this.stringReplacer( typeSize, areNull );

    /* No empty fields */
    if ( notNull.length == typeSize ) {
      this.choseObjects( typeSize, chosenObjects, inputs, infos )
    }

    /* Only empty fields */
    else if ( areNull.length == typeSize ) {
      this.resetFilter( infos, menues );
    }

    /* Only one given field */
    else if ( notNull.length == 1 ) {
      for ( let b = 0; b < infos.length; b++ ) {
        this.fillAll( menues[ notNull[ 0 ] ], infos[ b ][ notNull[ 0 ] ] );
        layers.push( [infos[ b ][ notNull[ 0 ] ], inputs[ notNull[ 0 ] ]] );
        for( let c = 0; c < areNull.length; c++ ) {
          this.layering( layers, menues[ areNull[ c ] ], 
          infos[ b ][ areNull[ c ] ]);
        }
        layers = [];
      }
    }

    /* Unkown number of given and empty fields */
    else if ( notNull.length > 1 ) {
      for ( let d = 0; d < infos.length; d++ ) {
        for ( let e = 0; e < notNull.length; e++ ) {
          for ( let f = 0; f < notNull.length; f++ ) {
            if ( f != e ) {
              layers.push( [ infos[ d ][ notNull[ f ] ], 
                inputs[ notNull[ f ] ] ] );
            }
          }
          this.layering( layers, menues[ notNull[ e ] ], 
            infos[ d ][ notNull[ e ] ]);
          layers = [];
        }
        for ( let g = 0; g < areNull.length; g++ ) {
          for ( let h = 0; h < notNull.length; h++ ) {
            layers.push( [ infos[ d ][ notNull[ h ] ], 
                           inputs[ notNull[ h ] ] ] );
          }
          this.layering( layers, menues[ areNull[ g ] ], 
                         infos[ d ][ areNull[ g ] ] );
          layers = [];
        }
      }
    }
  }

  layering( layer, all, infoBlockItem ) {
    const layercount = layer.length;
    let check = true;

    for ( let i=0; i < layercount; i++ ) {
      if( !( layer[i][0] == layer[i][1] ) ) {
        check = false;
        break;
      }
    }

    if ( check ) {
      this.fillAll( all, infoBlockItem );
    }
  }

  fillAll( list, blockItem ) {
    if (!list.includes(blockItem)) {
      list.push(blockItem);
    }
  }

  resetFilter( infos, menues ) {
    for ( let a = 0; a < infos.length; a++ ) {
      for ( let b = 0; b < menues.length; b++ ) {
        this.fillAll(menues[ b ], infos[ a ][ b ]);
      }
    }

    for ( let c = 0; c < menues.length; c++ ) {
      menues[c].sort();
    }
  }

  async getPlaceObjectInfo( placeObject, placeObjectsInScene ) {
    for ( let i=0; i < placeObjectsInScene.length; i++) {
      // const objectID = placeObjectsInScene[ i ].modelID;
      const objectID = placeObjectsInScene[ i ]._id;
      const objectInDB = await fromOfflineDB.getObject(objectID, 'Models', 
        'places');

      if ( !placeObject.allNumbers.includes(objectInDB.modelNumber) ) {
        placeObject.allNumbers.push(objectInDB.modelNumber);
      }

      if ( !placeObject.allTitles.includes(objectInDB.title) ) {
        placeObject.allTitles.push(objectInDB.title);
      }

      /* For the filter algorithm to work properly */
      const objectIDArray = [objectInDB._id]
      const newObject = [
        objectInDB.modelNumber,
        objectInDB.title,
        objectIDArray,
        objectInDB.color,
        objectInDB.opacity
      ]

      placeObject.infoBlock.push(newObject)
    }
  }

  async getPositionDataInfo( positionData, positionObjectsInScene ) {
    const positionIDs = [];

    for ( let i=0; i < positionObjectsInScene.length; i++) {
      const positionID = positionObjectsInScene[i].positionID
      const positionInDB = await fromOfflineDB.getObject(positionID, 'Positions', 'positions')

      if ( !positionIDs.includes(positionID) ) {

        if (!positionData.allNumbers.includes(positionInDB.positionNumber)) {
          positionData.allNumbers.push(positionInDB.positionNumber)
        }
        if (!positionData.allSubNumbers.includes(positionInDB.subNumber)) {
          positionData.allSubNumbers.push(positionInDB.subNumber)
        }
        if (!positionData.allTitles.includes(positionInDB.title)) {
          positionData.allTitles.push(positionInDB.title)
        }

        const newPosition = [
          positionInDB.positionNumber,
          positionInDB.subNumber,
          positionInDB.title,
          positionInDB.models
        ]

        positionData.infoBlock.push(newPosition)

        positionIDs.push(positionID)
      }
      
    }
  }

  async getPositionObjectInfo( positionData, positionObject ) {
    for ( let i=0; i < positionData.chosenPositionModels.length; i++) {
      const objectID = positionData.chosenPositionModels[ i ];
      const objectInDB = await fromOfflineDB.getObject(objectID, 'Models', 'positions')

      if ( !positionObject.allNumbers.includes(objectInDB.modelNumber) ) {
        positionObject.allNumbers.push(objectInDB.modelNumber)
      }

      if ( !positionObject.allTitles.includes(objectInDB.title) ) {
        positionObject.allTitles.push(objectInDB.title)
      }

      /* For the filter algorithm to work properly */
      const objectIDArray = [objectInDB._id]
      const newObject = [
        objectInDB.modelNumber,
        objectInDB.title,
        objectIDArray,
        objectInDB.color,
        objectInDB.opacity
      ]

      positionObject.infoBlock.push(newObject)
    }
  }

  choseObjects( typeSize, choseObjects, inputs, infos ) {
    let isChosen = true;

    for ( let a = 0; a < infos.length; a++ ) {
      isChosen = true;

      for ( let b = 0; b < typeSize; b++ ) {
        if( !( infos[a][b] == inputs[b] ) ) {
          isChosen = false;
          break;
        }
      }

      if( isChosen ) {
        infos[a][typeSize].forEach( ( elem ) => {
          choseObjects.push( elem );
        } );
      }
    }
  }

  resetObjectInfo2Input( positionObject ) {
    positionObject.number = null;
    positionObject.title = null;
    positionObject.infoBlock = [];
  }

  resetObjectInfo2( positionObject ) {
    positionObject.allNumbers = [];
    positionObject.allTitles = [];
    positionObject.chosenfinalModel = [];
  }

  resetPlaceObjectInfo( placeObject ) {
    placeObject.allNumbers = [];
    placeObject.allTitles = [];
    placeObject.chosenfinalModel = [];
  }

  resetPositionInfo2( positionData ) {
    positionData.allNumbers = [];
    positionData.allSubNumbers = [];
    positionData.allTitles = [];
    positionData.chosenPositionModels = [];
  }

  resetPositionMods( positionObject, positionMods, scene ) {
    const updateIndexedDB = new UpdateIndexedDB()
    
    positionObject.chosenfinalModelGroup = null;
    positionMods.disabled = true;
    updateIndexedDB.updateObjectOpacityAndColor( 
      positionObject.chosenfinalModel[ 0 ], 'positions', scene );
    positionObject.chosenfinalModelGroup = null;
    positionMods.colorPicker.color = null;
    positionMods.opacitySliderValue = 0;
    positionMods.token = false;
  }

  resetPlaceMods( placeObject, placeMods, scene ) {
    const updateIndexedDB = new UpdateIndexedDB()
    
    placeMods.token = false;
    placeMods.disabled = true;
    updateIndexedDB.updateObjectOpacityAndColor(
      placeObject.chosenfinalModel[ 0 ], 'places', scene);
    placeMods.chosenfinalModelGroup = null;
    placeMods.colorPicker.color = null;
    placeMods.opacitySliderValue = 0;
  }

  /**
    * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    * # DEBUGGING
    * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
    */

  setCharAt( str, index, chr ) {
    if ( index > str.length - 1 ) return str;
    return str.substring( 0, index ) + chr + str.substring( index + 1 );
  }

  stringReplacer( typeSize, areNull ) {
    let str = '';

    for ( let a = 0; a < typeSize; a++ ) { 
      
      if ( areNull.includes(a) ) {
        str += '_'
      } else {
        str += 'x';
      }

      if ( a+1 < typeSize ) {
        str += ' , ';
      }
    }

    if ( str.toLowerCase().indexOf("x") === 0) {
      if ( str.toLowerCase().indexOf("_") === -1 ) {
        console.log( "( " + str + " ) - done!")
      } else {
        console.log( "( " + str + " )" );
      }
    }
  }
  
}