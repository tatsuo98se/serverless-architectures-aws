
'use strict';
var AWS = require('aws-sdk');
var async = require('async');

var s3 = new AWS.S3();

function createErrorResponse(code, message, encoding) {
    var response = {
        'statusCode': code,
        'headers': { 'Access-Control-Allow-Origin': '*' },
        'body': JSON.stringify({ 'code': code, 'message': message, 'encoding': encoding })
    }
    return response;
}

function createSuccessResponse(result) {
    var response = {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin': '*' },
        'body': JSON.stringify(result)
    }
    return response;
}

function createBucketParams(next) {
    var params = {
        Bucket: process.env.BUCKET,
        EncodingType: 'url'
    };
    next(null, params);
}

function getVideosFromBucket(params, next) {
    s3.listObjects(params, function (err, data) {
        if (err) {
            next(err);
        } else {
            next(null, data);
        }
    });
}

function createList(encoding, data, next) {
    var files = [];
    for (var i = 0; i < data.Contents.length; i++) {
        var file = data.Contents[i];

        if (encoding) {
            var type = file.Key.substr(file.Key.lastIndexOf('-') + 1);
            if (type !== encoding + '.mp4'){
                continue;
            }
        } else{
            if (file.Key && file.Key.substr(-3, 3) !== 'mp4') {
                continue;
            }
        }
        files.push({
            'filename': file.Key,
            'eTag': file.ETag.replace(/"/g,""),
             'size': file.Size});
    }

    var result = {
        domain: process.env.BASE_URL,
        bucket: process.env.BUCKET,
        files: files
    }

    next(null, result);
}

exports.handler = function (event, context, callback) {
    //console.log(JSON.stringify(event));
    var encoding = null;

    if (event.queryStringParameters && event.queryStringParameters.encoding){
        encoding = decodeURIComponent(event.queryStringParameters.encoding);
    }
    
    async.waterfall([createBucketParams, getVideosFromBucket, async.apply(createList, encoding)],
        function (err, result) {
            if (err) {
                callback(err, createErrorResponse(500, err, encoding));
            } else {
                if (result.files.length > 0){
                    callback(null, createSuccessResponse(result));
                } else {
                    callback(null, createErrorResponse(400, 'No files were found', encoding));

                }
            }
        });
}

