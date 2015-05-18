var dbclinet = require('./dbclient');
var Schema = require('../db/dbschema');
var myUtil = require('../util/util');
var attrs = [
'user_name',
'password',
'role',
'role_code',
'real_name',
'sex',
'email',
'cell_phone',
'short_phone',
'office_phone',
'comments',
'status',
'create_at',
'create_by',
'lastupdate_at',
'lastupdate_by',
'last_changepass_at',
'last_login_at',
];
var models = new Schema('users',attrs);
models.exits = function(user_name,cb){
    dbclinet.query("select id from users where user_name = $1",[user_name],function(err,re){
        if(err)
            return cb(err);
        cb(null,re.rows[0]);
    });
};
models.loginAble = function(user_name,password,cb){
    dbclinet.query("select * from users where user_name = $1 and password = $2",[user_name,myUtil.md5(password)],function(err,returns){
        if(err)
            return cb(err);
        cb(null,returns.rows[0]);
    });
}
models.changePassword = function(user_name,password,newpassword,cb){
    dbclinet.query("select id from users where user_name = $1 and password = $2 ",[user_name,myUtil.md5(password)],function(err,returns){
        if(err){
            cb(err);
        }else if(returns.rowCount <= 0){
            cb(new Error('密码错误！'));
        }else{
            dbclinet.query("update users set password = $1,last_changepass_at = $3 where user_name = $2 returning *",[myUtil.md5(newpassword),user_name,new Date().toISOString()],function(err){
                cb(err);
            });
        }
    });
}
module.exports = models;



