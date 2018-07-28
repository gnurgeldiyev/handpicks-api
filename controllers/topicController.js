const { Topic } = require('../models/topic');
const { isLength, ltrim } = require('validator');

/**
 * GET | get all topics
*/
exports.getAllTopics = (req, res) => {
	Topic.find()
  .then((response) => {
    if(!response) { return res.sendStatus(404); }

		let topics = [];
		response.forEach((topic) => {
			topics.push(topic.topicToJson());
		})
    return res.status(200).json({ topics });
  })
  .catch((err) => {
    return res.status(400).json({ err: err.message });
  });
}

/**
 * GET | get topic by id
*/
exports.getTopicById = (req, res) => {
  const topicId = req.params.topicId;
  
  Topic.findById(topicId)
  .then((response) => {
    return res.status(200).json({ topic: response.topicToJson() });
  })
  .catch((err) => {
    return res.status(400).json({ err: err.message });
  });
}

/**
 * POST | add a new topic
*/
exports.addNewTopic = (req, res) => {
	const newTopic = req.body.topic;

  if (!newTopic
    || !newTopic.title
    || !newTopic.description
    || !isLength(newTopic.summary, { min: 1, max: 100 })) {
    return res.sendStatus(400);
  }

  const topic = new Topic({
    title: newTopic.title,
    description: newTopic.description,
    url: newTopic.title.toLowerCase().replace(' ', '-')
  });

  topic.save()
  .then(() => {
    return res.status(201).json({ topic: topic.topicToJson() });
  }).catch((err) => {
    return res.status(400).json({ err: err.message });
  });
}

/**
 * PUT | update topic by id
*/
exports.updateTopic = (req, res) => {
	const topicId = req.params.topicId;
	const topic = req.body.topic;
  
  if (!topic
    || !topic.title
    || !topic.description
    || !isLength(topic.description, { min: 1, max: 100 })) {
    return res.sendStatus(400);
  }

  Topic.findByIdAndUpdate(topicId, { 
		$set: { 
			title: ltrim(topic.title), 
			url: ltrim(topic.title.toLowerCase().replace(' ', '-')),
			description: ltrim(topic.description)
		}
	}, {new: true})
  .then((response) => {
    return res.status(200).json({ topic: response.topicToJson() });
  })
  .catch((err) => {
    return res.status(400).json({ err: err.message });
  });
}

/**
 * DELETE | delete topic by id
*/
exports.deleteTopic = (req, res) => {
	const topicId = req.params.topicId;

  Topic.findByIdAndRemove(topicId)
  .then(() => {
    return res.sendStatus(204);
  })
  .catch((err) => {
    return res.status(400).json({ err: err.message });
  });
}