define(['jquery'],function(){
    var getfstr  = function(d){
        return  d< 10 ? '0' + d : d.toString();
    };
    return {
        showError:function(mess){
            alert(mess || '系统或网络错误，请稍后再试');
        },
        fetchError:function(model_collection,resp,options){
            alert('网络错误');
        },
        convertToDateMonth:function(v){
            v = v.replace(/T/, ' ').replace(/\..+/, '').replace(/-/g,'/');
            var date = new Date(Date.parse(v) + 1000 * 60 * 60 * 8);
            return date.getFullYear()+'-'+getfstr(date.getMonth() + 1);
        },
        convertToDate:function(v){
          v = v.replace(/T/, ' ').replace(/\..+/, '').replace(/-/g,'/');
          var date = new Date(Date.parse(v) + 1000 * 60 * 60 * 8);
          return date.getFullYear()+'-'+getfstr(date.getMonth() + 1) + '-' + getfstr(date.getDate());
        },
        convertToDateTime:function(v){
            v = v.replace(/T/, ' ').replace(/\..+/, '').replace(/-/g,'/');
            var date = new Date(Date.parse(v) + 1000 * 60 * 60 * 8);
            var sd  = getfstr(date.getMonth() + 1) + '-' + getfstr(date.getDate()) + ' ' + getfstr(date.getHours()) + ':' + getfstr(date.getMinutes());
            if(date.getFullYear() !== date.getFullYear()){
                sd = date.getFullYear() + '-' + sd;
            }
            return sd;
        },
        convertToDateTime2:function(v){
            v = v.replace(/T/, ' ').replace(/\..+/, '').replace(/-/g,'/');
            console.log(v);
            var date = new Date(Date.parse(v) + 1000 * 60 * 60 * 8);
            console.log(date);
            var sd  = getfstr(date.getMonth() + 1) + '-' + getfstr(date.getDate()) + ' ' + getfstr(date.getHours()) + ':' + getfstr(date.getMinutes());
            sd = date.getFullYear() + '-' + sd;
            return sd;
        }
    };
});