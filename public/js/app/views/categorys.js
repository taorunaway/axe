define(['jquery','underscore','backbone','modal','button','text!htmls/categorys.html','app/models/category','app/models/categorys','text!htmls/category_edit.html','simpleForm'],function($,_,Backbone,modal,Button,html,Model,Collection,editHtml,Form){
  var View =  Backbone.View.extend({
    el: '#categorys_view',
    initialize: function () {
      this.template = _.template(html);
      this.model = new Model();
      this.collection = new Collection();
      this.listenTo(this.collection,'sync',this.render);
      this.editTemp = _.template(editHtml);
    },
    events: {
      'click .edit_cat':'edit_cate',
      'click .new_cat':'new_cate',
      'click .save_cate':'save_cate',
      'click .delete_cate':'show_delete_cate',
      'click .do_delete_cat':'delete_cate'
    },
    show:function(user){
      this.collection.search();
    },
    render:function(collection){
      console.log('render');
      var rows  = this.collection.toJSON();
      var rows  = rows.sort(function(a,b){
        if(!a.pcode && b.pcode){
          return -1;
        }else if(!b.pcode && a.pcode){
          return 1;
        }else if((!a.pcode && !b.pcode) || (a.pcode && b.pcode)){
          return a.the_order < b.the_order ? -1 :1;
        }
        return 0;
      });
      console.log(rows);
      var p = {},cats = [];
      for(var i = 0;i<rows.length;i++){
        if(!rows[i].pcode){
          p[rows[i].id] = rows[i];
        }else{
          p[rows[i].pcode].subs = p[rows[i].pcode].subs || [];
          p[rows[i].pcode].subs.push(rows[i]);
        }
      }
      for(var i in p){
        cats.push(p[i]);
      }
      this.$el.find('.content').html(this.template({cats:cats}));
    },
    edit_cate:function(e){
      var id = $(e.currentTarget).data('id');
      this.model = this.collection.get(id);
      console.log(this.model);
      modal.show({title:'编辑分类',body:this.editTemp({model:this.model.toJSON()})},this.$el,{buttons:[{name:'删除',className:'delete_cate'},{name:'保存',className:'save_cate'}]});
    },
    new_cate:function(e){
      var rows = this.collection.toJSON();
      var pcats = [];
      for(var i = 0;i<rows.length;i++){
        if(!rows[i].pcode){
          pcats.push(rows[i]);
        }
      }
      modal.show({title:'添加分类',body:this.editTemp({model:{},pcates:pcats})},this.$el,{buttons:[{name:'保存',className:'save_cate'}]});
    },
    save_cate:function(e){
      var btn = new Button($(e.currentTarget));
      btn.loading('保存中..');
      var form = new Form(this.$el.find('.edit_category_contain'));
      var attrs  = form.getFullFields();
      if(!_.isEmpty(attrs)){
        var el = this.$el;
        if(attrs.code){
          this.collection.create(attrs,{
            success:function(){
              modal.show('添加成功',el);
            },
            error:function(){
              modal.show('添加失败，请重试',el);
            }
          });
        }else{
          this.model.save(attrs,{
            success:function(){
              modal.show('保存成功',el);
            },
            error:function(){
              modal.show('保存失败，请重试',el);
            }
          });
        }
      }else{
        btn.reset();
        modal.message('请输入正确的格式');
      }
    },
    show_delete_cate:function(e){
      modal.show('删除分类将会把该分类下的文章放到未定义分类下，并且若有下级分类也将会被删除，确定删除吗',this.$el,{buttons:[{name:'确认删除',className:'do_delete_cat'}]});
    },
    delete_cate:function(e){
      var el = this.$el;
      var that =this;
      this.model.destroy({
        success:function(){
          modal.show('删除成功',el);
          that.collection.search();
        },error:function(){modal.show('删除失败',el);}})
    }
  });
  return new View();
});