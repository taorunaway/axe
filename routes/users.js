var express = require('express');
var router = express.Router();
var users = require('../db/users');
var myUtil = require('../util/util');
var account_util = require('../util/account_util');
/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  users.list(req.query,'id,user_name,real_name,sex,role,role_code,cell_phone,office_phone,short_phone,email,create_at',function(err,users){
    if(err){next(err);return;}
    users.query = req.query;
    res.json(users);
  });
});
router.get('/:id',function(req,res,next){
  users.item(req.params.id,function(err,user){
    if(err){
      next(err);
    }else{
      res.json(user);
    }
  })
});
router.post('/',account_util.role_admin,function(req,res,next){
  var ps = req.body;
  ps.create_by = req.session.user.user_name;
  ps.lastupdate_by = req.session.user.user_name;
  ps.password = myUtil.md5(req.body.password);
  users.create(ps,function(err,user){
    if(err){
      next(err);
    }else{
      delete user.password;
      res.json(user);
    }
  })
});
router.put('/:id',account_util.role_admin_reproter_id,function(req,res,next){
  var props = req.body;
  delete props.create_at;
  delete props.create_by;
  delete props.user_name;
  delete props.last_changepass_at;
  delete props.last_login_at;
  delete props.password;
  props.lastupdate_by = req.session.user.user_name;
  props.lastupdate_at = new Date();
  users.update(props,function(err,user){
    if(err){
      next(err);
    }else{
      if(req.session.user.id == req.params.id){
        account_util.gen_session(user,req);
      }
      res.json(user);
    }
  });
});


module.exports = router;
