const path = require('path');
const express = require('express');
const webpack = require('webpack');
const keys = require('./config/keys_dev.js');
const bodyParser = require('body-parser');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./config/common.js');
const nodemailer = require('nodemailer');
const stripe = require('stripe')(keys.stripeSecretKey);

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = 8080;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('/src/scripts/'))
app.engine('html', require('ejs').renderFile);

if (isDeveloping) {
	const compiler = webpack(config);
	const middleware = webpackMiddleware(compiler, {
		contentBase: 'src'
	});

	app.use(middleware);
	app.use(webpackHotMiddleware(compiler, {
		  publicPath : config.output.publicPath,
	}));
	app.get('/', function response(req, res) {
		res.render(__dirname +"/src/index.html");
	});
	app.get('/cours', function response(req, res) {
		res.sendFile(__dirname +"/src/cours.html");
	});
	app.get('/traduction', function response(req, res) {
		res.render(__dirname +"/src/traduction.html");
	});
	app.get('/boutique', function response(req, res) {
		res.sendFile(__dirname +"/src/boutique.html");
	});
	app.get('/presentation', function response(req, res) {
		res.sendFile(__dirname +"/src/presentation.html");
	});
	app.get('/ateliers', function response(req, res) {
		res.sendFile(__dirname +"/src/ateliers.html");
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
		.then(() => {
			var mailOpts, smtpTrans;

			smtpTrans = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: "sopika.lkdigital@gmail.com",
					pass: "Laurenceau09"
				}
			});
			var mailoutput = "<html>\n\
			<body>\n\
			<table>\n\
			<tr>\n\
			<td>Bonjour !</td>\n\
			</tr><br>\n\
			<tr>\n\
			<td>Tout d'abord, merci pour l'interêt que vous portez à mes cours.<br>Voici le cours en pièce jointe ! N'hésitez pas à me faire un retour, j'espère qu'il vous aidera !</td>\n\
			</tr><br>\n\
			<tr>\n\
			<td>Tout PS: Tout achat n'est pas remboursable</td>\n\
			</tr><br>\n\
			<tr>\n\
			<td>Sopika Uthayakumar<br>\n\
			<a href='https://uthaya.fr'>Uthaya</a>\n\
			</td>\n\
			</tr>\n\
			</table></body></html>";

			mailOpts = {
				to: req.body.stripeEmail,
				attachments: [{
					filename: req.body.cours + '.pdf',
					path: path.join(__dirname, '/static/files/' + req.body.cours + '.pdf'),
					contentType: 'application/pdf'
				}],
				subject: "Uthaya - Merci pour l'achat - Voici votre cours !",
				html: mailoutput
			};

			smtpTrans.sendMail(mailOpts, function (error, res) {
				if (error) {
					return console.log(error);
				}
			});
		})
		.then(charge => res.redirect('/'));
	});
} else {
	const compiler = webpack(config);
	const middleware = webpackMiddleware(compiler, {
		contentBase: 'src',
	});

	app.use(middleware);
	app.use(webpackHotMiddleware(compiler));
	app.get('/', function response(req, res) {
		res.sendFile(__dirname +"/src/index.html");
	});
	app.get('/cours', function response(req, res) {
		res.sendFile(__dirname +"/src/cours.html");
	});
	app.get('/traduction', function response(req, res) {
		res.sendFile(__dirname +"/src/traduction.html");
	});
	app.get('/boutique', function response(req, res) {
		res.sendFile(__dirname +"/src/boutique.html");
	});
	app.get('/presentation', function response(req, res) {
		res.sendFile(__dirname +"/src/presentation.html");
	});
	app.get('/ateliers', function response(req, res) {
		res.sendFile(__dirname +"/src/ateliers.html");
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
		.then(() => {
			var mailOpts, smtpTrans;

			smtpTrans = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: "sopika.lkdigital@gmail.com",
					pass: "Laurenceau09"
				}
			});
			var mailoutput = "<html>\n\
			<body>\n\
			<table>\n\
			<tr>\n\
			<td>Bonjour !</td>\n\
			</tr><br>\n\
			<tr>\n\
			<td>Tout d'abord, merci pour l'interêt que vous portez à mes cours.<br>Voici le cours en pièce jointe ! N'hésitez pas à me faire un retour, j'espère qu'il vous aidera !</td>\n\
			</tr><br>\n\
			<tr>\n\
			<td>Tout PS: Tout achat n'est pas remboursable</td>\n\
			</tr><br>\n\
			<tr>\n\
			<td>Sopika Uthayakumar<br>\n\
			<a href='https://uthaya.fr'>Uthaya</a>\n\
			</td>\n\
			</tr>\n\
			</table></body></html>";

			mailOpts = {
				to: req.body.stripeEmail,
				attachments: [{
					filename: req.body.cours + '.pdf',
					path: path.join(__dirname, '/static/files/' + req.body.cours + '.pdf'),
					contentType: 'application/pdf'
				}],
				subject: "Uthaya - Merci pour l'achat - Voici votre cours !",
				html: mailoutput
			};

			smtpTrans.sendMail(mailOpts, function (error, res) {
				if (error) {
					return console.log(error);
				}
			});
		})
		.then(charge => res.redirect('/'));
	});
}

app.listen(port, '0.0.0.0', function onStart(err) {
	if (err) {
		console.log(err);
	}
	console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});