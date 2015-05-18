define(['jquery','backbone','app/models/category','app/models/collection'],function($,Backbone,Model,TheCollection){
    var c = new TheCollection('/categorys',Model);
    return c.collection;
});
