define(['jquery','backbone','app/models/image','app/models/collection'],function($,Backbone,Model,TheCollection){
    var c = new TheCollection('/images',Model);
    return c.collection;
});
