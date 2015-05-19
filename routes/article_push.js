var express = require('express');
var router = express.Router();
var users = require('../db/users');
var models = require('../db/article_push');
var debug = require('debug')('axe:routes:article_push');
var _ = require('underscore');

router.get('/', function(req, res,next) {
  models.list(req.query,'id,create_at,create_by,push_type',function(err,results){
    if(err){
      next(err);
    }else{
      results.query = req.query;
      res.json(results);
    }
  });
});
router.post('/',function(req,res,next){
  var model = req.body;
  model.id = req.body.code;
  if(req.session.user){
    model.create_by = req.session.user.user_name;
  }
  models.create(model,function(err,returns){
    if(err){next(err);}else{res.json(returns);}
  });
});
router.get('/:id',function(req,res,next){
  models.item(req.params.id,function(err,model){
    if(err){next(err)}else{res.json(model);}
  });
});


module.exports = router;
