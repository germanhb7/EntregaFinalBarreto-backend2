require('dotenv').config();
const fetch = require('node-fetch');

const login = async () => {
  const res = await fetch('http://localhost:3001/api/sessions/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'german@test.com',
      password: '123456'
    })
  });

  const data = await res.json();
  console.log(data);
};

login();
