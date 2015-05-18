var crypto = require('crypto');
/**
 *
 * @param date
 * @param friendly
 * @returns {string}
 */
exports.formatTime =format_date;
function format_date (date, friendly) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    if (friendly) {
        var now = new Date();
        var mseconds = -(date.getTime() - now.getTime());
        var time_std = [ 1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000 ];
        if (mseconds < time_std[3]) {
            if (mseconds > 0 && mseconds < time_std[1]) {
                return Math.floor(mseconds / time_std[0]).toString() + ' 秒前';
            }
            if (mseconds > time_std[1] && mseconds < time_std[2]) {
                return Math.floor(mseconds / time_std[1]).toString() + ' 分钟前';
            }
            if (mseconds > time_std[2]) {
                return Math.floor(mseconds / time_std[2]).toString() + ' 小时前';
            }
        }
    }

    //month = ((month < 10) ? '0' : '') + month;
    //day = ((day < 10) ? '0' : '') + day;
    hour = ((hour < 10) ? '0' : '') + hour;
    minute = ((minute < 10) ? '0' : '') + minute;
    second = ((second < 10) ? '0': '') + second;

    var thisYear = new Date().getFullYear();
    year = (thisYear === year) ? '' : (year.toString().substr(2,2) + '-');
    return year + month + '-' + day + ' ' + hour + ':' + minute;
};
exports.formatTimestamp = function(timestamp){
    return format_date(new Date(timestamp));
}
/**
 * to date -> 2015-01-02
 * @param date
 * @param friendly
 * @returns {string}
 */
exports.formatDate = function(date,friendly){
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return (friendly && year == new Date().getFullYear() ? '': year+'-' )+ (month < 10 ? '0'+ month.toString() :month) + '-' + (day < 10 ? '0' + day.toString() : day);
}

/**
 * sha1加密
 * @param str
 * @returns {*|Hmac.digest}
 */
exports.hashSha1 = function(str){
    return  crypto.createHash('sha1').update(str).digest('hex');
}

/**
 * MD5
 * @param str
 * @returns {*|Hmac.digest}
 */
exports.md5 = function(str){
    return  crypto.createHash('md5').update(str,'utf8').digest('hex');
}
/**
 *
 * @param page
 * @param pagesize
 * @returns {number}
 */
exports.totalPage=function(pagesize,total_count){
    return total_count % pagesize == 0 ? parseInt(total_count / pagesize) : parseInt(total_count / pagesize) + 1;
}
exports.getIntDefault = function(num,defaults){
    defaults = defaults || 0;
    if(!num){return defaults};
    var p = parseInt(num,10);
    return isNaN(p) ? defaults : p;
}
