const { User } = require('../models/user');
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

/**
 * DELETE | user unfollow the topic
*/
exports.unfollowTopic = (req, res) => {
  const userId = req.params.userId;
  const topicId = req.params.topicId;

  TopicFollow.findOneAndRemove({ follower: userId, followee: topicId})
  .then(() => {
    return res.sendStatus(204);
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}