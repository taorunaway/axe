define(['jquery','backbone','app/models/article','app/models/collection'],function($,Backbone,Model,TheCollection){
    var c = new TheCollection('/articles',Model);
    return c.collection;
});
