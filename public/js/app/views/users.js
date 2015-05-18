define(['jquery','underscore','backbone','modal','app/models/user','app/models/users','pageTemplate','text!htmls/users.html','text!htmls/users_query.html','button','simpleForm'],function($,_,Backbone,modal,Model,Collection,pageTemp,html,query_html,Button,Form){
    var View = Backbone.View.extend({
        el:'#users_view',
        initialize:function(){
          this.template = _.template(html);
          this.model = new Model();
          this.collection = new Collection();
          this.listenTo(this.collection,'sync',this.render);
        },
        events:{
          'click .m-page a':'go_page',
          'click .search':'search',
          'click .edit':'show_edit',
          'click .new_user':'show_new_user',
          'click #save_user':'save_user',
          'click .edit-cats':'show_edit_category',
          'click #save_user_cat':'save_user_cat',
          'click #save_new_user':'save_new_user'
        },
        search:function(e){
          this.btn = new Button(this.$el.find('.search')).loading();
          var data = {role:this.$el.find('[name="role"]').val(),real_name:this.$el.find(':text[name="real_name"]').val()};
          this.collection.search(data);
        },
        show:function(user){
          this.user = user;
          this.$el.html(query_html);
          this.collection.search();
        },
        render:function(){
          if(this.btn){
            this.btn.reset();
          }
          var page = {pages:this.collection.pages,count:this.collection.count,page:this.collection.query.pageindex};
          this.$el.find('.collection').html(this.template({user:this.user,collection:this.collection.toJSON()}));
          this.$el.find('.pages').html(pageTemp(page));
        },
        go_page:function(e){
          e.preventDefault();
          e.stopPropagation();
          if($(e.currentTarget).attr('href').indexOf('#page=') == 0){
            var page = parseInt($(e.currentTarget).attr('href').substr(6));
            this.collection.goPage(page);
          }
        },
        show_edit:function(e){
          var btn = new Button($(e.currentTarget)).loading();
          var id = parseInt($(e.currentTarget).data('id'));
          this.model = this.collection.get(id);
          var el = this.$el;
          //this.model.fetch({data:{_:Math.random()},success:function(model){
          var m = this.model.toJSON();
            require(['text!htmls/user.html'],function(user){
              var temp = _.template(user);
              modal.show({title:'编辑用户信息',body:temp({model:m})},el,{buttons:[{id:'save_user',name:'保存'}],width:'300px;'});
              btn.reset();
            });
          //},error:function(){
          //  btn.reset();
          //}});
        },
        show_new_user:function(e){
          var el = this.$el;
          require(['text!htmls/user.html'],function(user){
            var temp = _.template(user);
            modal.show({title:'新建用户',body:temp({model:{}})},el,{buttons:[{id:'save_new_user',name:'保存'}],width:'300px;'});
          });
        },
        save_user:function(e){
          var btn = new Button($(e.currentTarget)).loading('保存中...');
          var form = new Form('#user_fields');
          var attrs = form.getFullFields();
          var el = this.$el;
          if(attrs){
            this.model.save(attrs,{success:function(){
              modal.message(el,'保存用户成功！');
              btn.reset();
            },error:function(){
              modal.message(el,'保存失败，请重试！');
              btn.reset();
            }});
          }else{
            btn.reset();
          }
        },
        save_new_user:function(e){
          var btn = new Button($(e.currentTarget)).loading('保存中...');
          var form = new Form('#user_fields');
          var attrs = form.getFields();
          var el = this.$el;
          if(attrs){
            this.collection.create(attrs,{success:function(){
              modal.message(el,'添加用户成功！');
              btn.reset();
            },error:function(){
              modal.message(el,'添加用户失败，请重试！');
              btn.reset();
            }});
          }else{
            btn.reset();
          }
        },
        show_edit_category:function(e){
          var id = parseInt($(e.currentTarget).data('id'));
          this.model = this.collection.get(id);
          //this.model.clear();
          //this.model.set('id',);
          var codes = this.model.get('role_code') ? this.model.get('role_code').toString() : '';
          var tx = '<div id="user_cat_field"><label>分配类目：</label><textarea name="cats" class="u-text" rows="4"> '+ codes + '</textarea></div>';
          modal.show({title:'修改用户采价类目',body:tx},this.$el,{buttons:[{id:'save_user_cat',name:'保存'}]});

          //require(['app/views/cate_component'],function(con){
          //  con.show({show_slt:true,has_cats:$(e.currentTarget).data('code').split(',')},function(cats){
          //    //alert('12323');810bf2dde32eacad76e8441b7b7dd6b3
          //    model.save({role_code:cats},{success:function(){
          //      modal.show('更新成功');
          //    }});
          //  })
          //});
        },
        save_user_cat:function(e){
          if(!$('#user_cat_field [name="cats"]').val()){
            return;
          }
          var btn = new Button($(e.currentTarget)).loading('保存中..');
          this.model.save({role_code: $.trim($('#user_cat_field [name="cats"]').val()).split(',')},{
                success:function(){ modal.show('更新成功');
                btn.reset();
            }});
        }
    });
  return new View();
});

