define(['app/models/model','util'],function(TheModel,base){
    var m = new TheModel('/categorys',
        {
            attrs:['create_at','update_at'],
            parse:function(v){
                if(v){
                    return util.convertToDateTime(v);
                }
            }
        }
    );
    return m.model;
});