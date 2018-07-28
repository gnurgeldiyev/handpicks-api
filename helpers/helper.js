const got = require('got');
const metascraper = require('metascraper').load([
	require('metascraper-image')(),
	require('metascraper-title')(),
	require('metascraper-url')()
]);
const jwt = require('jsonwebtoken');
const passwordSalt = process.env.PASSWORD_SALT || 'SUPERP@SSWORD!';
const apiKeySalt = process.env.APIKEY_SALT || 'SUPERP@SSWORD!';

/**
 * Function | gets url hostname
*/
exports.getHostname = (url) => {
  let hostname;
  try {
    //find & remove protocol (http, ftp, etc.) and get hostname
    if (url.indexOf("://") > -1) {
      hostname = url.split('/')[2];
    }
    else {
      hostname = url.split('/')[0];
    }
    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];
  } catch (err) {
    throw Error (err);
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
    throw Error (err);
  }
  return metadata;
}

/**
 * Function | hashes password (HMAC SHA256)
*/
exports.hashPassword = function (password) {
  return jwt.sign({ password: password }, passwordSalt);
}

/**
 * Function | unhashes hashed password (HMAC SHA256)
*/
exports.unhashPassword = function (hashedPassword) {
  const decoded = jwt.verify(hashedPassword, passwordSalt);
  return decoded;
}


exports.getClientConfig = function (authorizationHeader) {
  let name, apiKey;
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
    return false;
  }

  return {
    name,
    apiKey
  };
}

/**
 * Function | hashes password (HMAC SHA256)
*/
exports.hashClientName = function (name) {
  return jwt.sign({ private_name: name }, apiKeySalt);
}

/**
 * Function | unhashes hashed password (HMAC SHA256)
*/
exports.unhashClientName = function (hashedName) {
  const decoded = jwt.verify(hashedName, apiKeySalt);
  return decoded;
}