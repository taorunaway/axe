define(['jquery','underscore','backbone','modal','simpleForm','button'],function($,_,Backbone,modal,Form,Button){
  var View = Backbone.View.extend({
    el:'#content',
    initialize:function(){

    },
    events:{
      'click #login':'login',
      'keydown #password,#user_name':'keydown'
    },
    check_user :function(cb){
      if(this.user){
        //this.show_info(this.user);
        cb(this.user);
        return;
      }
      var that = this;
      $.ajax({
        type:'get',
        url:'/accounts/me',
        cache:false,
        success:function(d){
          if(d.user){
            that.user = d.user;
            that.show_info(that.user);
          }
          cb(that.user);
        },
        error:function(){
          cb(null);
        }
      });
    },
    show_info:function(user){
      var name = user.real_name || user.user_name;
      var html = '<p>hi~'+ name +'，欢迎来到温州主要产品指数系统<a href="#logout">【注销】</a></p>';
      $('#user_banner').html(html);
    },
    show:function(cb){
      this.callback = cb;
      this.check_user(function(user){
        if(user){
          cb(user);
          return;
        }
        $.ajax({
          url:'/accounts/login',
          type:'get',
          cache:false,
          success:function(d){
            modal.show({title:'请登录',body:d},'#content',{hide_close:true,buttons:[{id:'login',name:'登录'}]});
          },
          error:function(){
            modal.show('#content','网络错误');
          }
        });
      });

    },
    keydown:function(e){
      if (e.keyCode == 13) {
        $('#login').click();
      }
    },
    login:function(e){
      var btn = new Button($(e.currentTarget)).loading('登录中...');
      var f = new Form('#login_fields');
      var x = f.getFields();
      modal.message('');
      var that = this;
      $.ajax({
        type:'post',
        url:'/accounts/login',
        dataType:'json',
        data:x,
        success:function(d){
          if(d.s){
            that.user = d.user;
            that.show_info(that.user);
            that.callback(d.user);
            btn.reset('登录成功');
            modal.message('登录成功');
            setTimeout(function(){
              modal.hide();
            },800);
          }else{
            btn.reset();
            modal.message(d.m);
            if(d.vali){
              modal.message(d.vali);
            }
          }
        }
      });
    },
    logout:function(cb){
      var that = this;
      $.ajax({
        url:'/accounts/logout',
        type:'post',
        dataType:'json',
        success:function(d){
          if(d.s){
            modal.show({body:'<p>您已成功退出登录状态,请关闭窗口或</p><br/><a href="#home">【重新登录】</a> '},'#content',{hide_close:true});
            delete that.user;
            cb();
          }
        }
      });
    }
  });
  return new View();
});

