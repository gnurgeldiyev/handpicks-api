const firebaseAdmin = require('firebase-admin');
const serviceAccount = require("../config/handpicks-test-firebase-adminsdk-2wp2c-b0d441f993.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://handpicks-test.firebaseio.com"
});

exports.isAuthenticated = (req, res, next) => {
  const idToken = req.body.credit.idToken;
  const user = req.body.user;

  // verify idToken comes from the client
  firebaseAdmin.auth().verifyIdToken(idToken)
  .then((decodedToken) => {
    const uid = decodedToken.uid;

    firebaseAdmin.auth().getUser(uid)
    .then((response) => {
      if (response.email === user.email) { next(); }

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