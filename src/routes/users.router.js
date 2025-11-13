const { Router } = require('express');
const passport = require('../config/passport.config');
const UserDAO = require('../dao/models/user.dao');
const bcrypt = require('bcrypt');

const router = Router();

// Listar todos (solo admin)
router.get('/', passport.authenticate('current', { session: false }), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Acceso denegado' });
  const users = await UserDAO.findAll();
  res.json(users);
});

// Obtener por id (admin o mismo usuario)
router.get('/:id', passport.authenticate('current', { session: false }), async (req, res) => {
  const id = req.params.id;
  if (req.user.role !== 'admin' && req.user._id.toString() !== id) return res.status(403).json({ message: 'Acceso denegado' });
  const user = await UserDAO.findById(id);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(user);
});

// Crear usuario (público) — alternativa a /sessions/register
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !password) return res.status(400).json({ message: 'Faltan datos' });

    const exists = await UserDAO.findByEmail(email);
    if (exists) return res.status(409).json({ message: 'Email ya registrado' });

    const hashed = bcrypt.hashSync(password, 10);
    const created = await UserDAO.create({ first_name, last_name, email: email.toLowerCase(), age, password: hashed });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error interno' });
  }
});

// Update (admin o mismo usuario)
router.put('/:id', passport.authenticate('current', { session: false }), async (req, res) => {
  const id = req.params.id;
  if (req.user.role !== 'admin' && req.user._id.toString() !== id) return res.status(403).json({ message: 'Acceso denegado' });

  const updateData = { ...req.body };
  if (updateData.password) updateData.password = bcrypt.hashSync(updateData.password, 10);

  const updated = await UserDAO.update(id, updateData);
  if (!updated) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(updated);
});

// Delete (solo admin)
router.delete('/:id', passport.authenticate('current', { session: false }), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Acceso denegado' });
  const removed = await UserDAO.remove(req.params.id);
  if (!removed) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json({ message: 'Usuario eliminado' });
});

module.exports = router;
