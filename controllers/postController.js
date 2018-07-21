const { Post } = require('../models/post');
const validator = require('validator');
const { getHostname, getMetadata } = require('../helpers/helper');
const { postToJson } = require('../helpers/jsonMethods');

/**
 * POST | add a new post
*/
exports.addNewPost = async (req, res) => {
  const newPost = req.body.post;

  if (!newPost
    || !validator.isURL(newPost.url)
    || !newPost.ownerId
    || !newPost.topicId
    || !validator.isLength(newPost.summary, { min: 200, max: 300 })
    || !newPost.tags) {
    return res.sendStatus(400);
  }

  let post = {};
	try {
		// check and get metadata
		const metadata = await getMetadata(newPost.url);

		post = new Post({
			link_hostname: getHostname(metadata.url),
			link_url: metadata.url,
			link_thumbnail: metadata.image,
      link_title: validator.ltrim(metadata.title),
      summary: validator.ltrim(newPost.summary),
			owner: newPost.ownerId,
      topic: newPost.topicId,
      tags: newPost.tags
		});
	} catch (err) {
		return res.status(500).json({
			err: err.message
		});
	}

  post.save()
	.then(() => {
		// gets saved link with populated public infos.
		Post.findById(post._id).populate('owner').populate('topic')
		.then ((response) => {
			if (!response) { return res.sendStatus(404); }
			
			let post = postToJson(response);
			return res.status(200).json({ post });
		})
		.catch((err) => {
			return res.status(500).json({
				err: err.message
			});
		});
	})
	.catch((err) => {
		return res.status(400).json({
			err: err.message
		});
	});
}