// app.js
const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const passport = require('passport');
require('dotenv').config();

// ✅ Conexión a MongoDB
const connectDB = require('./src/config/connectDB');

// ✅ Importar routers
const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');
const viewsRouter = require('./src/routes/views.router');
const usersRouter = require('./src/routes/users.router');
const sessionsRouter = require('./src/routes/sessions.router');
const passwordRouter = require('./src/routes/password.router'); // recuperación de contraseña

// ✅ Importar helpers de Handlebars
const { eq, multiply } = require('./src/utils/handlebarsHelpers');

// ✅ Inicializar aplicación
const app = express();
const PORT = process.env.PORT || 8080;

// 🔍 Verificar routers exportados correctamente
console.log('🧩 passwordRouter exportado:', passwordRouter);
console.log('🧩 sessionsRouter exportado:', sessionsRouter);

// ✅ Conectar a MongoDB
(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
  }
})();

// ✅ Configurar Handlebars con helpers
app.engine(
  'handlebars',
  handlebars.engine({
    helpers: { eq, multiply },
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

// ✅ Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Configurar Passport (JWT)
require('./src/config/passport.config');
app.use(passport.initialize());

// ✅ Rutas principales
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/password', passwordRouter); // 👈 nueva ruta para recuperación
app.use('/', viewsRouter);

// ✅ Ruta raíz
// app.get('/', (req, res) => res.redirect('/products'));

// ✅ Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error('💥 Error detectado:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
  });
});

// ✅ Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📦 API Products: http://localhost:${PORT}/api/products`);
  console.log(`🛒 API Carts: http://localhost:${PORT}/api/carts`);
  console.log(`👤 API Users: http://localhost:${PORT}/api/users`);
  console.log(`🔐 API Sessions: http://localhost:${PORT}/api/sessions`);
  console.log(`📧 API Password: http://localhost:${PORT}/api/password`);
});
