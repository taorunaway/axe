var Schema = require('./dbschema');
var db = require('./dbclient');
var debug = require('debug')('axe:db:messages');
var util = require('util');
var attrs = [
    'id',
    'name',
    'description',
    'event_type',
    'event_key',
    'response_type',
    'response_message',
    'create_at',
    'create_by',
    'update_at',
    'update_by'
];
var model = new Schema('messages',attrs);
module.exports = model;