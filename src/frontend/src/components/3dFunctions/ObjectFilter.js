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
}