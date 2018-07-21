const { User } = require('../models/user');
const { Topic } = require('../models/topic');

exports.ownerCheck = (req, res, next) => {
  const id = req.params.id;
	const newLink = req.body.link;

	// checks params.id with body.ownerId
	if (id !== newLink.ownerId) { 
		return res.sendStatus(400);
	}

	// checks is user exists
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

exports.topicCheck = (req, res, next) => {
  const newLink = req.body.link;

  // checks is topic exists
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