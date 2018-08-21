/** 
 * returns public link info
*/
exports.linkToJson = (link) => {
  try {
    const publicLink = {
			id: link._id,
			hostname: link.link_hostname,
			url: link.link_url,
			thumbnail: link.link_thumbnail,
			title: link.link_title,
			tags: link.tags,
			created: link.created,
			owner: profileToJson(link.owner),
			topic: topicToJson(link.topic),
    };
    return publicLink;    
  } catch (err) {
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return false;
  }
}

/** 
 * returns public post info
*/
exports.postToJson = (post) => {
  try {
    const publicPost = {
			id: post._id,
			hostname: post.link_hostname,
			url: post.link_url,
			thumbnail: post.link_thumbnail,
      title: post.link_title,
      summary: post.summary,
			tags: post.tags,
			created: post.created,
			updated: post.updated,
			owner: profileToJson(post.owner),
			topic: topicToJson(post.topic),
    };
    return publicPost;    
  } catch (err) {
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return false;
  }
}

/** 
 * returns public user profile info
*/
const profileToJson = (user) => {
  return {
    id: user._id,
    username: user.username,
    name: user.name,
    lastname: user.lastname,
    bio: user.bio,
    avatar: user.avatar,
    created: user.created
  };
}

/** 
 * returns public topic info
*/
const topicToJson = (topic) => {
  return {
    id: topic._id,
		title: topic.title,
		url: topic.url,
    description: topic.description,
    created: topic.created
  };
}

/** 
 * returns public topicFollow data with populated info
*/
exports.topicFollowToJson = (topicFollow) => {
  try {
    const publicTopicFollow = {
      id: topicFollow._id,
      follower: profileToJson(topicFollow.follower),
      followee: topicToJson(topicFollow.followee),
      created: topicFollow.created,
      updated: topicFollow.updated
    }
    return publicTopicFollow; 
  } catch (err) {
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return false;
  }
}