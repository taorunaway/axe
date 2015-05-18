var crypto = require('crypto');
var config = require('../config');
var users = require('../db/users');

function encrypt(str, secret) {
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
}
function decrypt(str, secret) {
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}
var gen_session = exports.gen_session = function(user,req){
  var u = {
    id:user.id,
    user_name:user.user_name,
    role:user.role,
    real_name:user.real_name
  }
  req.session.user = u;
}
exports.login = function(user,req,res){
    gen_session(user,req);
    var auth_token = encrypt(user.id + '\t' + user.user_name, config.session_secret);
    res.cookie(config.auth_cookie_name, auth_token, {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30}); //cookie 有效期30天
}
exports.logout = function(req,res){
    req.session.destroy(function(err){});
    res.clearCookie(config.auth_cookie_name);
}
exports.gen_auth = function(req,res,next){
  if(req.session.user){
    return next();
  }
  var cookie = req.cookies[config.auth_cookie_name];
  if (cookie) {
    var auth_token = decrypt(cookie, config.session_secret);
    var auth = auth_token.split('\t');
    var user_id = auth[0];
    users.item(user_id,function(err,user){
      if(err || !user || user.status != 1){
        next();
      } else{
        gen_session(user,req);
        next();
      }
    });
  }else{
    next();
  }
}
//必须登陆的页面，否则跳转到登陆页面
exports.auth = function(req,res,next){
    if(req.session.user){
        return next();
    }
    var cookie = req.cookies[config.auth_cookie_name];
    if (cookie) {
        var auth_token = decrypt(cookie, config.session_secret);
        var auth = auth_token.split('\t');
        var user_id = auth[0];
        users.item(user_id,function(err,user){
            if(err){
                next(err);
            } else if(user && user.status == 1){
                gen_session(user,req);
                next();
            }else{
                var error = new Error('没有登录');
                error.status = 403;
                next(error);
            }
        });
    }else{
      var error = new Error('没有登录');
      error.status = 403;
      next(error);
    }
}
exports.role_reporter = function(req,res,next){
  if(req.session.user.role == 'reporter'){
    next();
  }else{
    var error = new Error('没有相应的权限');
    error.status = 403;
    next(error);
  }
}
exports.role_admin = function(req,res,next){
  if(req.session.user.role == 'admin'){
    next();
  }else{
    var error = new Error('没有相应的权限');
    error.status = 403;
    next(error);
  }
}
exports.role_admin_reproter_id = function(req,res,next){
  if(req.session.user.role == 'admin' || (req.session.user.role == 'reporter' && req.param('id') == req.session.user.id)  ){
    next();
  }else{
    var error = new Error('没有相应的权限');
    error.status = 403;
    next(error);
  }
}