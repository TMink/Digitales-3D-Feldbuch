var express = require('express');
var router = express.Router();

router.get("/", function(request, response) {
  //getDbInfo();
  //insert_doc({nano: true}, 0);
  response.send("Testrouting")
  
});


module.exports = router;
