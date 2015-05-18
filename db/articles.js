var Schema = require('./dbschema');
var db = require('./dbclient');
var debug = require('debug')('axe:db:articles');
var util = require('util');
var attrs = [
    'id',
    'url_title',
    'name',
    'description',
    'image',
    'content',
    'publish_at',
    'category',
    'status',
    'create_at',
    'create_by',
    'update_at',
    'update_by'
];
var model = new Schema('articles',attrs);
model.list = function(query,cb){
    var sql= "select a.id, a.name,a.status,a.publish_at,a.create_at,a.create_by,c1.name cate1,c2.name cate2 from articles a left join categorys c1 on a.category = c1.id left join categorys c2 on c1.pcode = c2.id where ";
    var where = [];
    where.push(" 1= 1")
    var pagesize = isNaN(parseInt(query.pagesize)) ? 20 : parseInt(query.pagesize);
    var pageindex = isNaN(parseInt(query.pageindex)) ? 1 : parseInt(query.pageindex);
    var orderby = " order by publish_at desc ";
    var index = 1;
    var params = [];
    if(query.category){
        where.push(util.format(" (a.category = $%s or c1.pcode = $%s)",index,index));
        index++;
        params.push(query.category);
    }
    if(query.name){
        where.push(util.format(" a.name like $%s",index));
        index++;
        params.push('%'+query.name+'%');
    }
    sql += where.join(" and ") + orderby;
    if(pagesize > 0 ){
        sql += ' limit '+ pagesize + ' offset ' + db.offsetCount(pageindex,pagesize);
    }
    debug(sql);
    debug(params);
    db.parallelQuery([{sql:sql,params:params},{sql:"select count(*) count from articles a left join categorys c1 on a.category = c1.id left join categorys c2 on c1.pcode = c2.id where "+  where.join(" and "),params:params}],function(err,res){
        if(err){
            console.log(err,sql,params);
            return cb(err);
        }
        cb(err,{result:res[0].rows,count:res[1].rows[0].count,page:db.totalPage(pagesize,res[1].rows[0].count)});
    });
}
module.exports = model;