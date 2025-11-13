// src/middlewares/auth.middleware.js
const passport = require('passport');

/**
 * Middleware de autenticación con JWT.
 * Usa la estrategia "current" de passport.config.js
 */
const authenticateJWT = passport.authenticate('current', { session: false });

/**
 * Middleware de autorización por roles.
 * Permite el acceso solo a los roles especificados.
 *
 * Ejemplo de uso:
 * router.post('/products', authenticateJWT, authorizeRoles('admin'), createProduct);
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // Verifica autenticación
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'No autenticado' });
    }

    // Verifica que el rol sea permitido
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Acceso denegado: se requiere uno de los roles [${allowedRoles.join(', ')}]`,
      });
    }

    next(); // pasa al siguiente middleware/controlador
  };
}

module.exports = { authenticateJWT, authorizeRoles };
