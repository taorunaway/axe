var Schema = require('./dbschema');
//var db = require('./dbclient');
//var util = require('util');
var attrs = [
    'id',
    'thumbnail',
    'name',
    'url',
    'category',
    'create_at',
    'create_by',
    'update_at',
    'update_by'
];
var model = new Schema('images',attrs);
module.exports = model;