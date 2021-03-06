/**
 * The brain. Saves new user connections, picks random users to broadcast every
 * 15 seconds.
 */
var socketio = require('socket.io');

exports.start = function (server) {
  var io = socketio.listen(server),
    users = [],
    streams = {}, /* maps: user => socket */
    next_uid; // current famous uid

  // heroku config. Dump this to speed up disconnects.
  io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
  });

  io.sockets.on('connection', function (socket) {
    // remember user and socket
    var uid = createUUID();
    users.push(uid);
    streams[uid] = socket;

    // tell first user to publish video.
    if (users.length === 1) {
      next_uid = uid;
      pick();
    }

    // update on number of users
    socket.broadcast.emit('number', users.length);
    socket.emit('number', users.length);

    socket.on('disconnect', function () {
      // Clean up user and socket storage.
      streams[uid] = undefined;
      var idx = users.indexOf(uid);
      if (idx !== -1) {
        // uid is in array.
        users.splice(idx, 1);
      }
      // update on num of users
      socket.broadcast.emit('number', users.length);
    });
  });

  // prepare a stream to be published every 15 seconds.
  // Pick it 5 seconds later.
  setInterval(prepare, 15000);
  setTimeout(function () {
    setInterval(pick, 15000);
  }, 5000);

  // Pick a stream at random, and warn it.
  function prepare() {
    // skip if only one user or less.
    if (users.length <= 0) {
      return false;
    }
    var index = getRandomArbitary(0, users.length - 1),
      id = users[index],
      socket = streams[id];

    next_uid = id;

    socket.emit('prepare');
  }

  /*
   * Tells the user to broadcast.
   */
  function pick(){
    var socket = streams[next_uid];
    if (!socket) {
      if (!prepare()) {
        // a user quit in the last 5 seconds, and none are left. stop picking.
        return
      }
    }
    socket.emit('fameon');
  }

  /*
   * Returns a uniformly random number between min and max
   */
  function getRandomArbitary(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    s[14] = "4";
    // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";

    return s.join("");
  }
}
