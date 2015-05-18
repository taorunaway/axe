define(['jquery','underscore','backbone','modal','button','text!htmls/account.html','app/models/user','util','simpleForm'],function($,_,Backbone,modal,Button,html,User,util,Form){
  var View = Backbone.View.extend({
    el:'#account_view',
    initialize:function(){
      this.template = _.template(html);
      this.user = new User();
      this.listenTo(this.user,'sync',this.render);
      this.listenTo(this.user,'error',util.fetchError);
    },
    events:{
      'click #save':'save',
      'click #account_nav a':'nav',
      'click #do_change':'do_change'
    },
    nav:function(e){
      e.preventDefault();
      var t  = $(e.currentTarget);
      if(!t.hasClass('m-active')){
        var h = $('#account_nav .m-active').removeClass('m-active').data('t');
        console.log(h);
        $(h).hide();
        $(t.addClass('m-active').data('t')).show();
      }
    },
    show:function(user){
      this.user.set('id',user.id);
      this.user.fetch({data:{_:Math.random()}});
    },
    render:function(user){
      this.$el.html(this.template(user.toJSON()));
    },
    save:function(e){
      var form = new Form('#account_fields');
      var attrs = form.getFullFields();
      var btn = new Button('#save').loading();
      this.user.save(attrs,{success:function(){
        modal.show({body:'保存成功'});
        btn.reset();
      }});
    },
    do_change:function(e){
      var form = new Form('#pass_fields');
      var attrs = form.getFullFields();
      if(!attrs.password ){
        modal.show('请输入密码',this.$el);
        return;
      }
      if(!attrs.new_password){
        modal.show('请输入新密码',this.$el);
        return;
      }
      if(!attrs.confirm_password){
        modal.show('请重复输入新密码',this.$el);
        return;
      }
      if(attrs.new_password != attrs.confirm_password){
        modal.show('两次输入的密码不同',this.$el);
        return;
      }
      var btn = new Button($(e.currentTarget)).loading('修改中...');
      $.ajax({
        type:'POST',
        url:'/accounts/password',
        data:attrs,
        dataTye:'json',
        success:function(d){
          modal.show( d.s ? '更新密码成功' : '更新密码失败：'+ d.m,'#account_view');
          btn.reset();
        },
        error:function(){
          modal.show( '出错了，请重试','#account_view');
          btn.reset();
        }
      });
    }
  });
  return new View();
});

