const keys = require('../../config/keys_dev.js');
const nodemailer = require('nodemailer');
const stripe = require('stripe')(keys.stripeSecretKey);
var express = require('express'),
router = express.Router();

router.get('/', function(req, res) {
	res.render('boutique');
});

router.post('/charge', (req, res) => {
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
				path: path.join(__dirname, '/files/' + req.body.cours + '.pdf'),
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

module.exports = router;