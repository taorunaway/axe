requirejs.config({
  //baseUrl: 'lib',
  baseUrl: '/js/lib',
  paths: {
    app: '../app',
    htmls:'../htmls',
    jqueryForm:"jquery.form.min",
    ckeditor:"ckeditor/ckeditor",
    WdatePicker:'datepicker/WdatePicker'
  },
  shim: {
    WdatePicker:{
      exports:'WdatePicker'
    },
    ckeditor:{deps:['jquery']},
    jqueryForm:{deps:['jquery']}
  }
});