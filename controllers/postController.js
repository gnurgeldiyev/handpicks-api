const { Post } = require('../models/post');
const { Topic } = require('../models/topic');
const { isISO8601, toDate, isURL, isLength, ltrim } = require('validator');
const {	getHostname, getMetadata } = require('../helpers/helper');
const {	postToJson } = require('../helpers/jsonMethods');
/**
 * GET | get posts by query 
 * query date
 */
exports.getPostsByQuery = async (req, res) => {
	let date = req.query.date;
	if (!date || !(isISO8601(date) || date === 'latest')) { 
		return res.sendStatus(400); 
	}
	// if query date
	if (isISO8601(date)) {
		date = toDate(date);
		let dayAfter = new Date(date);
		dayAfter.setDate(dayAfter.getDate() + 1);
		Post.find({
				published: {
					'$gte': date,
					'$lt': dayAfter
				}
			}).populate('owner').populate('topic')
			.then((response) => {
				if (!response.length) { 
					return res.sendStatus(404); 
				}
				let posts = [];
				response.forEach((post) => {
					posts.push(postToJson(post));
				});
				return res.status(200).json({ posts });
			})
			.catch((err) => {
				return res.status(500).json({ err: err.message });
			});
	}
	// if query for latest
	if (date === 'latest') {
		const today = new Date();
		const post = await Post.findOne({ published: { '$lte': today }}).sort({ published: -1 }).catch((err) => { return res.status(500).json({ err: err.message }) })
		let postDate = new Date(post.published);
		let dayAfter = new Date(postDate);
		dayAfter.setDate(dayAfter.getDate() + 1);
		Post.find({
			published: {
				'$gte': postDate,
				'$lt': dayAfter
			}
		}).populate('owner').populate('topic').sort({ published: -1 })
		.then((response) => {
			if (!response.length) { 
				return res.sendStatus(404); 
			}
			let posts = [];
			response.forEach((post) => {
				posts.push(postToJson(post));
			});
			return res.status(200).json({ posts });
		})
		.catch((err) => {
			return res.status(500).json({ err: err.message });
		});
	}
}
/**
 * GET | get post by postId
 */
exports.getPostById = (req, res) => {
	const postId = req.params.postId;
	const today = new Date();
	Post.findOne({ _id: postId, published: { '$lte': today }}).populate('owner').populate('topic')
		.then((response) => {
			if (!response) { 
				return res.sendStatus(404); 
			}
			let post = postToJson(response);
			return res.status(200).json({ post });
		})
		.catch((err) => {
			return res.status(500).json({ err: err.message });
		});
}
/**
 * GET | get topic all posts or get topic posts by query date
*/
exports.getTopicAllPosts = async (req, res) => {
	let date = req.query.date;
	const topicUrl = req.params.topicUrl;
	const topic = await Topic.findOne({ url: topicUrl }).catch((err) => { return res.status(500).json({ err: err.message }) })
	const today = new Date();
	// all posts with certain topicId
	if (!date) {
		Post.find({
				topic: topic._id,
				published: { '$lte': today }
			}).populate('owner').populate('topic').sort({ published: -1 })
			.then((response) => {
				if (!response.length) { 
					return res.sendStatus(404); 
				}
				let posts = [];
				response.forEach((post) => {
					posts.push(postToJson(post));
				});
				return res.status(200).json({ posts });
			})
			.catch((err) => {
				return res.status(500).json({ err: err.message });
			});
	} else { // all posts with certain topicId and queried created date
		if (!isISO8601(date) || (toDate(date) > today)) { 
			return res.sendStatus(400); 
		}
		date = toDate(date);
		let dayAfter = new Date(date);
		dayAfter.setDate(dayAfter.getDate() + 1);
		Post.find({
				topic: topic._id,
				published: {
					'$gte': date,
					'$lt': dayAfter
				}
			}).populate('owner').populate('topic')
			.then((response) => {
				if (!response.length) { 
					return res.sendStatus(404); 
				}
				let posts = [];
				response.forEach((post) => {
					posts.push(postToJson(post));
				});
				return res.status(200).json({ posts });
			})
			.catch((err) => {
				return res.status(500).json({ err: err.message });
			});
	}
}
/**
 * GET | get topic latest posts
*/
exports.getTopicLatestPosts = async (req, res) => {
	const topicUrl = req.params.topicUrl;
	const today = new Date();
	const topic = await Topic.findOne({ url: topicUrl }).catch((err) => { return res.status(500).json({ err: err.message }) })
	const post = await Post.findOne({ published: { '$lte': today }}).sort({ published: -1 }).catch((err) => { return res.status(500).json({ err: err.message }) })
	let postDate = new Date(post.published);
	let dayAfter = new Date(postDate);
	dayAfter.setDate(dayAfter.getDate() + 1);
	Post.find({
		topic: topic._id,
		published: {
			'$gte': postDate,
			'$lt': dayAfter
		}
	}).populate('owner').populate('topic').sort({ published: -1 })
	.then((response) => {
		if (!response.length) { 
			return res.sendStatus(404); 
		}
		let posts = [];
		response.forEach((post) => {
			posts.push(postToJson(post));
		});
		return res.status(200).json({ posts });
	})
	.catch((err) => {
		return res.status(500).json({ err: err.message });
	});
}
/**
 * GET | get topic upcoming posts
*/
exports.getTopicUpcomingPosts = async (req, res) => {
	const topicUrl = req.params.topicUrl;
	const topic = await Topic.findOne({ url: topicUrl }).catch((err) => { return res.status(500).json({ err: err.message }) })
	const today = new Date();
	Post.find({
		topic: topic._id,
		published: { '$gt': today }
	}).populate('owner').populate('topic').sort({ published: 1 })
	.then((response) => {
		if (!response.length) { 
			return res.sendStatus(404); 
		}
		let posts = [];
		response.forEach((post) => {
			posts.push(postToJson(post));
		});
		return res.status(200).json({ posts });
	})
	.catch((err) => {
		return res.status(500).json({ err: err.message });
	});
}
/**
 * POST | add a new post
 */
exports.addNewPost = async (req, res) => {
	const newPost = req.body.post;
	if (!newPost 
		|| !isURL(newPost.url) 
		|| !newPost.ownerId 
		|| !newPost.topicId 
		|| !isLength(newPost.summary, { min: 250, max: 500 })
		|| !newPost.tags.length
		|| !newPost.published) {
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
			link_title: ltrim(metadata.title),
			summary: ltrim(newPost.summary),
			owner: newPost.ownerId,
			topic: newPost.topicId,
			tags: newPost.tags,
			published: newPost.published
		});
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
	post.save()
		.then((response) => {
			// gets saved link with populated public infos.
			Post.findById(response._id).populate('owner').populate('topic')
				.then((response) => {
					if (!response) { 
						return res.sendStatus(404); 
					}
					let post = postToJson(response);
					return res.status(200).json({ post });
				})
				.catch((err) => {
					return res.status(500).json({ err: err.message });
				});
		})
		.catch((err) => {
			return res.status(500).json({ err: err.message });
		});
}
/**
 *	PUT | update post  
 */
exports.updatePost = async (req, res) => {
	const postId = req.params.postId;
	let post = req.body.post;
	if (!post 
		|| !post.topicId 
		|| !isLength(post.summary, { min: 250, max: 500 })
		|| !post.tags.length
		|| !post.published) {
		return res.sendStatus(400);
	}
	Post.findByIdAndUpdate(postId, {
			$set: {
				topic: post.topicId,
				summary: ltrim(post.summary),
				tags: post.tags,
				published: post.published
			}
		}, { new: true })
		.then((response) => {
			// gets saved link with populated public infos.
			Post.findById(response._id).populate('owner').populate('topic')
				.then((response) => {
					let post = postToJson(response);
					return res.status(200).json({ post });
				})
				.catch((err) => {
					return res.status(500).json({ err: err.message });
				});
		})
		.catch((err) => {
			return res.status(500).json({ err: err.message });
		});
}
/** 
 * DELETE | delete post
 */
exports.deletePost = (req, res) => {
	const postId = req.params.postId;
	Post.findByIdAndRemove(postId)
		.then(() => {
			return res.sendStatus(204);
		})
		.catch((err) => {
			return res.status(500).json({ err: err.message });
		});
}