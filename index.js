const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');



const PORT = process.env.PORT || 3001;

const app = express();

// Setup middlewares
// testing middlewars

// currently working middlewares are below
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);
require('./services/passport');
// Connect database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin 1265327Ksq!@ds125871.mlab.com:25871/heroku_0xn0jnk7', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });

app.listen(PORT);
