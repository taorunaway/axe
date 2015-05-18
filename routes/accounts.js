var express = require('express');
var router = express.Router();
var users = require('../db/users');
var myUtil = require('../util/util');
var accountUtil = require('../util/account_util');
var _ = require('underscore');


router.get('/login', function(req, res,next) {
    req.session.login_failed = req.session.login_failed || 1;
    res.render('login');
});
router.post('/login',function(req,res,next){
    if(!req.session.login_failed){
        res.json({s:false,m:'请刷新页面'});
        return;
    }else{
      login_user(req,res);
    }

});
var login_user = function(req,res){
  var user_name = req.body.user_name;
  var password = req.body.password;
  if(!user_name || !password){
    req.session.login_failed++;
    res.json({s:false,m:!user_name ? '请输入登陆账号' : '请输入密码'});
    return;
  }
  users.loginAble(user_name,password,function(err,user){
    console.log(err,user);
    if(err){
      req.session.login_failed++;
      //res.render('accounts/login',{info:'系统错误',vali:req.session.login_failed >= 6});
      res.json({s:false,m:'系统错误'});
    }else if(!user){
      req.session.login_failed++;
      res.json({s:false,m:'账号或密码不正确'});
    }else{
      if(user.status === 1){
        delete req.session.login_failed;
        accountUtil.login(user,req,res);
        res.json({s:true,user:user});
      }else{
        req.session.login_failed++;
        res.json({s:true,m:'该帐号已经被禁用了！'});
      }
    }
  });
}
router.post('/logout',function(req,res,next){
    accountUtil.logout(req,res);
    res.json({s:true});
})
router.post('/password',function(req,res,next){
    if(!req.session.user){
        res.json({s:false,m:'你已经退出了登录状态'});
        return;
    }
    var password = req.body.password;
    var new_password = req.body.new_password;
    if(!password || !new_password){
        res.json({s:false,m:'请输入原来的密码和新密码'});
        return;
    }else if(new_password.length < 6 || new_password.length > 20){
        res.json({s:false,m:'密码的长度为6-20'});
        return;
    }
    users.changePassword(req.session.user.user_name,password,new_password,function(err,user){
       if(err){
           res.json({s:false,m:err.message});
       }else{
           res.json({s:true});
       }
    });
});
router.get('/me',accountUtil.gen_auth,function(req,res){
  res.json({s:!!req.session.user,user:req.session.user});
});

module.exports = router;
