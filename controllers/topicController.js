const { Topic } = require('../models/topic');

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
    return res.status(201).json({ topic });
  }).catch( (err) => {
    return res.status(400).json({ err: err.message });
  });
}