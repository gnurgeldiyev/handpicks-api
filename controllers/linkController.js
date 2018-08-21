const { Link } = require('../models/link');
const { isURL, ltrim } = require('validator');
const { getHostname, getMetadata } = require('../helpers/helper');
const { linkToJson } = require('../helpers/jsonMethods');

/**
 * GET | user's all links
*/
exports.getUserAllLinks = (req, res) => {
	const userId = req.params.userId;

	Link.find({ owner: userId }).populate('owner').populate('topic')
	.then((response) => {
		if (!response.length) { return res.sendStatus(404); }

		let links = [];
		response.forEach((link) => {
			links.push(linkToJson(link));
		});
		return res.status(200).json({ links });
	})
	.catch((err) => {
		return res.status(500).json({
			err: err.message
		});
	});
}

/**
 * GET | user's link by link id
*/
exports.getUserLinkById = (req, res) => {
	const linkId = req.params.linkId;

	Link.findById(linkId).populate('owner').populate('topic')
	.then((response) => {
		if (!response) { return res.sendStatus(404); }
		
		let link = linkToJson(response);
		return res.status(200).json({ link });
	})
	.catch((err) => {
		return res.status(500).json({
			err: err.message
		});
	});
}

/**
 * GET | user's links by topic
*/
exports.getUserLinksByTopic = (req, res) => {
	const userId = req.params.userId;
	const topicId = req.params.topicId;

	Link.find({ owner: userId, topic: topicId }).populate('owner').populate('topic')
	.then((response) => {
		if (!response.length) { return res.sendStatus(404); }

		let links = [];
		response.forEach((link) => {
			links.push(linkToJson(link));
		});
		return res.status(200).json({ links });
	})
	.catch((err) => {
		return res.status(500).json({
			err: err.message
		});
	});
}

/**
 * POST | user add a new link
*/
exports.addNewLink = async (req, res) => {
	let newLink = req.body.link;
	newLink.ownerId = req.params.userId;

	// validates incoming data
	if (!newLink
		|| !isURL(newLink.url)
		|| !newLink.topicId) {
		res.sendStatus(400);
	}
	
	let link = {};
	try {
		// check and get metadata
		const metadata = await getMetadata(newLink.url);

		link = new Link({
			link_hostname: getHostname(metadata.url),
			link_url: metadata.url,
			link_thumbnail: metadata.image,
			link_title: ltrim(metadata.title),
			owner: newLink.ownerId,
			topic: newLink.topicId
		});
	} catch (err) {
		return res.status(500).json({
			err: err.message
		});
	}

	link.save()
	.then((response) => {
		// gets saved link with populated public infos.
		Link.findById(response._id).populate('owner').populate('topic')
		.then ((response) => {			
			let link = linkToJson(response);
			return res.status(201).json({ link });
		})
		.catch((err) => {
			return res.status(500).json({
				err: err.message
			});
		});
	})
	.catch((err) => {
		return res.status(500).json({
			err: err.message
		});
	});
}

/**
 * DELETE | user delete the link
*/
exports.deleteLink = (req, res) => {
	const userId = req.params.userId; 
	const linkId = req.params.linkId;

	Link.findOneAndRemove({ _id: linkId, owner: userId })
	.then((response) => {
		if (!response) { return res.sendStatus(404); }
			
		return res.sendStatus(204);
	})
	.catch((err) => {
		return res.status(500).json({
			err: err.message
		});
	});
}