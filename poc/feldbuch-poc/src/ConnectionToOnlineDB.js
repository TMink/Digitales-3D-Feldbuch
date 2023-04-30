/**
 * Function overview:
 *  getData    - Gets the data based on given parameters
 *  getPreview - Gets a preview of stored data for preview purposes
 */

import axios from 'axios';

export { onlineConnection }

class ConnectionToServer {

  /**
   * 
   * @param {String} url
   * @param {String} dataCategory  - Category that is searched for
   * @param {String} identifier    - Term that is searched for
   * @returns -> Promise(object)
   */
  async getData( url, dataCategory, identifier ) {
    
    return new Promise( (resolve, reject) => {
        
      try {
            
        axios
        .get( url )
        .then( res => {
                
          const data = []
          switch( dataCategory ) {
            case 'id':
                
              for( var i=0; i < res.data.length; i++) {
                if( res.data[i].id == identifier ) {
                  data.push( res.data[i] )
                }
              }
              break;
                        
            case 'title':
              for( var i=0; i < res.data.length; i++) {
                if( res.data[i].title == identifier ) {
                  data.push( res.data[i] )
                }
              }
              break;
              
            default:
              break;
          }
                
          resolve( data );
                
        } )
            
      }
      catch( error ) {
            
        console.log( error );
            
      }
        
    })
    
  }

  /**
   * @param {String} url 
   * @returns -> Promise(object)
   */
  async getPreview( url ) {
    
    return new Promise( (resolve, reject) => {
        
      try {
            
        axios
        .get( url )
        .then( res => {
                
          const preview = [];
                
          for( var i=0; i < res.data.length; i++ ) {
            preview.push( {id: res.data[i].id, title: res.data[i].title} )
          }
                
          resolve( preview );
                
        } )
            
      }
      catch( error ) {
            
        console.log( error );
            
      }
        
    })
    
  }

}

const onlineConnection = new ConnectionToServer();