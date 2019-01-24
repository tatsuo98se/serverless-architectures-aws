/**
 * Created by Peter Sbarski
 * Serverless Architectures on AWS
 * http://book.acloud.guru/
 * Last Updated: Feb 11, 2017
 */

'use strict';
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var elasticTranscoder = new AWS.ElasticTranscoder({
    region: 'us-east-1'
});

function isSupportType(sourceKey){
    var supportTypes = ['.avi', '.mp4', '.mov' ];

    for(var i=0; i<supportTypes.length; i++){
        if(sourceKey.endsWith(supportTypes[i])){
            return true;
        }
    }
    return false;
}

exports.handler = function(event, context, callback){
    console.log('Welcome');

    var key = event.Records[0].s3.object.key;
    var sourceBucket = event.Records[0].s3.bucket.name;

    //the input file may have spaces so replace them with '+'
    var sourceKey = decodeURIComponent(key.replace(/\+/g, ' '));

    if(!isSupportType(sourceKey)){
        // remove file
        var params = {
            Bucket: sourceBucket, 
            Key: sourceKey
           };
           s3.deleteObject(params, function(error, data) {
             if (error){
                console.log(error, error.stack); // an error occurred
                callback(error);
        
             } 
             /*
             else     console.log(data);           // successful response
             data = {
             }
             */
           });
           callback(new Error("unsupported type"))
           return;
    }

    //remove the extension
    var outputKey = sourceKey.substring(0,sourceKey.lastIndexOf('.'));

    
    var params = {
        PipelineId: '1534406574372-r0pk45',
        Input: {
            Key: sourceKey
        },
        Outputs: [
            {
                Key: outputKey + '-1080p' + '.mp4',
                PresetId: '1351620000001-000001' //Generic 1080p
            },
            {
                Key: outputKey + '-720p' + '.mp4',
                PresetId: '1351620000001-000010' //Generic 720p
            },
            {
                Key: outputKey + '-web-720p' + '.mp4',
                PresetId: '1351620000001-100070' //Web Friendly 720p
            }
        ]};

    elasticTranscoder.createJob(params, function(error, data){
        if (error){
            console.log(error, error.stack);
            callback(error);
        }
    });
};