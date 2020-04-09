const bodyParser = require('body-parser');
var compression = require('compression')
const keys = require('./config/keys_dev.js');
const robots = require('express-robots-txt');
const nodemailer = require('nodemailer');
const stripe = require('stripe')(keys.stripeSecretKey);
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./config/common.js');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const port = 8080;
var express = require('express'),
path = require('path'),
consolidate = require('consolidate');

var isDev = process.env.NODE_ENV !== 'production';
var app = express();

app.engine('html', consolidate.ejs);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, './server/views'));

app.locals.env = process.env.NODE_ENV || 'dev';
app.locals.reload = true;

app.use(express.static(path.join(__dirname, 'public')));
app.use(robots({UserAgent: '*', Disallow: '/'}, __dirname, 'robots.txt'));

require('./server/routes')(app);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
 
let sitemap;
 
app.get('/sitemap.xml', function(req, res) {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');
  // if we have a cached entry send it
  if (sitemap) {
    res.send(sitemap)
    return
  }
 
  try {
    const smStream = new SitemapStream({ hostname: 'https://uthaya.fr' })
    const pipeline = smStream.pipe(createGzip())
 
    // pipe your entries or directly write them.
    smStream.write({ url: '/'})
    smStream.write({ url: '/cours'})
    smStream.write({ url: '/traduction'})    // changefreq: 'weekly',  priority: 0.5
    smStream.write({ url: '/boutique'})
    smStream.write({ url: '/ateliers'})
    smStream.write({ url: '/presentation'})
    smStream.end()
 
    // cache the response
    streamToPromise(pipeline).then(sm => sitemap = sm)
    // stream write the response
    pipeline.pipe(res).on('error', (e) => {throw e})
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
})

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
				path: path.join(__dirname, '/server/files/' + req.body.cours + '.pdf'),
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
app.listen(port, function () {
	console.log('App (production) is now running on port 3000!');
});