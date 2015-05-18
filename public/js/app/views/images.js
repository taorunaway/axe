define(['jquery','underscore','backbone','modal','button','text!htmls/images_query.html','pageTemplate','app/models/image','app/models/images','text!htmls/images_list.html','text!htmls/images_upload.html','jqueryForm','app/models/image_categorys','text!htmls/images_categorys.html'],function($,_,Backbone,modal,Button,html,pageTemplate,Model,Collection,htmlList,htmlUpload,jqueryForm,Categorys,htmlCates){
    var View = Backbone.View.extend({
        //el:'#images_view',
        initialize:function(ps){
            console.log(ps);
            this.el = ps.el;
            this.show_edit = ps.show_edit|| false;
            this.slt_callback = ps.slt_callback ;
            this.queryTemp = _.template(html);
            //this.el = el;
            this.template = _.template(htmlList);
            this.editTemp = _.template(htmlUpload);
            this.collection = new Collection();
            this.categorys = new Categorys();
            this.catesTemp = _.template(htmlCates);
            this.listenTo(this.collection,'sync',this.render);
            this.listenTo(this.categorys,'sync',this.render_categorys);
            this.viewTemplate = _.template('<div><img src="<%=model.url%>" style="max-height: 280px;*height:280px;"><p><%=model.name%></p><p><span>上传时间：<%=model.create_at%></span></p></div>');
        },
        events:{
            'click .search':'search',
            'click .create':'create',
            'click .upload':'upload',
            'click .m-page a':'go_page',
            'click .categorys a':'change_cate',
            'click .m-img-contain':'show_image',
            'click .m-title p':'show_image',
            'click .edit':'edit',
            'click .delete':'delete_img',
            'click .update':'update',
            'click .edit_cates':'edit_cates',
            'click .create_cate':'create_cate',
            'click .delete_cate':'delete_cate',
            'click .m-images li':'do_slt'
        },
        show:function(user){
            this.collection.search();
            this.$el.html(this.queryTemp({show_edit:this.show_edit}));
            this.categorys.search();
        },
        create:function(e){
            modal.show({title:'上传新图片',body:this.editTemp({model:{},categorys:this.categorys.toJSON()})},this.$el,{buttons:[{name:'上传',className:'upload'}]});
        },
        upload:function(e){
            var image =  this.$el.find('[name="file"]').val(),ts = ['jpg','jpeg','gif','png','bmp'];
            if(!image || ts.indexOf(image.substr(image.lastIndexOf('.')+1)) < 0){
                modal.message('请选择图片文件');
                console.log(image.substr(image.lastIndexOf('.')+1));
                return ;
            }
            var that = this;
            this.$el.find('form').ajaxSubmit({
                success:function(d){
                    console.log(d);
                    if(d == '1'){
                        modal.show('上传成功!',that.$el);
                        that.collection.search();
                    }else{
                        modal.show('上传失败：'+d,that.$el);
                    }
                },
                error:function(){
                    modal.show('系统或网络错误');
                }
            });
        },
        search:function(e){
            this.btn = new Button($(e.currentTarget));
            this.btn.loading('查询中..');
            this.collection.search({category:this.$el.find('[name="category"]').val()});
        },
        change_cate:function(e){
            e.preventDefault();

            var href = $(e.currentTarget).attr('href');
            var cate = href.substr(href.lastIndexOf('#')+1);
            var query = cate == 'all' ? {} :{category:cate};
            this.collection.search(query);
        },
        render:function(){
            if(this.btn){
                this.btn.reset();
            }
            this.$el.find('.categorys .u-active').removeClass('u-active');
            var id = this.collection.query.category || 'all';
            this.$el.find('.categorys a[href="#'+ id+'"]').addClass('u-active');
            var page = {pages:this.collection.pages,count:this.collection.count,page:this.collection.query.pageindex};
            this.$el.find('.collection').html(this.template({collection:this.collection.toJSON(),show_edit:this.show_edit}));
            this.$el.find('.pages').html(pageTemplate(page));
        },
        render_categorys:function(){
            var hs  = this.categorys.sortBy('the_order').map(function(item){
                return '<li><a href="#'+ item.get('id') +'">'+ item.get('name') +'</a> </li>';
            });
            this.$el.find('.categorys li:gt(0)').remove();
            this.$el.find('.categorys').append(hs.join(''));
        },
        show_image:function(e){
            if(this.show_edit){
                var id = $(e.currentTarget).parents('li').data('id');
                var m = this.collection.get(id);
                var url = m.get('url');
                modal.show({title:'查询图片',body:this.viewTemplate({model:m.toJSON()})},this.$el);
            }
        },
        do_slt:function(e){
            if(this.slt_callback){
                var id = $(e.currentTarget).data('id');
                var m = this.collection.get(id);
                this.slt_callback(m);
            }
        },
        edit:function(e){
            var id = $(e.currentTarget).parents('li').data('id');
            this.model  = this.collection.get(id);
            modal.show({title:'修改图片',body:this.editTemp({model: this.model.toJSON(),categorys:this.categorys.toJSON()})},this.$el,{buttons:[{name:'保存',className:'update'}]});
        },
        update:function(e){
            var btn = new Button($(e.currentTarget));
            var m = {category:this.$el.find('form [name="category"]').val(),name:this.$el.find('form [name="name"]').val()};
            var that = this;
            this.model.save(m,{success:function(){
                modal.show('保存成功',that.$el);
            },error:function(){
                modal.show('保存失败',that.$el);
            }});
        },
        delete_img:function(e){
            var li = $(e.currentTarget).parents('li');
            var id = li.data('id');
            var m = this.collection.get(id);
            m.destroy({wait:true,success:function(){
                modal.show('删除成功！！');
                li.remove();
            },error:function(){
                modal.show('删除失败');
            }});
        },
        go_page:function(e){
            e.preventDefault();
            e.stopPropagation();
            if($(e.currentTarget).attr('href').indexOf('#page=') == 0){
                var page = parseInt($(e.currentTarget).attr('href').substr(6));
                this.collection.goPage(page);
            }
        },
        edit_cates:function(e){
            var html = this.catesTemp({collection:this.categorys.toJSON()});
            modal.show({title:'管理图片分类',body:html},this.$el);
        },
        create_cate:function(e){
            var btn = new Button($(e.currentTarget));
            var tr = $(e.currentTarget).parents('tr');
            var name = tr.find('[name="name"]').val(),the_order = tr.find('[name="the_order"]').val();
            if(name && /\d+/.test(the_order)){
                btn.loading('添加中..');
                var that = this;
                this.categorys.create({name:name,the_order:the_order},{success:function(){
                    modal.show('添加成功！',that.$el);
                },error:function(){
                    modal.show('添加失败',that.$el);
                }})
            }else{
                modal.message('请输入正确的格式');
            }
        },
        delete_cate:function(e){
            var btn = new Button($(e.currentTarget));
            btn.loading('删除中..');
            var id = $(e.currentTarget).data('id');
            var model = this.categorys.get(id);
            var that = this;
            model.destroy({wait:true,success:function(){
                modal.message('删除成功');
                $(e.currentTarget).parents('tr').remove();
                that.categorys.search();
            },error:function(){
                modal.message('删除失败');
            }})
        }
    });
    return View;
  //return new View({el:'#images_view'});
});

