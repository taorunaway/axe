define(['app/models/model','util'],function(TheModel,base){
    var m = new TheModel('/users',[{
        attrs:['create_at','lastupdate_at'],
        parse:function(v){
            if(v){
                return base.convertToDateTime(v);
            }
        }
    }]);
    return m.model;
});