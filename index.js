const env = require('dotenv').config();
const errorHandler = require('./middlewares/errorhandler');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require("helmet");
const { sanitizeMongoInput } = require("express-v5-mongo-sanitize");
const { xss } = require('express-xss-sanitizer');
const hpp = require('hpp');
require('dotenv').config();

const rateLimiter = require('./middlewares/rateLimiter');

const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const donationRoutes = require('./routes/donation.routes');


const app = express();

// app level middleware
app.set('trust proxy', 1);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(sanitizeMongoInput);
app.use(xss());
app.use(hpp());
app.use(rateLimiter);



// routers
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/donations', donationRoutes);
app.use(errorHandler);


// connect to mongodb
const Port = Number(process.env.PORT)

app.listen(Port, () => {
  mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
    .then(() => {
      console.log('✅✅ Connected to MongoDB');
    });
  console.log(`✅✅ Server is running on Port:${Port}`);
});