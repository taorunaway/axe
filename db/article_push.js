var Schema = require('./dbschema');
var db = require('./dbclient');
var debug = require('debug')('axe:db:article_push');
var util = require('util');
var attrs = [
    'id',
    'push_type',
    'push_data',
    'create_at',
    'create_by'
];
var model = new Schema('article_push',attrs);
module.exports = model;