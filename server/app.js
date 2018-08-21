const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const compression = require("compression");  
const helmet = require("helmet");
const userRoutes = require('../routes/userRoutes');
const topicRoutes = require('../routes/topicRoutes');
const postRoutes = require('../routes/postRoutes');
const managerRoutes = require('../routes/managerRoutes');
const messageRoutes = require('../routes/messageRoutes');
const { isValidClient } = require('../middlewares/commonChecks');
 
const app = express();

// import .env variables
require('dotenv').config({ path: 'variables.env' });

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 4000;
const mongoDbUri = process.env.MONGODB || 'mongodb+srv://kalilin:5gbUx5xE6yWvCeNz@handpicks-test-oktuz.mongodb.net/test';

// set Express port
app.set('port', port);

// Setup MongoDB with mongoose
mongoose.Promise = global.Promise;
mongoose.connect(mongoDbUri, { useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
  console.log(`MongoDB connection is failed → ${err.message}`); 
});

// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}));

// log all requests to access.log
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname + '/../logs/access.log'), {flags: 'a'})
}));

// a security middleware that handles several kinds of attacks in the HTTP/HTTPS protocols
app.use(helmet());

// CORS config
app.use(cors({  
  origin: '*',
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Compacting requests using GZIP middleware
app.use(compression());

// client name and apiKey check
app.use(isValidClient);

// Import Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/topics', topicRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/managers', managerRoutes);
app.use('/api/v1/messages', messageRoutes);

// Listen the server
app.listen(port, host);
console.log('Server listening on http://' + host + ':' + port);