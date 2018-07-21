const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('../routes/userRoutes');
const topicRoutes = require('../routes/topicRoutes');
const postRoutes = require('../routes/postRoutes');

const app = express();
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

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/topics', topicRoutes);
app.use('/api/v1/posts', postRoutes);

// Listen the server
app.listen(port, host);
console.log('Server listening on http://' + host + ':' + port);
