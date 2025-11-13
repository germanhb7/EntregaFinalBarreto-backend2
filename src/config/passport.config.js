// src/config/passport.config.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_key';

// Estrategia local (login con email + password)
passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', session: false },
    async (email, password, done) => {
      try {
        const user = await userRepository.getByEmail(email);
        if (!user) return done(null, false, { message: 'Usuario no encontrado' });

        // user.password viene desde DAO.findByEmail (no se excluye)
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return done(null, false, { message: 'Contraseña inválida' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Estrategia JWT (current) — valida token y devuelve user sin password
passport.use(
  'current',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const userId = payload.sub || payload.id;
        const user = await userRepository.getById(userId); // getById devuelve sin password según el DAO
        if (!user) return done(null, false, { message: 'Token inválido' });
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

module.exports = passport;
