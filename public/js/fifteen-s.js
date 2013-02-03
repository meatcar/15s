/**
 * Notes:
 *
 *  - session should be made once by the server, and communicated to the client.
 *  - each client keeps their own stream lists.
 *
 */

/**
 *
 */
$.domReady(function () {
  $.ajax({
    method: "GET",
    url: "/auth",
    type: "json"
  }).then(function (resp) {
    // Success
    window.FifteenS = new FifteenS(resp);

  }).fail(function (err) {
    // Failure
    console.log('15s: error getting session', err);
  });
});

var FifteenS = (function () {
  var FifteenS = function (auth) {
    this.initialize = function () {
      var TB = window.TB;
      this.apiKey = auth.key;
      this.sessionId = auth.sessionId;
      this.token = auth.token;

      TB.setLogLevel(TB.DEBUG); // Set this for helpful debugging messages in console

      this.session = TB.initSession(this.sessionId);

      this.session.addEventListener('sessionConnected', this.connected.bind(this));
      this.session.addEventListener('streamCreated', this.showStream.bind(this));

      this.session.connect(this.apiKey, this.token);
    }

    this.connected = function (event) {
      console.log("connected");

      this.socket = io.connect('http://localhost:3000');

      /* prepare to be famous */
      this.socket.on('prepare', function (data) {
        //TODO do flashy shit
      }.bind(this));

      /* be famous */
      this.socket.on('fameon', function (data) {
        console.log('fameon');
        this.publish();
      }.bind(this));

      /* enough famousness. share the spotlight. */
      this.socket.on('fameoff', function () {
        console.log('fameoff');
        this.unpublish();
      }.bind(this));
    }

    /**
     * Publish this stream
     */
    this.publish = function (event) {
      // skip if given another chance.
      if (this.isPublished) {
        return;
      }
      var properties = {
        height: 240,
        width: 320
      };

      this.isPublished = true;

      if (this.subscriber) {
      this.session.unsubscribe(this.subscriber);
      }

      $("#preview").append($.create('<div id="' + '1' +'">'))
      this.publisher = TB.initPublisher(this.apiKey, '1' , properties);
      // Send my stream to the session
      this.session.publish(this.publisher);
    };

    /**
     * unpublish this stream
     */
    this.unpublish = function () {
      if (this.isPublished) {
        this.session.unpublish(this.publisher);
        this.isPublished = false;
      }
    };

    /**
     * show a newly published stream
     */
    this.showStream = function (event) {
      var stream = event.streams[0];
      // make sure a stream is included.
      if (typeof stream === 'undefined') {
        return;
      }
      // dont show own stream.
      if (stream.connection.connectionId === this.session.connection.connectionId) {
        return;
      }

      // if
      if (this.isPublished) {
        this.unpublish()
      }

      // Subscribe to the stream
      var id = "stream-" + stream.streamId;
      $("#preview").append($.create('<div id="' + id +'">'))
      this.session.subscribe(stream, id);
      this.subscriber = stream;
    };
    this.initialize();
  }

  return FifteenS;
})();
