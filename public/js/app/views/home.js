define(['jquery','underscore','backbone','modal','button','text!htmls/home.html'],function($,_,Backbone,modal,Button,html){
    var View = Backbone.View.extend({
        el:'#home_view',
        initialize:function(){

        },
        events:{

        },
        show:function(user){
          this.$el.html(html);
        }
    });
  return new View();
});

