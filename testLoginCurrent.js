require('dotenv').config();
const fetch = require('node-fetch');

const email = 'german@test.com'; // usuario
const password = '123456';          // contraseña original

const loginAndGetCurrent = async () => {
  try {
    // Hacer login
    const loginRes = await fetch('http://localhost:3001/api/sessions/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const loginData = await loginRes.json();

    if (!loginRes.ok) {
      console.error('Error en login:', loginData);
      return;
    }

    console.log('Login OK, token recibido:');
    console.log(loginData.token);

    const token = loginData.token;


    const currentRes = await fetch('http://localhost:3001/api/sessions/current', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });

    const currentData = await currentRes.json();
    console.log('Datos del usuario desde /current:');
    console.log(currentData);

  } catch (err) {
    console.error('Error al ejecutar login/current:', err.message);
  }
};

loginAndGetCurrent();
