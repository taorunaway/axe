var express = require('express');
var router = express.Router();
var path = require('path');
var models = require('../db/images');
var multer = require('multer');
var debug = require('debug')('axe:routes:images');

router.get('/browser', function(req, res, next) {
  var callback = req.query.CKEditorFuncNum;
  res.render('images',{callback:callback});
});
router.get('/',function(req,res,next){
  models.list(req.query,'',function(err,r){
    if(err){next(err)}else{r.query = req.query;res.json(r);}
  });
});
router.post('/',multer({ dest: path.join(__dirname,'../public/uploads'),files:1,rename: function (fieldname, filename) {
  console.log(fieldname,filename);
  return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
}}),function(req,res,next){
  var attrs = req.body;
  attrs.category = attrs.category || 1;
  attrs.create_by = attrs.update_by = req.session.user.user_name;
  attrs.thumbnail = '/uploads/'+req.files.upload.name;
  attrs.url = '/uploads/'+req.files.upload.name;
  debug(req.files.upload);
  models.create(attrs,function(err,item){
    if(err){
      res.send('系统错误');
    }else{
      if(req.query.CKEditor){
        var callback = req.query.CKEditorFuncNum;
        var x  ='<html><body><script type="text/javascript">window.parent.CKEDITOR.tools.callFunction('+callback+', "'+ attrs.url +'","");</script></body></html>';
        res.send(x);
      }else{
        res.send('1');
      }
    }
  });

});
router.put('/:id',function(req,res,next){
  var attrs = req.body;
  delete attrs.create_at;
  delete attrs.create_by;
  attrs.update_at = new Date();
  attrs.update_by = req.session.user.user_name;
  models.update(attrs,function(err,r){
    if(err){next(err)}else{res.json(r);}
  });
})
router.delete('/:id',function(req,res,next){
  models.delete(req.params.id,function(err){
    if(err){next(err)}else{res.json({})}
  });
});

module.exports = router;
