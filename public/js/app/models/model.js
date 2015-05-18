define(['jquery','backbone'],function($,Backbone){
    //[{
    //    attrs:['create_at','lastupdate_at'],
    //    parse:function(value){
    //        return value * 2;
    //    }
    //}]
    return function(url_root,parses){
        this.model = Backbone.Model.extend({
            urlRoot:url_root,
            parse:function(attrs,option){
                if(parses){
                    for(var i=0;i<parses.length;i++){
                        var parse_one = parses[i];
                        for(var j =0;j<parse_one.attrs.length;j++){
                            attrs[parse_one.attrs[j]] = parse_one.parse(attrs[parse_one.attrs[j]]);
                        }
                    }
                }
                return attrs;
            }
        });
    }
});
