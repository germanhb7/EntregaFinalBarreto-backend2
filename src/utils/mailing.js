// src/utils/mailing.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Crear el transporter reutilizable
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envía un correo de recuperación de contraseña con enlace que expira en 1 hora.
 * @param {string} email - Correo del destinatario.
 * @param {string} token - Token de recuperación.
 */
async function sendRecoveryMail(email, token) {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
    const resetLink = `${baseUrl}/api/password/reset?token=${token}`;

    const mailOptions = {
      from: `"Soporte Ecommerce" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recuperación de Contraseña - Ecommerce',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Recuperación de contraseña</h2>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p>Si fuiste tú, hacé clic en el siguiente botón:</p>
          <a href="${resetLink}" 
            style="display:inline-block;
                   padding:10px 20px;
                   background-color:#007bff;
                   color:white;
                   text-decoration:none;
                   border-radius:5px;
                   font-weight:bold;">
            Restablecer Contraseña
          </a>
          <p style="margin-top:15px;">⚠️ Este enlace expira en <strong>1 hora</strong>.</p>
          <hr/>
          <p style="font-size:12px;color:#888;">Si no solicitaste el cambio, ignorá este correo.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email de recuperación enviado correctamente a: ${email}`);
  } catch (error) {
    console.error('❌ Error al enviar correo de recuperación:', error.message);
    throw new Error('No se pudo enviar el correo de recuperación');
  }
}

module.exports = { sendRecoveryMail };
