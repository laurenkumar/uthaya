const path = require('path');
const express = require('express');
const webpack = require('webpack');
const keys = require('./config/keys_dev.js');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./config/common.js');
const stripe = require('stripe')(keys.stripeSecretKey);

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = 8080;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

if (isDeveloping) {
	const compiler = webpack(config);
	const middleware = webpackMiddleware(compiler, {
		publicPath: config.output.publicPath,
		contentBase: 'src',
		stats: {
			colors: true,
			hash: false,
			timings: true,
			chunks: false,
			chunkModules: false,
			modules: false
		}
	});

	app.use(middleware);
	app.use(webpackHotMiddleware(compiler));
	app.get('/', function response(req, res) {
		res.sendFile(__dirname +"index.html");
	});
	app.get('/code',(req,res)=>{
	    res.json({code: keys.stripePublishableKey});
	});
	app.post('/charge', (req, res) => {
		const amount = 300;
		stripe.customers.create({
			email: req.body.stripeEmail,
			source: req.body.stripeToken
		})
		.then(customer => stripe.charges.create({
			amount,
			description: req.body.cours,
			currency: 'eur',
			customer: customer.id
		}))
		.then(charge => res.redirect('/'));
	});
} else {
	app.use(express.static(__dirname + '/src'));
	app.get('/', function response(req, res) {
		res.sendFile(__dirname +"index.html");
	});
	app.get('/code',(req,res)=>{
	    res.json({code: keys.stripePublishableKey});
	});
	app.post('/charge', (req, res) => {
		const amount = 300;
		stripe.customers.create({
			email: req.body.stripeEmail,
			source: req.body.stripeToken
		})
		.then(customer => stripe.charges.create({
			amount,
			description: req.body.cours,
			currency: 'eur',
			customer: customer.id
		}))
		.then(charge => res.redirect('/'));
	});
}

app.listen(port, '0.0.0.0', function onStart(err) {
	if (err) {
		console.log(err);
	}
	console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});