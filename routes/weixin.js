var express = require('express');
var router = express.Router();
var my_util = require('../util/util');
var config  = require('../config');
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  var querys = [config.weixin_token,req.query.timestamp,req.query.nonce];
  querys.sort();
  console.log('called weixin------');
  console.log(querys);
  var tmpstr = querys.join('');
  var my_v = my_util.hashSha1(tmpstr);
  console.log(my_v);
  if(req.query.signature  == my_v){
    res.send(req.query.echostr);
  }else{
    res.send('');
  }
});
module.exports = router;