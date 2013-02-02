/**
 * Notes:
 *
 *  - session should be made once by the server, and communicated to the client.
 *  - each client keeps their own stream lists.
 *
 */
$.domReady(function () {
  $.ajax({
    method: "GET",
    url: "/auth",
    type: "json"
  }).then(function (resp) {
    main(resp);
  }, function (err) {
    console.log('15s: error getting session', err);
  });
});

function main (auth) {
  var socket = io.connect('http://localhost:3000'),
    TB = window.TB;

  var apiKey = '22769732',
    sessionId = auth.sessionId,
    token = auth.token;
  var archive;

  TB.setLogLevel(TB.DEBUG); // Set this for helpful debugging messages in console

  var session = TB.initSession(sessionId);

  session.addEventListener('sessionConnected', sessionConnectedHandler);
  session.addEventListener('streamCreated', streamCreatedHandler);
  session.connect(apiKey, token);

  var publisher;

  function archiveCreateHandler(event) {
        archive = event.archives[0];
    }

  function sessionConnectedHandler(event) {
    var publishProps = {height:240, width:320};

    publisher = TB.initPublisher(apiKey, 'preview', publishProps);
    console.log(event);
    session.addEventListener("archiveCreated", archiveCreateHandler);
    session.createArchive(apiKey, "perStream", archiveTitle);  
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


  socket.on('fame', function (data) {
    var streamId = data.stream_id;

    //session.subscribe(stream, "#famebox");

    // TODO: probably scan the entire stream list.
  });
}
