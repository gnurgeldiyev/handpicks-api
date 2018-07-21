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
			updated: link.updated,
			owner: profileToJson(link.owner),
			topic: topicToJson(link.topic),
    };
    return publicLink;    
  } catch (err) {
    throw Error (err);
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
    avatar: user.avatar
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
		description: topic.description
  };
}