/**
 * Created by Peter Sbarski
 * Serverless Architectures on AWS
 * http://book.acloud.guru/
 * Last Updated: Feb 11, 2017
 */

'use strict';

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

function changeAclToPublic(sourceBucket, sourceKey, callback){
    var params = {
        Bucket: sourceBucket,
        Key: sourceKey,
        ACL: 'public-read'
    };

    s3.putObjectAcl(params, function(error, data){
        if (error) {
            console.log(error, error.stack);
            callback(error);
        }
    });
};

exports.handler = function(event, context, callback){
    var message = JSON.parse(event.Records[0].Sns.Message);

    var sourceBucket = message.Records[0].s3.bucket.name;
    var sourceKey = decodeURIComponent(message.Records[0].s3.object.key.replace(/\+/g, ' '));

    changeAclToPublic(sourceBucket, sourceKey, callback)
};