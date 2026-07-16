const axios = require('axios');
axios.get('http://localhost:5000/api/documents')
  .then(res => console.log('RESPONSE:', res.data))
  .catch(err => console.error('ERROR:', err.response?.status, err.message));
