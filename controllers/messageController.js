const { Message } = require('../models/topic');
/**
 * GET | get all messages
*/
exports.getAllMessages = (req, res) => {
	Message.find()
  .then((response) => {
    if(!response.length) { return res.sendStatus(404); }
		let messages = [];
		response.forEach((message) => {
			messages.push(message.messageToJson());
		})
    return res.status(200).json({ messages });
  })
  .catch((err) => {
    return res.status(500).json({ err: err.message });
  });
}
/**
 * GET | get message by id
*/
exports.getMessageById = (req, res) => {
  const messageId = req.params.messageId;
  Message.findById(messageId)
  .then((response) => {
    return res.status(200).json({ message: response.messageToJson() });
  })
  .catch((err) => {
    return res.status(500).json({ err: err.message });
  });
}
/**
 * POST | add a new message
*/
exports.addNewMessage = (req, res) => {
	const newMessage = req.body.message;
  if (!newMessage
    || !newMessage.name
    || !newMessage.message) {
    return res.sendStatus(400);
  }
  const message = new Message({
    name: newMessage.name,
    email: newMessage.email,
    message: newMessage.message,
  });
  message.save()
  .then((response) => {
    return res.status(201).json({ message: response.messageToJson() });
  }).catch((err) => {
    return res.status(500).json({ err: err.message });
  });
}
/**
 * DELETE | delete message by id
*/
exports.deleteTopic = (req, res) => {
	const messageId = req.params.messageId;
  Message.findByIdAndRemove(messageId)
  .then(() => {
    return res.sendStatus(204);
  })
  .catch((err) => {
    return res.status(500).json({ err: err.message });
  });
}