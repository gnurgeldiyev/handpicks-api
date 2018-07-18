const {
  User
} = require('../models/user');

/**
 * POST | user sign in
 */
exports.userSignIn = (req, res) => {
  const newUser = req.body.user;

  if (!newUser ||
    !newUser.username ||
    !newUser.email ||
    !newUser.name ||
    !newUser.lastname ||
    !newUser.avatar) {
    return res.sendStatus(400);
  }

  User.findOne({
      username: newUser.username
    })
    .then((response) => {
      if (!response) {
        let user = new User({
          username: newUser.username,
          email: newUser.email,
          name: newUser.name,
          lastname: newUser.lastname,
          avatar: newUser.avatar
        });

        user.save()
          .then(() => {
            return res.status(201).json({
              user: user.toAuthJSON()
            });
          }).catch((err) => {
            return res.status(400).json({
              err: err.message
            });
          });
      }

      if (response) {
        if (!newUser.token) {
          return res.sendStatus(400);
        }

        response.token = newUser.token;
        let user = response;

        user.save()
          .then(() => {
            return res.status(200).json({
              user: user.toAuthJSON()
            });
          }).catch((err) => {
            return res.status(400).json({
              err: err.message
            });
          });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        err: err.message
      });
    });
}