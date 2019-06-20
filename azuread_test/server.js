var http = require('http');
var fs = require('fs');
var httpServer = http.createServer();
const { promisify } = require('util');

function getExtension(filename) {
    return filename.split('.').pop();
}


httpServer.on('request', function (req, res) {
    var url = req.url;
    var path = './www' + url;

    console.log('url: ' + url);
    var target = { filename: '' };
    if (url == '/') {
        target = {
            filename: './www/index.html',
            contentType: 'text/html'
        }
    }
    else if (url.startsWith('/libs/')) {
        target = {
            filename: "." + url,
            contentType: 'text/javascript'
        }
    }
    else {
        switch (getExtension(url)) {
            case 'js':
                target = {
                    filename: path,
                    contentType: 'text/javascript'
                }
                break;
            default:
        }
    }

    promisify(fs.readFile)(target.filename, 'utf-8')
        .then(data => {
            res.writeHead(200, { "Content-Type": target.contentType });
            res.end(data, 'utf-8');
        })
        .catch(err => {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('page not found');
            return res.end();
        }
        );
});

httpServer.listen(8082);
