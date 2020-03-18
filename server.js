const express = require('express');
const keys = require('./config/keys_dev');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./config/common.js');
const compiler = webpack(config);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}));

app.get('/', (req, res) => {
  res.send('index', {
    stripePublishableKey: keys.stripePublishableKey
  });
});

app.post('/charge', (req, res) => {
  const amount = 300;
  
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount,
    description: 'Cours de tamoul',
    currency: 'eur',
    customer: customer.id
  }))
  .then(charge => res.render('success'));
});

const port = process.env.PORT || 8080;

app.listen(port, function () {
});