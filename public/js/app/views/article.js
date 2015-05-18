define(['jquery','underscore','backbone','simpleForm','app/models/article','text!htmls/article.html','ckeditor','button','modal','app/models/categorys','WdatePicker','app/views/images'],function($,_,Backbone,Form,Model,html,ckeditor,Button,modal,Categorys,WdatePicker,ImagesView){
    var View  =  Backbone.View.extend({
        el:'#article_view',
        initialize:function(){
            this.template = _.template(html);
            this.model = new Model();
            this.categorys = new Categorys();
            this.listenTo(this.categorys,'sync',this.render_category);
        },
        events:{
            'click .pagination a':'go_page',
            'change [name="pcode1"]':'change_pcode',
            'click .save':'save',
            'click .publish':'publish',
            'click .preview':'preview',
            'click .go_back':'go_back',
            'click .delete':'delete',
            'click .slt_image':'slt_image'
        },
        show:function(id,user){
            this.model.clear();
            this.model.set('id',id);
            var that = this;
            this.model.fetch({data:{_:Math.random()},success:function(){
                that.render();
            },error:function(){
                modal.show('加载失败，请重试');
            }});
        },
        show_new:function(user){
            console.log('haha');
            this.model.clear();
            this.render();
            this.categorys.search();
        },
        render:function(){
            this.$el.find('.content').html(this.template({model:this.model.toJSON()}));
            CKEDITOR.replace( 'article_content',{
                width:'850px',
                height:'300px',
                filebrowserImageUploadUrl: '/images',
                filebrowserImageBrowseUrl: '/images/browser',
                filebrowserWindowWidth: '640',
                filebrowserWindowHeight: '480'
            });
            this.categorys.search();
        },
        render_category:function(){
            var the_cate = this.categorys.get(this.model.get('category'));
            if(the_cate){
                var pcode = the_cate.get('pcode') || the_cate.get('id');
                var cats  = this.categorys.where({pcode:null}).map(function(item){
                    return '<option value="'+item.get('id')+'"'+ (pcode == item.get('id') ? 'selected="selected"' : '')+'>'+ item.get('name') +'</option>';
                });
                this.$el.find('select[name="pcode1"]').append(cats.join(''));
                if(the_cate.get('pcode')){
                    var code = the_cate.get('id');
                    var cats2  = this.categorys.where({pcode:the_cate.get('pcode')}).map(function(item){
                        return '<option value="'+item.get('id')+'"'+ (code == item.get('id') ? 'selected="selected"' : '')+'>'+ item.get('name') +'</option>';
                    });
                    this.$el.find('select[name="pcode2"]').append(cats2.join(''));
                }
            }else{
                var cats  = this.categorys.where({pcode:null}).map(function(item){
                    return '<option value="'+item.get('id')+'">'+ item.get('name') +'</option>';
                });
                this.$el.find('select[name="pcode1"]').append(cats.join(''));
            }
        },
        change_pcode:function(e){
            var pcode = $(e.currentTarget).val(),pcode2  = this.$el.find('[name="pcode2"]');
            if(pcode){
                var cats  = this.categorys.where({pcode:pcode}).map(function(item){
                    return '<option value="'+item.get('id')+'">'+ item.get('name') +'</option>';
                });
                pcode2.html('<option value="">全部</option>');
                pcode2.append(cats.join(''));
            }else{
                pcode2.html('<option value="">全部</option>');
            }
        },
        save:function(e){
            this.do_save(0,$(e.currentTarget));
        },
        publish:function(e){
            this.do_save(1,$(e.currentTarget));
        },
        do_save:function(status,btn){
            var btn = new Button(btn);
            var form = new Form(this.$el.find('.edit_article_form'));
            var attrs = form.getFields();
            if(_.isEmpty(attrs) || !attrs.name){
                modal.show('请输入标题',this.$el);
                return;
            }
            var editor = CKEDITOR.instances.article_content;
            attrs.content  = editor.getData();
            if(!attrs.content){
                modal.show('请输入文章内容',this.$el);
                return;
            }
            attrs.category = attrs.pcode2 || attrs.pcode1;
            if(!attrs.category){
                modal.show('请选择文章所属分类',this.$el);
                return;
            }
            attrs.status = status;
            btn.loading(status === 0 ?'保存中..' :'发布中..');
            var that = this;
            this.model.save(attrs,{
                success:function(){
                    modal.show(status == 0 ?'保存成功':'保存并发布成功',that.$el);
                    if(status == 1){
                        that.$el.find('.save').remove();
                    }
                    btn.reset();
                },
                error:function(){
                    modal.show('提交失败',that.$el);
                    btn.reset();
                }
            })
        },
        slt_image:function(e){
            modal.show({title:'选择主图',body:'<div id="article_images_contains"></div>'},this.$el,{buttons:[{name:'选择',className:'do_slt_img'}],width:'800px;'});
            //var that = this;
            var images_view  = new ImagesView({el: '#article_images_contains',slt_callback:function(m){
                console.log(m,$('.thumbnail_image'));
                $('#article_view .thumbnail_image').html('<img src="'+ m.get('url')+'" style="width:100px;"/><input type="hidden" value="'+ m.get('url') +'" name="image">');
                modal.hide();
            }});
            images_view.show();
        },
        go_back:function(){
            window.location.href="#articles";
        }
    });
    return new View();
});

