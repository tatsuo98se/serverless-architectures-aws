/**
 * Created by Peter Sbarski
 * Serverless Architectures on AWS
 * http://book.acloud.guru/
 * Last Updated: Feb 11, 2017
 */

'use strict';

var jwt = require('jsonwebtoken');
var request = require('request');

exports.handler = function(event, context, callback){

    // let publicKey =[
    //     '-----BEGIN CERTIFICATE-----',
    //     'MIIDAzCCAeugAwIBAgIJb3PQSGKKiDeiMA0GCSqGSIb3DQEBCwUAMB8xHTAbBgNV',
    //     'BAMTFHRhdHN1bzk4c2UuYXV0aDAuY29tMB4XDTE5MDEyNjA1NDEzMVoXDTMyMTAw',
    //     'NDA1NDEzMVowHzEdMBsGA1UEAxMUdGF0c3VvOThzZS5hdXRoMC5jb20wggEiMA0G',
    //     'CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDghZZQtSxqlUY/zNgGOHlUbqlplknr',
    //     'tc3yhLbITynp0Oo7QHJGt07esPoJOTaFAqRP/P4nIvdktC4QRXlIC3FuT6SwLno7',
    //     'S7mNG7dNCvIlOXb6ZnyNYhrkS5BGOYxTUjFjAcr7JtiB77bxjaSmBATkNdFI8KWp',
    //     'pVFLTF1iBYDXfl8atXmz58B5CSxd0ejkhISqDZF5EwpjdCtXqY/0LF1P5svHGmKr',
    //     'NOV9Fpka/V1D9CLBFbHkGxXUp0vpruclgvm5EpFZsMAXNux0yuzGbFsFFbmJJIb9',
    //     'iTXZS/wzFgMGmYxbhKQpYXqHETjU3JDiQrD/Lb9kxUy5dXueHlorl6oxAgMBAAGj',
    //     'QjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFDLTOfxWT2KeqvIsuXlc0L6x',
    //     '/CV2MA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEAf18ky3mVD4X3',
    //     '1TIWYO1qx9+UKlPvmpENgbsC3rcj0E/UcOFR2hMqS38UqvO4ePHJ5w9NIr4ODL1t',
    //     'VqfBfXnH4HyeCmRAFHcsiX4JvnzCpPApbZ9EV+4gfaRjD00Qq5o/AbnF12Hkr7K9',
    //     'z7MXVsMFN54MV54LietBe6ecFprQh0h7m4RdxOnQMAoY4VMz2WrReXo6nY/kbEQl',
    //     'HXXSsaWEFcTZIHfUO9sJGixTLw+1rdlW0KEP3RSDlu5n40upkLPAXYfdQUlyb9Cd',
    //     'O0NwsS4vh2zJoPFP1N5T8XMkKEX8hEdfIG7gvp7/YBNIIHt0CXoccvsYfklewCax',
    //     'cOL01eCUrg==',
    //     '-----END CERTIFICATE-----',
    // ].join("\n");

    
    if (!event.authToken) {
    	callback('Could not find authToken');
    	return;
    }

    var accessToken = event.authToken.split(' ')[0];
    var userToken = event.authToken.split(' ')[1];
//    var token = event.authToken;
    console.log("event.authToken: " + event.authToken);
    console.log("token(access): " + accessToken);
    console.log("token(user): " + userToken);

    // var option = {
    //     algorithms: ["RS256"]
    // }
    // //var secretBuffer = new Buffer(process.env.AUTH0_SECRET);
    // var secretBuffer = publicKey;
    // console.log("Secret: " + secretBuffer);
    // jwt.verify(userToken, secretBuffer, option, function(err, decoded){
    // 	if(err){
    // 		console.log('Failed jwt verification: ', err, 'auth: ', userToken);
    // 		callback('Authorization Failed');
    // 	} else {

        var options = {
          url: 'https://'+ process.env.DOMAIN + '/userinfo',
          method: 'GET',
          json: true,
          headers:{
              'Authorization': "Bearer " + accessToken
          }
        };

        request(options, function(error, response, body){
            console.log("Request Error: " + error);
            console.log("Response Code: " + response.statusCode);
            console.log("Response Body: " + JSON.stringify(body));
            if (!error && response.statusCode === 200) {
              console.log("Success Body: " + body);
            callback(null, body);
          } else {
            callback(error);
          }
        });
    	// }
    // })
};