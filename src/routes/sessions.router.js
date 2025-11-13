// ✅ src/routes/sessions.router.js
const { Router } = require('express');
const passport = require('passport');
const sessionsCtrl = require('../controllers/sessions.controller');

const router = Router();

// 🔹 Registro
router.post('/register', sessionsCtrl.register);

// 🔹 Login (usando Passport Local)
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res
        .status(401)
        .json({ message: info?.message || 'Credenciales inválidas' });

    req.user = user;
    return sessionsCtrl.login(req, res);
  })(req, res, next);
});

// 🔹 Ruta /current (usa estrategia JWT)
router.get(
  '/current',
  passport.authenticate('current', { session: false }),
  sessionsCtrl.current
);

module.exports = router; // 
