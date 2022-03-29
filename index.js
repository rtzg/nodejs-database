var port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const util = require('util');

var json;

http.createServer(function (req, res) {
    if(req.url.includes('/get')){
        try {
            fs.readFile('data.json', function(err, data) {
                    res.writeHead(200, {'Content-Type': 'text/json'});
                    var search = req.url.split('?')[1];
                    json = JSON.parse(data)['data'][search];
                    res.write(JSON.stringify(json) === undefined ? `{"error":"Missing or unknown index"}` : '{"data":' + JSON.stringify(json) + '}');
                    console.log(json);
                    return res.end();
            });
        } catch (err) {
            res.writeHead(200, {'Content-Type': 'text/json'});
            res.write(JSON.stringify({error: e}));
        }
    }
    else if (req.url.includes('/set')){
        try{
            var search = req.url.split('?')[1];
            var name = search.split('name=')[1].split('&')[0];
            var value = search.split('value=')[1];
            var orginData;
            var FData = {};
            if(name!=undefined && value!=undefined){
                fs.readFile('data.json', function(err, data) {
                    orginData = JSON.parse(data);
                    FData[name] = decodeURIComponent(value);
                    orginData['data'][name] = FData[name];
                    orginData = decodeURIComponent(JSON.stringify(orginData));
                    res.writeHead(200, {'Content-Type': 'text/json'});
                    res.write(JSON.stringify(FData));
                    fs.writeFile('data.json', orginData, function(err) {
                        if(err != null) {
                            return console.log(err);
                        }
                        
                    });
                });
            }
            else {
                res.writeHead(200, {'Content-Type': 'text/json'});
                res.write(JSON.stringify({error: 'Missing value or name'}));
            }
        } catch (e) {
            res.writeHead(200, {'Content-Type': 'text/json'});
            res.write(JSON.stringify({error: e}));
        }

    }
    else {
        fs.readFile('index.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    }
}).listen(port);
console.log('Server running at http://localhost:' +port + '/');