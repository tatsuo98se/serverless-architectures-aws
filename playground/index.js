'use strict'

const https = require('https');

const options = {
  protocol: 'https:',
  host: '9g0cxeq20b.execute-api.us-east-1.amazonaws.com',
  path: '/dev/s3-policy-document?filename=%E4%BC%B8%E3%81%B2%E3%82%99%E7%B8%AE.mov',
  method: 'GET',
　　　　headers: {
    'authorization': 'RZ8eFQmVdU7n_Irs88JuxyBvBuiUQUxa eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9UUTRNVVEzUmpNd05UWkNOVUpGTjBVMk9UWTJNRGt5TkRkRU16WXdSRVF5UVVVeFFqTkJNUSJ9.eyJlbWFpbCI6InRhdHN1bzk4c2VAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vdGF0c3VvOThzZS5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDUxMDQ3NTQ5NTQzNTczNjEwNDgiLCJhdWQiOiIxRlYxcG5xRTRrMWQ2SXo0SGJTN3BMSmpqeVd6bDVobyIsImlhdCI6MTU1MzEzMTI3OCwiZXhwIjoxNTUzMTY3Mjc4LCJhdF9oYXNoIjoiMWpvTHItZkFWbS1vOUlhZWF6aHpEZyIsIm5vbmNlIjoibTVWUzVCVFZwNXE4UndVSlJ0SFFNa09QX011dFE5ZVIifQ.rUYbfcCYOXbm254REVuA3cqZoeBjH6ixhXBYfTIo27LYrQXVM4h5VjoqOsqEOdYbOQhJWIknNXuknCoVgS2Vo0rXTWtuWQEOYVHrOWBEmbZGPHVsRCQPwmq0_oRfwtyw4XY4cUwHaHwyGBy1Srz93aAcrIcAy69LfbygKBAy9M8Yw2WVFYf-2wd-DcK7ssyuA11PaxMeimHa0XU-rx_rEiT8zMkHMVCtSp5QBEUh8mF1w8ZifGBaL0XDo6HWabQLMMe-sW3v7o3ite0pJ6vVPDt8hYb04iqo2HQg-1IbT4cNrm04MnkKQI4pknfh0VjXI5stxXoFBo2osxf7U3Bqzg'
  }
};

const req = https.request(options, (res) => {
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
})

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();