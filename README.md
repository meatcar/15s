fifteenseconds
===

A video chat room where a user gets shown to the whole room every 15
seconds at random.

## Installation

Make sure `node` is installed on your system. Follow instructions on
[http://nodejs.org/](http://nodejs.org/).

Then, run `npm install` from the root directory of this repo.

Also, make sure to visit http://www.tokbox.com/ and register and get an
API Key and secret.

## Running

Run the following in a shell, and visit the displayed URL:

    export OPENTOK_KEY='<your OpenTok API key>'
    export OPENTOK_SECRET='<your OpenTok API secret>'
    node app.js

## Organization

This repository follows the standard [expressjs](http://expressjs.com/)
layout. One exception is that all [socket.io](http://socket.io/) related activity is factored out into `/sockets.js` to keep `app.js` clean.
