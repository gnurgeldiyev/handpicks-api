const { User } = require('../models/user');
const { Topic } = require('../models/topic');

/** 
 * checks matching of param user id ? body user id 
*/
exports.isUserIdMatch = (req, res, next) => {
  const id = req.params.id;
	const newLink = req.body.link;

	if (id !== newLink.ownerId) { 
		return res.sendStatus(400);
	}
  next();
}

/** 
 * checks is user exists
*/
exports.isUserExists = (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
  .then( (response) => {
    if (!response) { 
			return res.sendStatus(404);
    }
    next();
  })
  .catch( (err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}

/** 
 * checks is topic exists
*/
exports.topicCheck = (req, res, next) => {
  const newLink = req.body.link;

	Topic.findById(newLink.topicId)
  .then( (response) => {
		if (!response) { 
			return res.sendStatus(404);
    }
    next();
  })
  .catch( (err) => {
    return res.status(500).json({ err: err.message });
  });
}