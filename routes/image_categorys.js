var express = require('express');
var router = express.Router();
var path = require('path');
var categorys = require('../db/image_categorys');
router.get('/', function(req, res, next) {
  categorys.query({sort:'the_order_asc'},null,function(err,r){
    if(err){next(err);}else {res.json(r);}
  });
});
router.post('/',function(req,res,next){
  var ps = req.body;
  ps.create_by = req.session.user.user_name;
  ps.update_by = req.session.user.user_name;
  categorys.create(ps,function(err,model){
    if(err){
      next(err);
    }else{
      res.json(model);
    }
  })
});
router.put('/:id',function(req,res,next){
  var props = req.body;
  props.update_by = req.session.user.user_name;
  props.lastupdate_at = new Date();
  categorys.update(props,function(err,m){
    if(err){
      next(err);
    }else{
      res.json(m);
    }
  });
});
router.delete('/:id',function(req,res,next){
  categorys.delete(req.params.id,function(err){
    if(err){next(err)}else{res.json({})}
  });
});
module.exports = router;
