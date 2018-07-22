const { Post } = require('../models/post');
const validator = require('validator');
const { getHostname, getMetadata } = require('../helpers/helper');
const { postToJson } = require('../helpers/jsonMethods');

/**
 * GET | get posts by query 
 * query date
*/
exports.getPostsByQuery = (req, res) => {
	let date = req.query.date;

	if (!date
		|| !validator.isISO8601(date)) {
		return res.sendStatus(400);
	}
	date = validator.toDate(date);
	let dayAfter = new Date(date);
	dayAfter.setDate(dayAfter.getDate() + 1);

	Post.find({ created: {
		'$gte': date, 
		'$lt': dayAfter
	}}).populate('owner').populate('topic')
	.then((response) => {
    if(!response) { return res.sendStatus(404); }

    let posts = [];
    response.forEach((post) => {
      posts.push(postToJson(post));
    });
    return res.status(200).json({ posts });
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}

/**
 * GET | get post by postId
*/
exports.getPostById = (req, res) => {
	const postId = req.params.postId;

	Post.findById(postId).populate('owner').populate('topic')
	.then((response) => {
		if (!response) { return res.sendStatus(404); }
		
		let post = postToJson(response);
		return res.status(200).json({ post });
	})
	.catch((err) => {
		return res.status(500).json({
			err: err.message
		});
	});
}

/**
 * GET | get topic's all posts by topicId
*/
exports.getTopicAllPosts = (req, res) => {
  const topicId = req.params.topicId;
  
  Post.find({ topic: topicId }).populate('owner').populate('topic')
  .then((response) => {
    if(!response) { return res.sendStatus(404); }

    let posts = [];
    response.forEach((post) => {
      posts.push(postToJson(post));
    });
    return res.status(200).json({ posts });
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}

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