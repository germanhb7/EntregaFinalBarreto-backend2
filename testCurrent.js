require('dotenv').config();
const fetch = require('node-fetch');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGYyZWEyNDJkODEzZTA4MDVlNmVkZmMiLCJlbWFpbCI6Imdlcm1hbkB0ZXN0LmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzYwNzUxMzUzLCJleHAiOjE3NjA3NTg1NTN9.-kd3iAuBtPpyA31J9a928C8KRPo6lYFvFzTAhUIJU2A';


const getCurrent = async () => {
  const res = await fetch('http://localhost:3001/api/sessions/current', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  console.log(data);
};

getCurrent();
