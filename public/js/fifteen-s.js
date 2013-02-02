(function () {
    var apiKey = '22769732',
        sessionId = '1_MX4yMjc2OTczMn4xMjcuMC4wLjF-U2F0IEZlYiAwMiAxMzoxNTo0NCBQU1QgMjAxM34wLjY4NzQzMzJ-',
        token = 'T1==cGFydG5lcl9pZD0yMjc2OTczMiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz0yMTAyZjlmN2FkOTI0NjJiNjQwYmE4MmQzNzUyNTkzZWE4MDRmZmIzOnJvbGU9bW9kZXJhdG9yJnNlc3Npb25faWQ9MV9NWDR5TWpjMk9UY3pNbjR4TWpjdU1DNHdMakYtVTJGMElFWmxZaUF3TWlBeE16b3hOVG8wTkNCUVUxUWdNakF4TTM0d0xqWTROelF6TXpKLSZjcmVhdGVfdGltZT0xMzU5ODM5NzU0Jm5vbmNlPTAuNzY1NTQ3OTEzMDYxOTkzOCZleHBpcmVfdGltZT0xMzYwNDQ0NTU0JmNvbm5lY3Rpb25fZGF0YT0=',
        TB = window.TB;

    TB.setLogLevel(TB.DEBUG); // Set this for helpful debugging messages in console

    var archive;
    var session = TB.initSession(sessionId);

    session.addEventListener('sessionConnected', function (event) {
    });

    var archiveTitle = "Archive " + new Date().getTime();
    
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
      session.addEventListener("archiveCreated", archiveCreateHandler);
      session.createArchive(apiKey, "perStream", archiveTitle);
      console.log(event);
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
