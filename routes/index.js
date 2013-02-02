var OpenTok = require('opentok'),
  auth = null;

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.html', { title: '15 Seconds' });
};

exports.auth = function(req, res){
  var key = '22769732',
    secret = '78eb8ac2bd82e286c0d1411e2d34c91a7d1f1fc2',
    opentok = new OpenTok.OpenTokSDK(key, secret),
    session, token;

  // Check if we dont have an already made session.
  if (auth !== null) {
    res.json(auth);
    return;
  }

  opentok.createSession('localhost', function(result) {
    session = result;

    token = opentok.generateToken({
      session_id: session,
      role: OpenTok.RoleConstants.MODERATOR
    });

    auth = {token: token, sessionId: session};
    res.json(auth);
  });
};
