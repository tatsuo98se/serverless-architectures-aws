/**
 * Created by Peter Sbarski
 * Serverless Architectures on AWS
 * http://book.acloud.guru/
 * Last Updated: Feb 11, 2017
 */

'use strict';

var jwt = require('jsonwebtoken');

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

    //var token = event.authorizationToken.split(' ')[1]; // original code
    var accessToken = event.authorizationToken.split(' ')[0];
    var userToken = event.authorizationToken.split(' ')[1];
    var token = userToken;

    // var secretBuffer = new Buffer(process.env.AUTH0_SECRET); // original code
    let publicKey =[
        '-----BEGIN CERTIFICATE-----',
        'MIIDAzCCAeugAwIBAgIJb3PQSGKKiDeiMA0GCSqGSIb3DQEBCwUAMB8xHTAbBgNV',
        'BAMTFHRhdHN1bzk4c2UuYXV0aDAuY29tMB4XDTE5MDEyNjA1NDEzMVoXDTMyMTAw',
        'NDA1NDEzMVowHzEdMBsGA1UEAxMUdGF0c3VvOThzZS5hdXRoMC5jb20wggEiMA0G',
        'CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDghZZQtSxqlUY/zNgGOHlUbqlplknr',
        'tc3yhLbITynp0Oo7QHJGt07esPoJOTaFAqRP/P4nIvdktC4QRXlIC3FuT6SwLno7',
        'S7mNG7dNCvIlOXb6ZnyNYhrkS5BGOYxTUjFjAcr7JtiB77bxjaSmBATkNdFI8KWp',
        'pVFLTF1iBYDXfl8atXmz58B5CSxd0ejkhISqDZF5EwpjdCtXqY/0LF1P5svHGmKr',
        'NOV9Fpka/V1D9CLBFbHkGxXUp0vpruclgvm5EpFZsMAXNux0yuzGbFsFFbmJJIb9',
        'iTXZS/wzFgMGmYxbhKQpYXqHETjU3JDiQrD/Lb9kxUy5dXueHlorl6oxAgMBAAGj',
        'QjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFDLTOfxWT2KeqvIsuXlc0L6x',
        '/CV2MA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEAf18ky3mVD4X3',
        '1TIWYO1qx9+UKlPvmpENgbsC3rcj0E/UcOFR2hMqS38UqvO4ePHJ5w9NIr4ODL1t',
        'VqfBfXnH4HyeCmRAFHcsiX4JvnzCpPApbZ9EV+4gfaRjD00Qq5o/AbnF12Hkr7K9',
        'z7MXVsMFN54MV54LietBe6ecFprQh0h7m4RdxOnQMAoY4VMz2WrReXo6nY/kbEQl',
        'HXXSsaWEFcTZIHfUO9sJGixTLw+1rdlW0KEP3RSDlu5n40upkLPAXYfdQUlyb9Cd',
        'O0NwsS4vh2zJoPFP1N5T8XMkKEX8hEdfIG7gvp7/YBNIIHt0CXoccvsYfklewCax',
        'cOL01eCUrg==',
        '-----END CERTIFICATE-----',
    ].join("\n");
    var secretBuffer = publicKey;

    var option = {
        algorithms: ["RS256"]
    }

    jwt.verify(token, secretBuffer, option, function(err, decoded){
    	if(err){
    		console.log('Failed jwt verification: ', err, 'auth: ', event.authorizationToken);
    		callback('Authorization Failed');
    	} else {
            var resourceIdx = event.methodArn.lastIndexOf('/');
            var withoutResource = event.methodArn.substring(0, resourceIdx);
        
            var methodIdx = withoutResource.lastIndexOf('/');
            var withoutMethod = withoutResource.substring(0, methodIdx);
        
            console.log("allow : " + withoutMethod);
        
    		callback(null, generatePolicy('user', 'allow', withoutMethod + '/*'));
    	}
    })
};