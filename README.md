# 🧩 EntregaFinalBarreto

Este proyecto es mi **entrega final para el curso de Backend II**.  
Implementé **arquitectura por capas**, **roles**, **autorizaciones**, **Patrón Repository**, **DAO**, **DTO**, y un **sistema de recuperación de contraseña funcional**.

---

## 🚀 Cómo correr el proyecto

```bash
npm install
npm run dev
🧪 Variables de entorno
Crear un archivo .env en la raíz del proyecto con tus credenciales.
Ejemplo de estructura (usar tus propios valores, no los de ejemplo):

env
Copiar código
PORT=8080

# 🔐 Autenticación y seguridad
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES=2h
BCRYPT_SALT_ROUNDS=10

# 📧 Configuración del mailer
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_app

# 🌍 Base URL del proyecto
BASE_URL=http://localhost:8080

# 🗄️ Conexión a Mongo Atlas
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/ecommerce
⚠️ Importante:
El archivo .env está incluido en .gitignore, por lo tanto no se sube al repositorio.

📦 Arquitectura usada
Dividí todo en capas para hacerlo más profesional y mantenible:

DAO → conexión directa con la base de datos (MongoDB).

Repository → capa que se apoya en el DAO y maneja la lógica de negocio.

DTO → expone solo los datos públicos (por ejemplo, en /current).

Services → lógica del e-commerce (usuarios, productos, compras).

Controllers → gestionan las respuestas a las rutas.

Routers → definen los endpoints y los middlewares.

🔐 Autorización por roles
Middleware de autorización junto con la estrategia current:

Admin → puede crear, actualizar y eliminar productos.

User → puede agregar productos al carrito y comprar.

Si un usuario intenta realizar una acción de admin, el middleware lo bloquea.

🔁 Recuperación de contraseña
Implementación completa de reseteo de password:

Se envía un email con link temporal.

El link expira en 1 hora.

El usuario no puede reutilizar la misma contraseña anterior.

🎟️ Lógica de compra y Tickets
Cuando un usuario realiza una compra:

Se verifica el stock.

Si hay stock suficiente → se descuenta la cantidad.

Se genera el Ticket de compra.

Si no hay stock completo → se maneja una compra parcial.

🧪 Testing con Postman
Pruebas realizadas:

Login / Logout.

Ruta /current enviando DTO.

Creación de productos (solo admin).

Agregar productos al carrito (user).

Generación de ticket.

Flujo completo de recuperación de contraseña.

Todas las pruebas se realizaron directamente contra el servidor real.

✅ Conclusión
Este proyecto refleja lo aprendido en Backend II:

arquitectura por capas, seguridad, JWT, roles, DTO, DAO, Repository
y un flujo real de e-commerce con manejo de usuarios y compras.

📚 Autor: Germán Barreto