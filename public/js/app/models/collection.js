define(['jquery','backbone'],function($,Backbone){
    return function(url,model){
        this.collection = Backbone.Collection.extend({
            model: model,
            url: url,
            parse: function (data) {
                if(data instanceof Array){
                  return data;
                }else {
                  this.query = data.query;
                  this.pages = data.page;
                  this.count = data.count;
                  return data.result;
                }
            },
            search: function (query,success_cb,error_cb) {
                var q = query || {};
                q._ = Math.random();
                var d  = { data: q };
                if(success_cb){
                    d.success = success_cb;
                }
                if(error_cb){
                    d.error = error_cb;
                }
                this.fetch(d);
            },
            goPage: function (pageindex) {
                var data = this.query || {};
                data._ = Math.random();
                data.pageindex = pageindex;
                this.fetch({ data: data });
            },
            sort:function(sort,order){
                var data = this.query || {};
                data._ = Math.random();
                data.pageindex = 1;
                data.sort = sort+'-'+order;
                this.fetch({data:data});
            }
        });
    }
});