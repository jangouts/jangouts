var Hapi = require('hapi')
var Good = require('good')
var server = new Hapi.Server();

server.connection({port: 9000, routes: {cors: true}})

server.route({
  method: 'POST',
  path: '/messages',
  handler: function (request, reply) {
    var message = request.payload.content;
    if (request.payload.source !== undefined) {
      message = request.payload.source + ' ' + message;
    }
    request.log(request.payload.severity, message);
    reply({status: 'ok'})
  }
});

server.register({
  register: Good,
  options: {
    reporters: [{
      reporter: require('good-console'),
      events: {
        response: '*',
        log: '*',
        request: '*'
      },
    }, {
      reporter: require('good-file'),
      events: {
        request: '*'
      },
      config: {
        path: 'log',
        format: 'YYYY-MM-DD',
        prefix: 'clients',
        extension: '.log',
        rotate: 'daily'
      }
    }]
  }
}, function (err) {
  if (err) { throw err; }// something bad happened loading the plugin
});

server.start(function () {
  server.log('info', 'Server running at: ' + server.info.uri);
});
