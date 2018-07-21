const { Link } = require('../models/link');
const validator = require('validator');
const { getHostname, getMetadata } = require('../helpers/helper');

/**
 * POST | add a new link
*/
exports.addNewLink = async (req, res) => {
	const newLink = req.body.link;
	
	// validates incoming data
	if (!newLink
		|| !newLink.url
		|| !validator.isURL(newLink.url)
		|| !newLink.topicId
		|| !newLink.ownerId) {
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
			link_title: validator.ltrim(metadata.title),
			owner: newLink.ownerId,
			topic: newLink.topicId
		});
	} catch (err) {
		return res.status(500).json({
			err: err.message
		});
	}

	link.save()
	.then( () => {
		return res.status(200).json({
			link
		});
	})
	.catch( (err) => {
		return res.status(400).json({
			err: err.message
		});
	});
}