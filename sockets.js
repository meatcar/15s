/**
 * Socket.io functionality
 */
var socketio = require('socket.io');

exports.start = function (server) {
  var io = socketio.listen(server);
  io.sockets.on('connection', function (socket) {
    socket.emit('fame', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });
}
