define(['jquery','underscore','backbone','app/models/article','app/models/articles','text!htmls/articles_query.html','pageTemplate','button','modal','app/models/categorys'],function($,_,Backbone,Model,Collection,queryHtml,pageTemp,Button,modal,Categorys){
    var View  =  Backbone.View.extend({
        el:'#articles_view',
        initialize:function(){
            this.template = _.template('<%_.each(collection,function(item,i){%><tr><td><a href="#articles/<%=item.id%>"><%=item.name%></a></td><td><%=item.cate2%><%=item.cate2 ? "-" :""%><%=item.cate1%></td><td><%=item.status === 0 ?"未发布":"已发布"%></td><td><%=item.publish_at%></td><td><%=item.create_at%></td><td><%=item.create_by%></td><td><a class="u-btn u-btn-sm u-btn-w edit" href="#articles/<%=item.id%>">编辑</a></td></tr><%})%>');
            this.query_html = _.template(queryHtml);
            this.collection = new Collection();
            this.model = new Model();
            this.categorys = new Categorys();
            this.listenTo(this.collection,'sync',this.render);
            this.listenTo(this.categorys,'sync',this.render_category);
        },
        events:{
            'click .search':'search',
            'click .m-page a':'go_page',
            'change [name="pcode1"]':'change_pcode'
        },
        show:function(user){
            this.$el.html(this.query_html());
            this.categorys.search();
            this.query();
            this.btn = new Button(this.$el.find('.search'));
        },
        search:function(e){
            var query = {name:this.$el.find('[name="name"]').val(),category:this.$el.find('[name="pcode2"]').val() || this.$el.find('[name="pcode1"]').val() };
            this.btn.loading('查询中..');
            console.log(query);
            this.query(query || {});
        },
        query:function(query){
            this.collection.search(query);
        },
        render:function(collects){
            this.btn.reset();
            var page = {pages:collects.pages,count:collects.count,page:collects.query.pageindex};
            this.$el.find('.collection').html(this.template({collection:collects.toJSON()}));
            this.$el.find('.pages').html(pageTemp(page));
        },
        render_category:function(){
            var cats  = this.categorys.where({pcode:null}).map(function(item){
                return '<option value="'+item.get('id')+'">'+ item.get('name') +'</option>';
            });
            this.$el.find('select[name="pcode1"]').append(cats.join(''));
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
        go_page:function(e){
            e.preventDefault();
            e.stopPropagation();
            if($(e.currentTarget).attr('href').indexOf('#page=') == 0){
                var page = parseInt($(e.currentTarget).attr('href').substr(6));
                this.collection.goPage(page);
            }
        }
    });
    return new View();
});

