// src/controllers/password.controller.js (modo TEST - devuelve token)
const userRepository = require('../repositories/user.repository');
const { generateToken, verifyToken } = require('../utils/generateToken');
// const { sendRecoveryMail } = require('../utils/mailing'); // <-- no usar en modo test
const bcrypt = require('bcrypt');
require('dotenv').config();

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

// POST /api/password/forgot → En modo test devuelve token en la respuesta
async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email requerido' });

    const user = await userRepository.getByEmail(email);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Generar token JWT que expira en 1 hora
    const token = generateToken({ email }, '1h');

    // En TEST devolvemos token para poder usarlo en /reset sin SMTP
    return res.json({ message: 'Token generado (modo test)', token });
  } catch (error) {
    console.error('Error en requestPasswordReset:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// POST /api/password/reset?token=XYZ → Actualizar contraseña
async function resetPassword(req, res) {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token y nueva contraseña son requeridos' });
    }

    // Verificar token
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ message: 'Token inválido o expirado' });

    const user = await userRepository.getByEmail(decoded.email);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Evitar reutilizar la misma contraseña
    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (samePassword) {
      return res.status(400).json({ message: 'La nueva contraseña no puede ser igual a la anterior' });
    }

    // Hashear nueva contraseña
    const hashed = bcrypt.hashSync(newPassword, SALT_ROUNDS);
    await userRepository.updatePassword(user._id, hashed);

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

module.exports = { requestPasswordReset, resetPassword };
