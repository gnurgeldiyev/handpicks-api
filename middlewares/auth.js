const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('../config/handpicks-test-firebase-adminsdk-2wp2c-b0d441f993.json');
const { getAuthToken } = require('../helpers/helper');
const { User } = require('../models/user');
const { Manager } = require('../models/manager');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://handpicks-test.firebaseio.com"
});

/** 
 * Function | Checks is user authenticated with Firebase Auth
*/
exports.isAuthenticatedUser = (req, res, next) => {
  
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
      if (!response) { 
        return res.sendStatus(401);
      }
      
      User.findOne({ token })
      .then((response) => {
        if (!response) {
          return res.sendStatus(401);
        }
        next(); 
      })
      .catch((err) => {
        console.log(`err: ${err} \nmessage: ${err.message}`);
        return res.sendStatus(401);
      });
    })
    .catch((err) => {
      console.log(`err: ${err} \nmessage: ${err.message}`);
      return res.sendStatus(401);
    }); 
  })
  .catch((err) => {
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return res.sendStatus(401);
  });
}

/** 
 * Function | Checks is user authenticated with Firebase Auth
*/
exports.isAuthenticatedManager = (req, res, next) => {
  const token = getAuthToken(req.get('authorization'));

  if (!token) {
    return res.sendStatus(401);
  }

  Manager.findOne({ token })
  .then((response) => {
    if (!response) {
      return res.sendStatus(401);
    }

    const id = response.verifyToken().id;
    Manager.findById(id)
    .then((response) => {
      if (!response) {
        return res.sendStatus(401);
      }
      
      next();
    }) 
    .catch((err) => {
      console.log(`err: ${err} \nmessage: ${err.message}`);
      return res.sendStatus(401);
    });
  })
  .catch((err) => {
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return res.sendStatus(401);
  });
}