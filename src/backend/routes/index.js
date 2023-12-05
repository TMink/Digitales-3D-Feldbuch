/**
 * @ Author: Julian Hardtung
 * @ Create Time: 20.04.2023 17:59:15
 * @ Modified by: Julian Hardtung
 * @ Modified time: 05.12.2023 11:08:27
 * 
 * Backend test route
 */

var express = require('express');
var router = express.Router();

router.get("/", function(request, response) {
  //getDbInfo();
  //insert_doc({nano: true}, 0);
  response.send("Testrouting")
  
});


module.exports = router;
