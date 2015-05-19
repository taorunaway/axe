var express = require('express');
var router = express.Router();
var users = require('../db/users');
var models = require('../db/messages');
var debug = require('debug')('axe:routes:messages');
var _ = require('underscore');

router.get('/', function(req, res,next) {
  models.list(req.query,"id,name,description,event_type,response_type,response_data",function(err,results){
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
    model.update_by = req.session.user.user_name;
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
router.put('/:id',function(req,res,next){
  var updates = req.body;
  updates.id = req.params.id;
  delete updates.create_at;
  delete updates.create_by;
  debug(updates);
  if(req.session.user){
    updates.create_by = req.session.user.user_name;
    updates.update_by = req.session.user.user_name;
  }
  updates.update_at = new Date();
  models.update(updates,function(err,returns){
    if(err){next(err);}else{res.json(returns);}
  });
});
router.delete('/:id',function(req,res){
  var id = req.params.id;
  models.delete(id,function(err,returns){
    if(err){next(err);}else{res.json({});}
  });
});



module.exports = router;
