define(['jquery','underscore','backbone','modal','app/views/login'],function($,_,Backbone,modal,loginView){
    var Workspace = Backbone.Router.extend({
        routes:{
            '':'home',
            'home':'show',
            'logout':'logout',
            'account':'show',
            'users':'show',
            'categorys':'show',
            'images':'images',
            'articles':'show',
            'articles/new':'new_article',
            'articles/:id':'article',
            'article_push':'show',
            'messages':'show',
            'menus':'show'
        },
        initialize:function(){

        },
        home:function(){
          this.initViewContent('home');
          this.getView('home');
        },
        show:function(){
          var ix = window.location.href.indexOf('#');
          var view = ix < 0 ? 'home':window.location.href.substr(ix+1);
          this.initViewContent(view);
          this.getView(view);
        },
        images:function(){
          this.initViewContent('images');
          var that = this;
          loginView.show(function(user){
            if(!user){
              return;
            }
            that.user = user;
            that.initiNavs(user);
            $('.m-nav .m-active').removeClass('m-active');
            $('.m-nav  a[href="#images"]').addClass('m-active');
            if(that.images_view){
              that.images_view.show(user);
            }else{
              require(['app/views/images'],function(View){
                that.images_view = new View({el:'#images_view',show_edit:true});
                that.images_view.show(user)
              });
            }
          });
        },
        new_article:function(){
          this.initViewContent('article');
          this.getView('article','show_new');
        },
        article:function(id){
          this.initViewContent('article');
          this.getView('article','show',[id]);
        },
        logout:function(){
            var that = this;
            loginView.logout(function(){
              delete that.naved
              delete that.user;
            });
          },
        initViewContent:function(view_name){
            view_name += '_view';
            $('#content .m-view').hide();
            if($('#content #' + view_name).length <= 0){
                $('#content').prepend('<div id="'+ view_name +'" class="m-view"><div class="content"><img src="/images/loading.gif" class="u-loading"/></div></div>')
            }else{
                $('#content #' + view_name).html('<div class="content"><img src="/images/loading.gif" class="u-loading"/></div>');
            }
            $('#content #' + view_name).show();
        },
        getView:function(viewname,call,params){
          call = call || 'show';
          var that = this;
          loginView.show(function(user){
            if(!user){
              return;
            }
            that.user = user;
            that.initiNavs(user);
            $('.m-nav .m-active').removeClass('m-active');
            $('.m-nav  a[href="#'+viewname+'"]').addClass('m-active');
            var ps = params || [];
            ps.push(that.user);
            require(['app/views/' + viewname],function(view){
              view[call].apply(view,ps);
            });
          });
        },
        initiNavs:function(user){
          if(this.naved){
            return;
          }
          $('.m-nav ul li:gt(0)').remove();
          $('.m-nav ul').append('<li><a href="#articles" hidefocus="true">文章管理</a></li><li><a href="#categorys" hidefocus="true">文章分类</a></li><li><a href="#images" hidefocus="true">图片管理</a></li><li><a href="#article_push" hidefocus="true">文章推送</a></li><li><a href="#messages" hidefocus="true">消息管理</a></li><li><a href="#menus" hidefocus="true">菜单管理</a></li>');
          if(user.role =='admin'){
            //<li><a href="#products" hidefocus="true">产品类目</a></li>
            $('.m-nav ul').append('<li><a href="#users" hidefocus="true">用户管理</a></li>');
          }
          $('.m-nav ul').append('<li><a href="#account" hidefocus="true">我的账户</a></li>');
          this.naved = true;
        }
    });
    return Workspace;
});