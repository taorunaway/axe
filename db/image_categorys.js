var Schema = require('./dbschema');
var db = require('./dbclient');
//var util = require('util');
var attrs = [ 'id','name','the_order','create_at','create_by','update_at','update_by'];
var model = new Schema('image_categorys',attrs);
model.delete = function(id,cb){
    db.parallelQuery([{sql:"delete from image_categorys where id = $1",params:[id]},{sql:'update images set category = 1 where category = $1',params:[id]}],cb);
}
module.exports = model;