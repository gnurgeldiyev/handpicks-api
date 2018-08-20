const { User } = require('../models/user');
const { Topic } = require('../models/topic');
const { Post } = require('../models/post');
const { Manager } = require('../models/manager');
const { Client } = require('../models/client');
const { getClientConfig, unhashClientName } = require('../helpers/helper');

/** 
 * checks client API Key
*/
exports.isValidClient = (req, res, next) => {
  if (!getClientConfig(req.get('authorization'))) {
    return res.sendStatus(401);
  }
  const client = getClientConfig(req.get('authorization'));
  const name = unhashClientName(client.name).public_name;

  Client.findOne({ public_name: name, 'api_key': client.apiKey })
  .then((response) => {
    if (!response) {
      return res.sendStatus(401);
    }

    const decodedApiKey = response.verifyApiKey(client.apiKey).id;
    if (response._id.toString() !== decodedApiKey) {
      return res.sendStatus(401);
    }
    next();
  })
  .catch((err) => {
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return res.sendStatus(500);
  });
}

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
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return res.sendStatus(500);
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
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return res.sendStatus(500);
  });
}

/** 
 * checks is topic exists for request body
*/
exports.isTopicExistsForBody = (req, res, next) => {
  const topicId = req.body.link.topicId;
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
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return res.sendStatus(500);
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
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return res.sendStatus(500);
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
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return res.sendStatus(500);
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
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return res.sendStatus(500);
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
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return res.sendStatus(500);
  });
}