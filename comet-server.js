var connect = require('connect'),
    faye = require('faye'),
    maps = require('./comet/maps.js');

var server = connect.createServer(
    connect.static(__dirname + '/static'),
    connect.router(function(app) {
        app.get('/checkMap/:mapname', function(req, res, next) {
            res.writeHead(200);
            res.write('{ "available": ' +
                (maps.checkMap(req.params.mapname) ? 1 : 0) + '}');
            res.end();
        });
    })
);

var bayeux = new faye.NodeAdapter({mount: '/comet', timeout: 45});
bayeux.addExtension(maps.fayeExtension);

bayeux.attach(server);
server.listen(8000);
