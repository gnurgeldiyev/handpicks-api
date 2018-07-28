const { User } = require('../models/user');
const { Link } = require('../models/link');
const { Post } = require('../models/post');
const { TopicFollow } = require('../models/topicFollow');
const { topicFollowToJson, postToJson } = require('../helpers/jsonMethods');
const validator = require('validator');

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
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}

/**
 * GET | user posts based on followed topics
*/
exports.getUserPosts = async (req, res) => {
  const userId = req.params.userId;

  const followedTopics = await TopicFollow.find({ follower: userId }).select({ _id: 0, followee: 1 })
  .catch((err) => { 
    return res.status(500).json({ err: err.message }) 
  });
  // return 404, if there is no any followed topics.
  if (followedTopics.length === 0) {
    return res.sendStatus(404);
  }
  // getting topicId(s) in single Array
  let topicIds = [];
  followedTopics.forEach(topic => {
    topicIds.push(topic.followee);
  });

  Post.find({ topic: { $in: topicIds }}).populate('owner').populate('topic').sort({ created: -1})
  .then((response) => {
    if (!response) { return res.sendStatus(404); }

    let posts = [];
    response.forEach((post) => {
      posts.push(postToJson(post));
    });
    return res.status(200).json({ posts });
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}

/**
 * POST | user sign in
*/
exports.userSignIn = (req, res) => {
  const newUser = req.body.user;

  if (!newUser 
    || !newUser.username 
    || !newUser.email
    || !validator.isEmail(newUser.email)
    || !newUser.name 
    || !newUser.lastname 
    || !newUser.avatar
    || !newUser.token) {
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
        avatar: newUser.avatar,
        token: newUser.token
      });

      user.save()
      .then(() => {
        return res.status(201).json({
          user: user.profileToJson()
        });
      })
      .catch((err) => {
        return res.status(400).json({
          err: err.message
        });
      });
    }

    if (response) {
      response.token = newUser.token;
      let user = response;

      user.save()
      .then(() => {
        return res.status(200).json({
          user: user.profileToJson()
        });
      })
      .catch((err) => {
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
 * POST | user logout
*/
exports.userLogout = (req, res) => {
  const userId = req.params.userId;
  const user = req.body.user;

  User.findOneAndUpdate({
    _id: userId,
    token: user.token
  }, {
    $set: {
      token: null
    }
  }, { new: true })
  .then((response) => {
    if (!response) {
      return res.status(400).json({ err: "User token does not match with stored token."});
    }
    return res.sendStatus(204);
  })
  .catch((err) => {
    return res.status(422).json({
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
  
  const oldUser = await User.findById(userId)
  .catch((err) => { 
    return res.status(500).json({ err: err.message }) 
  });

  User.findByIdAndUpdate(userId, {
    $set: {
      username: user.username || oldUser.username,
      name: user.name || oldUser.name,
      lastname: user.lastname || oldUser.lastname,
      avatar: user.avatar || oldUser.avatar,
    }
  }, { new: true })
  .then((response) => {
    return res.status(200).json({ user: response.profileToJson() });
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