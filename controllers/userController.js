const { User } = require('../models/user');

/**
 * GET | get user by id
*/
exports.getUserById = (req, res) => {
  const id = req.params.id;
  User.findById(id)
  .then( (response) => {
    if (!response) { return res.sendStatus(404); }
    console.log(response);
    return res.status(200).json({ user: response.toProfileJSON() });
  })
  .catch( (err) => {
    return res.status(400).json({ err: err.message });
  });
}

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