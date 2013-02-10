/*
 * GET Main Page
 */

exports.index = function(req, res){
  res.render('index.html', { title: '15 Seconds' });
};

/*
 * GET authenticated OpenTok session
 */

// using https://github.com/opentok/opentok-node
var OpenTok = require('opentok'),
  auth = null; // the authenticated session

exports.auth = function(req, res){
  var key = process.env.OPENTOK_KEY || "22769732",
    secret = process.env.OPENTOK_SECRET || "78eb8ac2bd82e286c0d1411e2d34c91a7d1f1fc2",
    opentok = new OpenTok.OpenTokSDK(key, secret);

  // Check if we dont have an already made session.
  if (auth !== null) {
    res.json(auth);
    return;
  }

  opentok.createSession(function(result) {
    var session = result,
      token = opentok.generateToken({
      session_id: session,
      // publisher role to give people permission to publish
      role: OpenTok.RoleConstants.PUBLISHER
    });

    // save session info, and send it back.
    auth = {
      token: token,
      sessionId: session,
      key: key
    };
    res.json(auth);
  });
};
