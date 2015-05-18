define(['jquery','backbone','app/models/user','app/models/collection'],function($,Backbone,Model,TheCollection){
    var c = new TheCollection('/users',Model);
    return c.collection;
});
