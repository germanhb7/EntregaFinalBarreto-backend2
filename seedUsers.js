const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/user.model');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("🔗 Conectado a MongoDB");

    const hashedPassword = await bcrypt.hash('123456', 10);

    const user = {
      email: "german@test.com",
      password: hashedPassword,
      first_name: "German",
      last_name: "Barreto",
      role: "user"
    };

    const newUser = await User.create(user);

    console.log("✅ Usuario creado:", newUser);
    process.exit(0);
  })
  .catch(err => console.error(err));
