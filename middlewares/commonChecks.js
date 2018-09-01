const { User } = require('../models/user');
const { Topic } = require('../models/topic');
const { Post } = require('../models/post');
const { Manager } = require('../models/manager');
const { Client } = require('../models/client');
const { Message } = require('../models/message');
const { getClientConfig, unhashClientName, getAuthToken } = require('../helpers/helper');
const { isMongoId } = require('validator');
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
  if (!isMongoId(userId)) {
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
 * checks is topic exists for request params with topic ID
*/
exports.isTopicIdExistsForParams = (req, res, next) => {
  const topicId = req.params.topicId;
  if (!isMongoId(topicId)) {
		return res.sendStatus(400);
	}
  Topic.findOne({ _id: topicId, deleted: false })
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
 * checks is topic exists for request params with topic URl
*/
exports.isTopicUrlExistsForParams = (req, res, next) => {
  const topicUrl = req.params.topicUrl;
  Topic.findOne({ url: topicUrl, deleted: false })
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
  if (!isMongoId(topicId)) {
		return res.sendStatus(400);
	}
	Topic.findOne({ _id: topicId, deleted: false })
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
  if (!isMongoId(postId)) {
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
  if (!isMongoId(managerId)) {
		return res.sendStatus(400);
	}
  Manager.findOne({ _id: managerId, deleted: false })
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
exports.isAdmin = (req, res, next) => {
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
      Manager.findOne({ _id: id, role: 'admin' })
        .then((response) => {
          if (!response) {
            return res.sendStatus(401);
          }
          next();
        }) 
        .catch((err) => {
          console.log(`err: ${err} \nmessage: ${err.message}`);
          return res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.log(`err: ${err} \nmessage: ${err.message}`);
      return res.sendStatus(500);
    });
}
/** 
 * checks is client exists
*/
exports.isClientExistsForParams = (req, res, next) => {
  const clientId = req.params.clientId;
  if (!isMongoId(clientId)) {
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
/** 
 * checks is message exists
*/
exports.isMessageExistsForParams = (req, res, next) => {
  const messageId = req.params.messageId;
  if (!isMongoId(messageId)) {
		return res.sendStatus(400);
	}
  Message.findById(messageId)
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