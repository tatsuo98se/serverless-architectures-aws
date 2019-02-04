
'use strict';

var email = require('email')

exports.handler = function(event, context, callback){
    email.send(['tatsuo_fukushima@icloud.com'], 'tatsuo_fukushima@icloud.com', 'Email from Lambda', 'BodyBody');
}

