var dbclinet = require('./dbclient');
var Schema = require('../db/dbschema');
var attrs = ['id','name','pcode','the_order','create_at','create_by','update_at','update_by'];
var models = new Schema('categorys',attrs,{custom_id:true});
models.queryList = function(cb){
    dbclinet.query("select * from categorys order by pcode nulls first,the_order asc",null,function(err,re){
        if(err)
            return cb(err);
        var rows = re.rows;
        var p = {},cats = [];
        for(var i = 0;i<rows.length;i++){
            if(!rows[i].pcode){
                p[rows[i].id] = rows[i];
            }else{
                p[rows[i].pcode].subs = p[rows[i].pcode].subs || [];
                p[rows[i].pcode].subs.push(rows[i]);
            }
        }
        for(var i in p){
            cats.push(p[i]);
        }
        cb(null,cats);
    });
};
models.delete = function(id,cb){
    dbclinet.parallelQuery([{sql:"delete from categorys where id = $1 or pcode = $1",params:[id]},{sql:'update articles set category = null where category = $1',params:[id]}],cb);
}
module.exports = models;



