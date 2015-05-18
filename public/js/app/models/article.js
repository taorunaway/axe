define(['app/models/model','util'],function(TheModel,util){
    var m = new TheModel('/articles',
        [{
            attrs:['create_at','update_at'],
            parse:function(v){
                if(v){
                    return util.convertToDateTime(v);
                }
            }
        },{
            attrs:['publish_at'],
            parse:function(v){
                if(v){
                    return util.convertToDateTime2(v);
                }
            }
        }]
    );
    return m.model;
});