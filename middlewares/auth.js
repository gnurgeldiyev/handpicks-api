const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('../config/handpicks-test-firebase-adminsdk-2wp2c-b0d441f993.json');
const { getAuthToken } = require('../helpers/helper');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://handpicks-test.firebaseio.com"
});

exports.isAuthenticated = (req, res, next) => {
  
  const token = getAuthToken(req.get('authorization'));

  if (!token) {
    return res.sendStatus(401);
  }

  // verify idToken comes from the client
  firebaseAdmin.auth().verifyIdToken(token)
  .then((decodedToken) => {
    const uid = decodedToken.uid;

    firebaseAdmin.auth().getUser(uid)
    .then((response) => {
      if (response) { next(); }

      return res.sendStatus(401);
    })
    .catch((err) => {
      return res.status(500).json({ err: err.message });
    }); 
  })
  .catch((err) => {
    return res.status(500).json({ err: err.message });
  });
}