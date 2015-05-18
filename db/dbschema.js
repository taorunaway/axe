var _ = require('underscore');
var util = require('util');
var db = require('./dbclient');
var debug = require('debug')('axe:dbschema');
/**
 *
 * @param tablename 表名
 * @param attrs 属性名
 * @settings {custom_id:true ##insert id}
 */
module.exports = function (tablename,attrs,settings){
    var setting_default = {
        custom_id:false
    };
    settings = _.defaults(settings || {},setting_default);
    var cls = [];
    for(var i = 0;i<attrs.length;i++){
        if(typeof attrs[i] ==  'string'){
            cls.push({name:attrs[i]});
        }else {
            var cl = {};
            attrs[i].name && (cl.name = attrs[i].name);
            attrs[i].max_len && (cl.length == attrs[i].max_len);
        }
    }
    this.isVali = function(props){
        for(var i =0;i<cls.length;i++){
            if(cls[i].max_len && props[cls[i].name] && props[cls[i].name].length > cls[i].max_len){
                return false;
            }
        }
        return true;
    }
    this.columns = function(){
        return  _.map(cls,function(item){
            return item.name;
        });
    }
    this.create = function (obj,cb){
        if(!settings.custom_id){
            delete obj.id;
        }
        if(!this.isVali(obj)){
            cb(new Error('数据错误'));
            return;
        }
        var pattrs = [],vls=[],params=[];
        var index = 1;
        _.each(cls,function(item,i){
            if(obj[item.name] || obj[item.name] === 0){
                pattrs.push(item.name);
                vls.push('$'+index);
                params.push(typeof obj[item.name] == 'object' ? JSON.stringify(obj[item.name]) : obj[item.name]);
                //params.push( (v != null && typeof v == 'object') ? (v instanceof  Array ? v : JSON.stringify(v)) : v);
                index++;
            }
        });
        var sql = util.format('insert into %s (%s) values (%s) RETURNING *;',tablename,pattrs.toString(),vls.toString());
        debug(sql);
        debug(params);
        db.query(sql,params,function(err,returns){
            if(err){
                cb(err);
            }else{
                cb(null,returns.rows[0]);
            }
        });
    }
    this.update = function(props,cb){
        if(!props.id){
            cb(new Error('没有主键'));
            return;
        }
        //else if(typeof props.id != 'number'){
        //    props.id = parseInt(props.id);
        //}
        if(this.isVali((props))){
            var sets = '',params=[],cols = this.columns();
            var index = 1;
            for(var p in props){
                if(p != 'id' && cols.indexOf(p) >=0 ){
                    if(sets){
                        sets += ',';
                    }
                    sets +=  p  + '=$' + index;
                    var v = props[p];
                    if(!v && v !== 0){
                        v = null;
                    }
                    params.push( (v != null && typeof v == 'object') ? (v instanceof  Array ? v : JSON.stringify(v)) : v);
                    index++;
                }
            }
            params.push(props.id);
            var sql = util.format('update %s set %s where id = $%s RETURNING *;',tablename,sets,index);
            db.query(sql,params,function(err,returns){
                if(err){
                    console.log(err,sql,params);
                    return cb(err);
                }

                cb(null,returns.rows[0]);
            });
        }else{
            cb(new Error('数据错误'));
        }

    }

    this.list = function(query,fields,cb){
        var sql= util.format('select %s from %s',fields || '*',tablename);
        var where = '';
        var pagesize = isNaN(parseInt(query.pagesize)) ? 20 : parseInt(query.pagesize);
        var pageindex = isNaN(parseInt(query.pageindex)) ? 1 : parseInt(query.pageindex);
        var orderby = ' order by '+ this.getSort(query.sort);
        var index = 1;
        var params = [];
        //todo --整合列名
        var cols = this.columns();
        for(var q in query){
            if(query[q] && cols.indexOf(q) >=0){
                where += !where ? ' where ' : ' and ';
                where = where + q + (q.indexOf('name') >= 0 ? ' like ' : ' = ')  +'$'+index;;
                index ++;
                params.push(q.indexOf('name') >=0 ? '%'+query[q] +'%' :query[q]);
            }
        }
        sql += where + orderby;
        if(pagesize > 0 ){
            sql += ' limit '+ pagesize + ' offset ' + db.offsetCount(pageindex,pagesize);
        }
        db.parallelQuery([{sql:sql,params:params},{sql:'select count(*) ::integer as count from  ' + tablename +  where,params:params}],function(err,res){
            if(err){
                console.log(err,sql,params);
                return cb(err);
            }
            cb(err,{result:res[0].rows,count:res[1].rows[0].count,page:db.totalPage(pagesize,res[1].rows[0].count)});
        });
    }
    this.query = function(query,fields,cb){
        var sql= util.format('select %s from %s',fields || '*',tablename);
        var where = '';
        var index = 1;
        var params = [];
        //todo --整合列名
        var cols = this.columns();
        for(var q in query){
            if(query[q] && cols.indexOf(q) >=0){
                where += !where ? ' where ' : ' and ';
                where = where + q + (q.indexOf('name') >= 0 ? ' like ' : ' = ')  +'$'+index;;
                index ++;
                params.push(q.indexOf('name') >=0 ? '%'+query[q] +'%' :query[q]);
            }
        }
        sql += where;
        sql += ' order by '+ this.getSort(query.sort);
        debug(sql);
        //console.log(sql,query);
        db.query(sql,params,function(err,res){
            if(err){
                console.log(err,sql,params);
                return cb(err);
            }
            cb(err,res.rows);
        });
    }
    this.item = function(id,cb){
        db.query('select * from '+tablename +' where id = $1',[id],function(err,re){
            if(err)
                return cb(err);
            cb(null,re.rows[0]);
        });
    }
    this.getSort = function(sort_str){
        var d_roder  = ' create_at desc nulls last ';
        if(!sort_str){
            return d_roder;
        }
        var sts = sort_str.split(','),s= [];
        for(var i =0;i< sts.length;i++){
            var colums = this.columns(),order = ' create_at desc nulls last ';
            var arrs = sts[i].split('-');
            if(arrs.length >= 1){
                if(colums.indexOf(arrs[0]) < 0){
                    return d_roder;
                }
                order = arrs.join(' ');
            }
            s.push(order);
        }
        return s.toString();
    }

    this.delete = function(id,cb){
        var sql = 'delete from '+tablename +' where id = $1';
        //console.log(sql,tablename,attrs,id);
        db.query(sql,[id],cb);
    }
}