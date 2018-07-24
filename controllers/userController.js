const { User } = require('../models/user');
const { Link } = require('../models/link');
const { TopicFollow } = require('../models/topicFollow');
const { topicFollowToJson } = require('../helpers/jsonMethods');

/**
 * GET | get user by id
*/
exports.getUserById = (req, res) => {
  const userId = req.params.userId;
  
  User.findById(userId)
  .then((response) => {
    return res.status(200).json({ user: response.profileToJson() });
  })
  .catch((err) => {
    return res.status(400).json({ err: err.message });
  });
}

/**
 * GET | user follow or unfollow the topic
*/
exports.topicFollowUnfollow = (req, res) => {
  const userId = req.params.userId;
  const topicId = req.params.topicId;

  TopicFollow.findOne({ follower: userId, followee: topicId })
  .then((response) => {
    if (!response) { // follow the topic
      let topicFollow = new TopicFollow({
        follower: userId,
        followee: topicId
      });
    
      topicFollow.save()
      .then((response) => {
        TopicFollow.findById(response._id).populate('follower').populate('followee')
        .then((response) => {
          const topicFollow = topicFollowToJson(response);
          return res.status(200).json({ topicFollow });
        })
        .catch((err) => {
          return res.status(500).json({
            err: err.message
          });
        });
      })
      .catch((err) => {
        return res.status(500).json({
          err: err.message
        });
      });
    } else { // unfollow the topic
      TopicFollow.findOneAndRemove({ follower: userId, followee: topicId })
      .then(() => {
        return res.sendStatus(204);
      })
      .catch((err) => {
        return res.status(500).json({
          err: err.message
        });
      });
    }
  })

  
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
            user: user.profileToJson()
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
            user: user.profileToJson()
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

/**
 * PUT | user update profile
*/
exports.updateUser = async (req, res) => {
  const userId = req.params.userId;
  const user = req.body.user;

  if (!user) {
    return res.sendStatus(400);
  }
  
  const oldUser = await User.findById(userId);

  User.findByIdAndUpdate(userId, {
    $set: {
      username: user.username ? user.username : oldUser.username,
      name: user.name ? user.name : oldUser.name,
      lastname: user.lastname ? user.lastname : oldUser.lastname,
      avatar: user.avatar ? user.avatar : oldUser.avatar,
    }
  }, {new: true})
  .then((response) => {
    // get updated user
		User.findById(response._id)
		.then ((response) => {			
			return res.status(200).json({ user: response.profileToJson() });
		})
		.catch((err) => {
			return res.status(500).json({
				err: err.message
			});
		});
  })
  .catch((err) => {
    return res.status(422).json({
      err: err.message
    });
  });
}

/**
 * DELETE | delete user and delete all other user data (links, follows etc.)
*/
exports.deleteUser = (req, res) => {
  const userId = req.params.userId;

  TopicFollow.findOneAndRemove({ follower: userId })
  .then(() => {
    Link.findOneAndRemove({ owner: userId })
    .then(() => {
      User.findByIdAndRemove(userId)
      .then(() => {
        return res.sendStatus(204);
      })
      .catch((err) => {
        return res.status(500).json({
          err: err.message
        });
      });
    })
    .catch((err) => {
      return res.status(500).json({
        err: err.message
      });
    });
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
} 