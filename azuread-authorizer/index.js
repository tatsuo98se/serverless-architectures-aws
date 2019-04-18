/**
 * Created by Peter Sbarski
 * Serverless Architectures on AWS
 * http://book.acloud.guru/
 * Last Updated: Feb 11, 2017
 */

'use strict';

var request = require('request');

var generatePolicy = function(principalId, effect, resource) {
    var authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; // default version
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; // default action
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
}

exports.handler = function(event, context, callback){
    if (!event.authorizationToken) {
    	callback('Could not find authToken');
    	return;
    }

    var token = event.authorizationToken.split(' ')[1]; // original code
    console.log("callGraph: " + token);

    var options = {
        url : 'https://graph.microsoft.com/v1.0/me',
        method : 'GET',
        headers: {
            'Authorization' : "Bearer " + token
        }
    }

    request(options, function(error, response, body){
        if(error){
    		callback('Authorization Failed');
        }else{
            console.log("response: " + JSON.stringify(response));

            var resourceIdx = event.methodArn.lastIndexOf('/');
            var withoutResource = event.methodArn.substring(0, resourceIdx);
        
            var methodIdx = withoutResource.lastIndexOf('/');
            var withoutMethod = withoutResource.substring(0, methodIdx);
        
            console.log("allow : " + withoutMethod);
        
    		callback(null, generatePolicy('user', 'allow', withoutMethod + '/*'));
        }
    });
};