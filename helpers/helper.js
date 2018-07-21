const got = require('got');
const metascraper = require('metascraper').load([
	require('metascraper-image')(),
	require('metascraper-title')(),
	require('metascraper-url')()
]);

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