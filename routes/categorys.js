var express = require('express');
var router = express.Router();
var path = require('path');
var categorys = require('../db/categorys');
router.get('/', function(req, res, next) {
  var q = req.query || {};
  q.sort = 'pcode-asc-nulls-first,the_order-asc';
  categorys.query(q,null,function(err,r){
    if(err){next(err);}else {res.json(r);}
  });
});
router.post('/',function(req,res,next){
  var ps = req.body;
  ps.create_by = req.session.user.user_name;
  ps.update_by = req.session.user.user_name;
  ps.id = ps.code;
  delete ps.code;
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
  props.update_at = new Date();
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
