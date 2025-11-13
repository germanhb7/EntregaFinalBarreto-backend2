// src/utils/generateToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_key';

/**
 * Genera un token JWT con un payload y tiempo de expiración.
 * @param {Object} payload - Datos a incluir en el token.
 * @param {string} [expiresIn='1h'] - Tiempo de expiración del token.
 * @returns {string} Token JWT firmado.
 */
function generateToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verifica y decodifica un token JWT.
 * @param {string} token - Token a verificar.
 * @returns {Object|null} Payload decodificado o null si es inválido/expirado.
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('❌ Token inválido o expirado:', error.message);
    return null;
  }
}

module.exports = { generateToken, verifyToken };
