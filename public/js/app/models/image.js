define(['app/models/model','util'],function(TheModel,util){
    var m = new TheModel('/images',
        [{
            attrs:['create_at','update_at'],
            parse:function(v){
                if(v){
                    return util.convertToDateTime(v);
                }
            }
        }]
    );
    return m.model;
});