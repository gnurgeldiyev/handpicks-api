const got = require('got');
const metascraper = require('metascraper').load([
	require('metascraper-image')(),
	require('metascraper-title')(),
	require('metascraper-url')()
]);
const jwt = require('jsonwebtoken');
const { passwordSalt, apiKeySalt } = require('../config/variables');
/**
 * Function | gets url hostname
*/
exports.getHostname = (url) => {
  let hostname;
  try {
    //find & remove protocol (http, ftp, etc.) and get hostname
    if (url.indexOf("://") > -1) {
      hostname = url.split('/')[2];
    } else {
      hostname = url.split('/')[0];
    }
    //find & remove "www."
    hostname = url.indexOf("www.") > -1 ? hostname.split('www.')[1] : hostname;
    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];
  } catch (err) {
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return false;
  }
	return hostname;
}
/**
 * Function | gets link's metadata(s)
*/
exports.getMetadata = async (link) => {
  let metadata = {};
  try {
    // scraping metadata
    const { body: html, url } = await got(link);
    metadata = await metascraper({ html, url });
  } catch (err) {
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return false;
  }
  return metadata;
}
/**
 * Function | hashes password (HMAC SHA256)
*/
exports.hashPassword = function (password) {
  try {
    return jwt.sign({ password: password }, passwordSalt);
  } catch (err) {
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return false;
  }
}
/**
 * Function | unhashes hashed password (HMAC SHA256)
*/
exports.unhashPassword = function (hashedPassword) {
  try {
    const decoded = jwt.verify(hashedPassword, passwordSalt);
    return decoded;
  } catch (err) {
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return false;
  }
}
/**
 * Function | gets client name and apiKey from request Authorization header.
*/
exports.getClientConfig = function (authorizationHeader) {
  let name, apiKey;
  if (authorizationHeader) {
    try {
      name = authorizationHeader.split(',')[0];
      apiKey = authorizationHeader.split(',')[1];
      if (!name
        || !apiKey) {
        return false;
      }
      name = name.split('=')[1].trim();
      apiKey = apiKey.split('=')[1].trim();
    } catch (err) {
      console.log(`err: ${err} \nmessage: ${err.message}`);
      return false;
    }
    return {
      name,
      apiKey
    };
  }
  return false;
}
/**
 * Function | hashes password (HMAC SHA256)
*/
exports.hashClientName = function (name) {
  try {
    return jwt.sign({ public_name: name }, apiKeySalt);
  } catch (err) {
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return false;
  } 
}
/**
 * Function | unhashes hashed password (HMAC SHA256)
*/
exports.unhashClientName = function (hashedName) {
  try {
    const decoded = jwt.verify(hashedName, apiKeySalt);
    return decoded;
  } catch (err) {
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return false;
  }
}
/**
 * Function | gets auth token from request Authorization header.
*/
exports.getAuthToken = function (authorizationHeader) {
  let token;
  try {
    token = authorizationHeader.split(',')[2];
    if (!token) {
      return false;
    }
    token = token.split('=')[1].trim();
  } catch (err) {
    console.log(`err: ${err} \nmessage: ${err.message}`);
    return false;
  }
  return token;
}