
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');

const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/posts', postRoutes);

app.listen(3000, () => {
  mongoose.connect('mongodb://localhost:27017/ITI-NodeJs-db')
    .then(() => {
      console.log('✅✅ Connected to MongoDB');
    })
    .catch((err) => {
      console.log('❌❌ Failed to connect to MongoDB');
      console.log(err);
    });
  console.log('✅✅ Server is running on Port:3000');
});