require('dotenv').config()
const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send(`<h1>Express Demo App</h1> <h4>Message: Success</h4> <p>Version 1.1</p>
  <p>MY_ENV_VAR is ${process.env.MY_ENV}<p>`);
})

app.get('/products', (req, res) => {
  res.send([
    {
      productId: '101',
      price: 100
    },
    {
      productId: '102',
      price: 150
    }
  ])
})

app.listen(port, ()=> {
  console.log(`Demo app is up and listening to port: ${port}`);
})
 