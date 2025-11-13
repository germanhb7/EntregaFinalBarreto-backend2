require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user.model');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const users = await User.find();
    console.log('Usuarios en la base:', users);
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
