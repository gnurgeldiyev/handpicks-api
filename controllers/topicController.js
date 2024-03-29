const { Topic } = require('../models/topic');
const { isLength, ltrim } = require('validator');
/**
 * GET | get all topics
*/
exports.getAllTopics = (req, res) => {
  const deleted = req.query.deleted;
  if (!deleted) {
    Topic.find({ deleted: false }).sort({ title: 1 })
      .then((response) => {
        if (!response.length) {
          return res.sendStatus(404);
        }
        let topics = [];
        response.forEach((topic) => {
          topics.push(topic.topicToJson());
        })
        return res.status(200).json({ topics });
      })
      .catch((err) => {
        return res.status(500).json({ err: err.message });
      });
  } else {
    if (deleted !== 'true') {
      return res.sendStatus(400);
    }
    Topic.find({ deleted: true }).sort({ title: 1 })
      .then((response) => {
        if (!response.length) {
          return res.sendStatus(404);
        }
        let topics = [];
        response.forEach((topic) => {
          topics.push(topic.topicToJson());
        })
        return res.status(200).json({ topics });
      })
      .catch((err) => {
        return res.status(500).json({ err: err.message });
      });
  }
}
/**
 * GET | get topic by URL
*/
exports.getTopicByUrl = (req, res) => {
  const topicUrl = req.params.topicUrl;
  Topic.findOne({ url: topicUrl })
    .then((response) => {
      return res.status(200).json({ topic: response.topicToJson() });
    })
    .catch((err) => {
      return res.status(500).json({ err: err.message });
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
    || !isLength(newTopic.description, { min: 1, max: 128 })) {
    return res.sendStatus(400);
  }
  const topic = new Topic({
    title: newTopic.title,
    description: newTopic.description,
    url: newTopic.title.toLowerCase().replace(' ', '-')
  });
  topic.save()
    .then((response) => {
      return res.status(201).json({ topic: response.topicToJson() });
    }).catch((err) => {
      return res.status(500).json({ err: err.message });
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
    }, { new: true })
    .then((response) => {
      return res.status(200).json({ topic: response.topicToJson() });
    })
    .catch((err) => {
      return res.status(500).json({ err: err.message });
    });
}
/**
 * DELETE | delete topic by id
*/
exports.deleteTopic = (req, res) => {
	const topicId = req.params.topicId;
  Topic.findByIdAndUpdate(topicId, {
    $set: {
      deleted: true
    }
  })
  .then(() => {
    return res.sendStatus(204);
  })
  .catch((err) => {
    return res.status(500).json({ err: err.message });
  });
}