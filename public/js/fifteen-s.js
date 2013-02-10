/**
 * Fifteen Seconds client.
 *
 * Fetches OpenTok session information from server, and connects to OpenTok.
 *
 * The webcam is streamed when told to by the server via the socket. Streaming
 * stops when a new stream is sent from OpenTok (another person started
 * streaming)
 */

var FifteenS = function (auth) {
  this.initialize = function () {
    this.apiKey = auth.key;
    this.sessionId = auth.sessionId;
    this.token = auth.token;

    this.session = TB.initSession(this.sessionId);

    this.session.addEventListener('sessionConnected', this.connected.bind(this));
    this.session.addEventListener('streamCreated', this.showStream.bind(this));

    this.session.connect(this.apiKey, this.token);
  }

  /*
   * Connect to socket, listen to socket events.
   */
  this.connected = function (event) {
    this.socket = io.connect('');

    /* prepare to be famous */
    this.socket.on('prepare', function () {
      if (!this.isPublished()) {
        $('#header .logo').text('You are next!');
      } else {
        $('#header .logo').text('Go again!');
      }
    }.bind(this));

    /* be famous */
    this.socket.on('fameon', function () {
      this.publish();
    }.bind(this));

    /* enough famousness. share the spotlight. */
    this.socket.on('fameoff', function () {
      this.unpublish();
    }.bind(this));

    // update the number of users online
    this.socket.on('number', function (num) {
      $('.num').text(num);
    }.bind(this));

    // display current stream, if any.
    this.showStream(event);
  }

  /**
   * Publish this stream
   */
  this.publish = function (event) {
    $('#header .logo').text('On Air!');
    // given another chance. Buisness as usual
    if (this.isPublished()) {
      return;
    }
    var properties = {
      height: 400,
      width: 700
    };

    if (this.subscriber) {
      this.session.unsubscribe(this.subscriber);
      delete this.subscriber;
    }

    // add an element to the preview box. This element will be removed on
    // unpublish
    $("#preview").append($.create('<div id="' + '1' +'">'))
    this.publisher = TB.initPublisher(this.apiKey, '1' , properties);
    // Send my stream to the session
    this.session.publish(this.publisher);
  };

  /*
   * Return whether or not we are published
   */
  this.isPublished = function () {
    return !!this.publisher;
  };

  /**
   * unpublish this stream
   */
  this.unpublish = function () {
    $('#header .logo').text('15 Seconds');
    if (this.isPublished()) {
      this.session.unpublish(this.publisher);
      delete this.publisher;
      }
  };

  /**
   * show a newly published stream (not ours)
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

    // stop publishing own stream
    if (this.isPublished()) {
      this.unpublish()
    }

    // Subscribe to the stream
    var properties = {
      height: 400,
      width: 700
    };
    var id = "stream-" + stream.streamId;
    $("#preview").append($.create('<div id="' + id +'">'))
    this.subscriber = this.session.subscribe(stream, id, properties);
  };
  this.initialize();
};

/**
 * Fetch OpenTok session info
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
    // Failed
    console.log('fifteenseconds: error getting session', err);
  });
});

