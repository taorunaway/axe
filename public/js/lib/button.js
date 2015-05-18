define(['jquery'],function($){
  var Btn = function(selecter){
    this.item = typeof  selecter === 'string' ? $(selecter) : selecter;
    this.loading = function(txt){
      this.item.data('txt',this.item.text()).text(txt || '加载中...').prop('disabled','disabled');
      return this;
    }
    this.reset= function(txt){
      this.item.removeAttr('disabled').text(txt || this.item.data('txt') || this.item.text());
      return this;
    }
  }
  return Btn;
});

