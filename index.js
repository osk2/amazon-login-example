const http = require('http');
const app = require('express')();
const axios = require('axios');
const path = require('path');
const config = require('./config');

app.set('view engine', 'ejs');  

app.get('/login', async (req, res) => {
  const token = req.query.access_token;
  try {
    const tokenResponse = await axios.get(`https://api.amazon.com/auth/o2/tokeninfo?access_token=${token}`);
    if (tokenResponse.data.aud !== config.clientId) {
      return res.sendStatus(404);
    }

    const dataResponse = await axios.request({
      url: 'https://api.amazon.com/user/profile',
      headers: { 'Authorization': `bearer ${token}` }
    });
    res.send(JSON.stringify(dataResponse.data, null, 2));
  } catch (ex) {
    console.error(ex);
    res.sendStatus(500);
  }

});

app.get('/', (req, res) => {
  res.render('index.ejs', {
    clientId: config.clientId,
    returnUrl: config.returnUrl
  });
});

http.createServer(app).listen(3000, () => {
  console.log(`Server is listening on port 3000`);
});