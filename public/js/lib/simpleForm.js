define(['jquery'],function($){
   var M = function(select){
        this.form = typeof select ==='string' ? $(select) : select;
        function getfields (query,that){
            var fields = {};
            var flag   = true;
            that.form.find(query).each(function(i,item){
                var $this = $(this);
                var item  = that.getField($this);
                if(!item){
                    flag = false;
                }else if(item.value){
                    fields[item.name] = item.value;
                }
            });
            that.form.find('select:enabled,input[type="hidden"]').each(function(i,item){
                var $this = $(this);
                if($this.val()){
                    fields[$this.attr('name')] = $this.val();
                }
                if($this.data('required') && (!$this.val() || !$.trim($this.val()))){
                    $this.addClass('u-error-field');
                    flag = false;
                }
            });
            if(!flag){
                return;
            }
            that.form.find(':checkbox:checked:enabled').each(function(i,item){
                var $this = $(this);
                var name = $this.attr('name');
                var value = $this.val();
                if(name && value == true){
                    if(!fields[name]){
                        fields[name] = [];
                    }else if(fields[name] && !fields[name] instanceof Array){
                        fields[name] = [fields[name]];
                    }
                    fields[name].push(value);
                }
            });
            return fields;
        }
        this.getFields = function(){
            return getfields(':text:enabled,:password:enabled,textarea:enabled,:radio:checked:enabled',this);
            //var fields = {};
            //var flag   = true;
            //var that = this;
            //this.form.find(':text:not([disabled]),:password:not([disabled]),textarea:not([disabled]),:radio:checked:not([disabled])').each(function(i,item){
            //    var $this = $(this);
            //    var item  = that.getField($this);
            //    if(!item){
            //        flag = false;
            //    }else{
            //        fields[item.name] = item.value;
            //    }
            //});
            //if(!flag){
            //    return;
            //}
            //this.form.find('select').each(function(i,item){
            //    $this = $(this);
            //    fields[$this.attr('name')] = $this.val();
            //});
            //this.form.find(':checkbox:checked').each(function(i,item){
            //    $this = $(this);
            //    var name = $this.attr('name');
            //    var value = $this.val();
            //    if(!fields[name]){
            //        fields[name] = [];
            //    }else if(fields[name] && !fields[name] instanceof Array){
            //        fields[name] = [fields[name]];
            //    }
            //    fields[name].push(value);
            //});
            //return fields;
        },
        /**
         * 返回所有表单的数据，只要格式正确
          */
        this.getFullFields = function(){
            var fields = {};
            var flag   = true;
            var that = this;
            this.form.find(':text:enabled,:password:enabled,textarea:enabled,:radio:checked:enabled').each(function(i,item){
                var $this = $(this);
                var item  = that.getField($this);
                if(!item){
                    flag = false;
                }else{
                    fields[item.name] = item.value;
                }
            });
            this.form.find('select:enabled,input[type="hidden"]').each(function(i,item){
                var $this = $(this);
                if($this.data('required') && (!$this.val() || !$.trim($this.val()))){
                    $this.addClass('u-error-field');
                    flag = false;
                }else{
                    fields[$this.attr('name')] = $this.val();
                }
            });
            if(!flag){
                return;
            }
            this.form.find(':checkbox:checked:enabled').each(function(i,item){
                var $this = $(this);
                var name = $this.attr('name');
                var value = $this.val();
                if(name && value){
                    if(!fields[name]){
                        fields[name] = [];
                    }else if(fields[name] && !fields[name] instanceof Array){
                        fields[name] = [fields[name]];
                    }
                    fields[name].push(value);
                }
            });
            return fields;
        },
        //data-required data-number data-month
        this.getField = function(element){
            var $this;
            if(typeof element == 'string'){
                $this = $(element);
            }else if(element instanceof $){
                $this = element;
            }else{
                $this = $(element);
            }
            $this.removeClass('u-error-field');
            if($this.data('required') && (!$this.val() || !$.trim($this.val()))){
                $this.addClass('u-error-field');
                return;
            }
            if($this.val()){
                if($this.data('number')){
                    if( isNaN(parseFloat($this.val()))){
                        $this.addClass('u-error-field');
                        return;
                    }else{
                        $this.val(parseFloat($this.val()));
                    }
                }
                if($this.data('month')){
                    var rgm = new RegExp('^\\d{4}-([1-9]{1}|0[1-9]{1}|1[1-2]{1})$');
                    if(!rgm.test($this.val())){
                        $this.addClass('u-error-field');
                        return;
                    }

                }
                if($this.data('regex')){
                    var rg = new RegExp($this.data('regex'));
                    if(!rg.test($this.val())){
                        $this.addClass('u-error-field');
                        return;
                    }
                }
                if($this.data('sum')){
                    var cacu = $this.data('sum');
                    var arras = cacu.split(/[+\-*%]/),replace_arrs =[];
                    console.log(arras);
                    for(var i =0;i<arras.length;i++){
                        var name = arras[i];
                        var item = this.form.find('[name="'+name +'"]');
                        if(item.length > 0 && !isNaN(parseFloat(item.val()))){
                            replace_arrs.push({name:name,value:parseFloat(item.val())});
                        }else{
                            replace_arrs.push({name:name,value:0});
                        }
                    }
                    for(var i =0;i<replace_arrs.length;i++){
                        var x = new RegExp(replace_arrs[i].name,'g');
                        cacu = cacu.replace(x,replace_arrs[i].value);
                    }
                    console.log(cacu);
                    var sum = eval(cacu);
                    if(sum != $this.val()){
                        $this.addClass('u-error-field');
                        return;
                    }
                }
            }
            return {name:$this.attr('name'),value:$this.val()}
        },
        this.getChangedFields=function(){
            return getfields(':text.changed,:password.changed,textarea.changed,:radio.changed,:checked..changed',this);
        }
   };
   return M;
});