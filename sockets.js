/**
 * Socket.io functionality
 */
var socketio = require('socket.io');

exports.start = function (server) {
  var io = socketio.listen(server),
    users = [],
    streams = {}, /* maps: user => socket */
    currentUid; // current famous uid

  io.sockets.on('connection', function (socket) {
    var uid = createUUID();
    users.push(uid);
    streams[uid] = socket;

    if (users.length === 1) {
      currentUid = uid;
      pick();
    }

    socket.on('disconnect', function () {
      console.log('disconnecting');
      // Clean up uid and socket storage.
      delete streams[uid];
      var idx = users.indexOf(uid);
      if (idx !== -1) { // uid in array.
        users.splice(idx, 1);
      }
    });
  });

  // Wait 15s before famousing a stream
  setInterval(prepare, 15000);
  setTimeout(function () {
    setInterval(pick, 15000);
  }, 5000);

  // Pick a stream at random, and tell it to be famous.
  function prepare() {
    // skip if only one user or less.
    if (users.length <= 0) {
      return false;
    }
    var index = getRandomArbitary(0, users.length - 1),
      id = users[index],
      socket = streams[id];

    currentUid = id;

    socket.emit('prepare', {
      uid: id
    });
  }

  function pick(){
    var socket = streams[currentUid];
    if (!socket) {
      // if a user quit in the last 5 seconds, and none are left, quit.
      if (!pick()) {
        return
      }
    }
    socket.emit('fameon', {
      uid: currentUid
    });
  }

  // Returns a uniformly random number between min and max
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
