var pg = require('pg');
var async = require('async');
var config = require('../config')

exports.query = function(sqlstr,params,cb){
    var the_cb = cb;
    var the_params = params;
    if(!cb && typeof params == "function"){
        the_params = null;
        the_cb = params;
    }
    pg.connect(config.pg_connect, function(err, client, done) {
        if(err) {
            console.error('error fetching client from pool', err);
            the_cb(err);
            return;
        }
        client.query(sqlstr,the_params,function(err, result) {
            done();
            //console.log('query returns ',result);
            the_cb(err,result);
        });
    });
};
/**
 * 并发执行多条查询或插入
 * @param sqlwithparams [{sql:'select',params:[]},'select'];
 * @param done_cb
 */
exports.parallelQuery = function(sqlwithparams,done_cb){
    pg.connect(config.pg_connect, function(err, client, done) {
        if(err) {
            console.error('error fetching client from pool', err);
            done_cb(err);
            return;
        }
        async.map(sqlwithparams,function(sql,cb){
            if(typeof sql == "string"){
                var sqlstr = sql,params = null;
            }else{
                var sqlstr = sql.sql,params = sql.params;
            }
            client.query(sqlstr,params,cb);
        },function(err,results){
            done();
            done_cb(err,results);
        });
    });
};
exports.totalPage=function(pagesize,total_count){
    return total_count % pagesize == 0 ? parseInt(total_count / pagesize) : parseInt(total_count / pagesize) + 1;
}
exports.offsetCount = function(pageindex,pagesize){
    return( pageindex - 1) * pagesize;
}

