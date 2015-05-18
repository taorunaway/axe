define(['jquery','underscore','backbone','text!htmls/modal.html'],function($,_,Backbone,html){
  var View =  Backbone.View.extend({
    el:'#content',
    initialize:function(){
      this.template = _.template(html);
    },
    events:{
      'click .m-modal .u-close':'hide'
    },
    show:function(model,parent,settings){
      var htmls = this.template({title:model.title || '注意',body:typeof  model == 'string' ? model : model.body,settings:settings || {}});
      parent = parent || '#content';
      parent = typeof  parent === 'string' ? $(parent) : parent;
      var pp = parent.children('.m-modal-contain');
      var container = pp.length > 0 ? pp : $('<div class="m-modal-contain"></div>').appendTo(parent);
      container.html(htmls);
      $('.m-overlay').show();
      container.show();
    },
    hide:function(){
      $('.m-modal-contain,.m-overlay').hide();
    },
    message:function(message){
      var pp = $('.m-modal-contain:visible .m-body');
      if(pp.length > 0){
        var m = pp.find('.m-info');
        m = m.length > 0 ? m : $('<div class="m-info"></div>').appendTo(pp);
        m.html(message);
      }
    }
  });
  return new View();
});

