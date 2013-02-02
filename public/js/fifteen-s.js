(function () {
    var apiKey = '22769732',
        sessionId = '1_MX4yMTgwNTk0Mn5-U2F0IEZlYiAwMiAwNzo1NjoyMiBQU1QgMjAxM34wLjE2NzgzNDY0fg',
        token = 'T1==cGFydG5lcl9pZD0yMTgwNTk0MiZzaWc9NTg5MDU2MjhhZGVlZjA3MjM2MTVhYWQ0M2EzYTc5Y2FjZTg2ZjljOTpzZXNzaW9uX2lkPTFfTVg0eU1UZ3dOVGswTW41LVUyRjBJRVpsWWlBd01pQXdOem8xTmpveU1pQlFVMVFnTWpBeE0zNHdMakUyTnpnek5EWTBmZyZjcmVhdGVfdGltZT0xMzU5ODIwNTgyJmV4cGlyZV90aW1lPTEzNTk5MDY5ODImcm9sZT1wdWJsaXNoZXImbm9uY2U9NDE4OTcx',
        TB = window.TB;

    TB.setLogLevel(TB.DEBUG); // Set this for helpful debugging messages in console

    var session = TB.initSession(sessionId);

    session.addEventListener('sessionConnected', function (event) {
    });
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

    function subscribeToStreams(streams) {
      for (var i = 0; i < streams.length; i++) {
        // Make sure we don't subscribe to ourself
        if (streams[i].connection.connectionId == session.connection.connectionId) {
          return;
        }

        // Create the div to put the subscriber element in to
        var div = document.createElement('div');
        div.setAttribute('id', 'stream' + streams[i].streamId);
        document.body.appendChild(div);

        // Subscribe to the stream
        session.subscribe(streams[i], div.id);
      }
    }
    session.connect(apiKey, token);
})()
