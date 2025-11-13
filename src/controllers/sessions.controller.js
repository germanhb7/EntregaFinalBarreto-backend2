// src/controllers/sessions.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const UserDTO = require('../dto/user.dto');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_key';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '2h';
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

// 🟢 REGISTER
async function register(req, res) {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !password)
      return res.status(400).json({ message: 'Faltan campos obligatorios' });

    const exists = await userRepository.getByEmail(email);
    if (exists) return res.status(409).json({ message: 'El email ya está registrado' });

    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
    const newUser = {
      first_name,
      last_name,
      email: email.toLowerCase(),
      age: age || null,
      password: hashedPassword,
    };

    const createdUser = await userRepository.createUser(newUser);

    return res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: createdUser,
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// 🟢 LOGIN
async function login(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const dbUser = await userRepository.getById(user._id);
    if (!dbUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    const token = jwt.sign(
      { sub: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.json({
      message: 'Login exitoso',
      token,
      user: dbUser,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// 🟢 CURRENT USER
function current(req, res) {
  if (!req.user)
    return res.status(401).json({ message: 'No autorizado' });

  const safeUser = new UserDTO(req.user);
  res.json({ user: safeUser });
}

module.exports = { register, login, current };
