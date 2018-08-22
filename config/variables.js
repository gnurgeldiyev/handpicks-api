// import .env variables
require('dotenv').config({ path: 'variables.env' });
const nodeEnv = process.env.NODE_ENV;
const host = process.env.HOST;
const port = process.env.PORT;
const mongoDbUri = process.env.MONGODB;
const apiKeySalt = process.env.APIKEY_SALT;
const passwordSalt = process.env.PASSWORD_SALT;
const tokenSalt = process.env.TOKEN_SALT;
module.exports = { 
  nodeEnv,
  host,
  port,
  mongoDbUri,
  apiKeySalt,
  passwordSalt,
  tokenSalt
};