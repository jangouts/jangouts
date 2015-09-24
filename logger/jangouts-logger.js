var Hapi = require('hapi')
var Good = require('good')
var server = new Hapi.Server();

server.connection({port: 9000, routes: {cors: true}})
// server.start(function() {
//   console.log('Server running at: ', server.info.uri)
// });

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
      }
    }]
  }
}, function (err) {
  if (err) {
    throw err; // something bad happened loading the plugin
  }

  server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
