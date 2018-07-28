const { User } = require('../models/user');
const { Topic } = require('../models/topic');
const { Post } = require('../models/post');
const { Manager } = require('../models/manager');
const { Client } = require('../models/client');

/** 
 * checks is user exists
*/
exports.isUserExistsForParams = (req, res, next) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.sendStatus(400);
  }

  User.findById(userId)
  .then((response) => {
    if (!response) { 
			return res.sendStatus(404);
    }
    next();
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}

/** 
 * checks is topic exists for request params
*/
exports.isTopicExistsForParams = (req, res, next) => {
  const topicId = req.params.topicId;
  if (!topicId) {
    return res.sendStatus(400);
  }

  Topic.findById(topicId)
  .then((response) => {
    if (!response) { 
			return res.sendStatus(404);
    }
    next();
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}

/** 
 * checks is topic exists for request body
*/
exports.isTopicExistsForBody = (req, res, next) => {
  const newLink = req.body.link;
  if (!newLink) {
    return res.sendStatus(400);
  }

	Topic.findById(newLink.topicId)
  .then((response) => {
		if (!response) { 
			return res.sendStatus(404);
    }
    next();
  })
  .catch((err) => {
    return res.status(500).json({ err: err.message });
  });
}

/** 
 * checks is post exists for request params
*/
exports.isPostExistsForParams = (req, res, next) => {
  const postId = req.params.postId;
  if (!postId) {
    return res.sendStatus(400);
  }

  Post.findById(postId)
  .then((response) => {
    if (!response) { 
			return res.sendStatus(404);
    }
    next();
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}

/** 
 * checks is manager exists for request params
*/
exports.isManagerExistsForParams = (req, res, next) => {
  const managerId = req.params.managerId;
  if (!managerId) {
    return res.sendStatus(400);
  }

  Manager.findById(managerId)
  .then((response) => {
    if (!response) { 
			return res.sendStatus(404);
    }
    next();
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}

/** 
 * checks is manager role equal to admin
*/
exports.isAdminForParams = (req, res, next) => {
  const managerId = req.params.managerId;

  Manager.findOne({ _id: managerId, role: 'admin' })
  .then((response) => {
    if (!response) {
      return res.sendStatus(401);
    }
    next();
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  })
}

/** 
 * checks is client exists
*/
exports.isClientExistsForParams = (req, res, next) => {
  const clientId = req.params.clientId;
  if (!clientId) {
    return res.sendStatus(400);
  }

  Client.findById(clientId)
  .then((response) => {
    if (!response) { 
			return res.sendStatus(404);
    }
    next();
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}