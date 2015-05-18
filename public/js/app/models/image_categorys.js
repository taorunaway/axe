define(['jquery','backbone','app/models/image_category','app/models/collection'],function($,Backbone,Model,TheCollection){
    var c = new TheCollection('/image_categorys',Model);
    return c.collection;
});
