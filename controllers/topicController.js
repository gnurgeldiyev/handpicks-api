const { Topic } = require('../models/topic');

/**
 * GET | get all topics
*/
exports.getAllTopics = (req, res) => {
	Topic.find()
  .then( (response) => {
		let topics = [];
		response.forEach( (topic) => {
			topics.push(topic.topicToJson());
		})
    return res.status(200).json({ topics });
  })
  .catch( (err) => {
    return res.status(400).json({ err: err.message });
  });
}

/**
 * GET | get topic by id
*/
exports.getTopicById = (req, res) => {
  const id = req.params.id;
  Topic.findById(id)
  .then( (response) => {
    if (!response) { return res.sendStatus(404); }

    return res.status(200).json({ topic: response.topicToJson() });
  })
  .catch( (err) => {
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
    || !newTopic.description) {
    return res.sendStatus(400);
  }

  const topic = new Topic({
    title: newTopic.title,
    description: newTopic.description,
    url: newTopic.title.toLowerCase().replace(' ', '-')
  });

  topic.save()
  .then( () => {
    return res.status(201).json({ topic: topic.topicToJson() });
  }).catch( (err) => {
    return res.status(400).json({ err: err.message });
  });
}