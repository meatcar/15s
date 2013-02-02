/**
 * Notes:
 *
 *  - session should be made once by the server, and communicated to the client.
 *  - each client keeps their own stream lists.
 *
 */
$.domReady(function () {
    var apiKey = '22769732',
        sessionId = '1_MX4yMTgwNTk0Mn5-U2F0IEZlYiAwMiAwNzo1NjoyMiBQU1QgMjAxM34wLjE2NzgzNDY0fg',
        token = 'T1==cGFydG5lcl9pZD0yMjc2OTczMiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz0zOTE4YzE3YzkyOTg2ZWI4N2YyNGI2NWViNGI5YWI1MDgyYTk0YmI3OnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9Ml9NWDR5TWpjMk9UY3pNbjR4TWpjdU1DNHdMakYtVTJGMElFWmxZaUF3TWlBeE1qbzFNam94TWlCUVUxUWdNakF4TTM0d0xqQTBPRFkxTWpVemZnJmNyZWF0ZV90aW1lPTEzNTk4MzgzOTEmbm9uY2U9MC4wMTY3MDIxMDczNDk3MDc3ODQmZXhwaXJlX3RpbWU9MTM2MDQ0MzE5MSZjb25uZWN0aW9uX2RhdGE9',
        TB = window.TB,
        streams = null;

    TB.setLogLevel(TB.DEBUG); // Set this for helpful debugging messages in console

    var session = TB.initSession(sessionId);

    session.addEventListener('sessionConnected', sessionConnectedHandler);
    session.addEventListener('streamCreated', streamCreatedHandler);
    session.connect(apiKey, token);

    var publisher;

    function sessionConnectedHandler(event) {
      var publishProps = {height:240, width:320};

      publisher = TB.initPublisher(apiKey, 'preview', publishProps);
      // Send my stream to the session
      session.publish(publisher);

      // Subscribe to streams that were in the session when we connected
      subscribeToStreams(event.streams);
    }

    function streamCreatedHandler(event) {
      // Subscribe to any new streams that are created
      subscribeToStreams(event.streams);
    }

    function subscribeToStreams(new_streams) {
      console.log(new_streams);
      streams = new_streams;
    }
    session.connect(apiKey, token);

    var socket = io.connect('http://localhost:3000');

    socket.on('fame', function (data) {
      var streamId = data.stream_id;

      //session.subscribe(stream, "#famebox");

      // TODO: probably scan the entire stream list.
    });
});
