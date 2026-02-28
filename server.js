
// Simple Node.js/Express backend for handling contact form submissions
const express = require('express');
const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer'); // uncomment if you want to send emails

// stripe setup (install via npm install stripe)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_test_key');

const app = express();
// serve static files from project root (html, css, js, images)
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log('Received contact form:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    // if you want to send an email using nodemailer, configure transporter below
    /*
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'youremail@gmail.com',
            pass: 'yourpassword'
        }
    });

    const mailOptions = {
        from: email,
        to: 'yourbusiness@gmail.com',
        subject: 'New contact form submission',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
    */

    // respond back to form
    res.json({ success: true, message: 'Form received.' });
});

// endpoint to create stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const items = req.body.items || [];
        const line_items = items.map(i => ({
            price_data: {
                currency: 'usd',
                product_data: { name: i.name },
                unit_amount: Math.round(i.price * 100)
            },
            quantity: i.qty || 1
        }));
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${req.headers.origin}/payment.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/checkout.html`
        });
        res.json({ url: session.url });
    } catch (err) {
        console.error('Stripe error', err);
        res.status(500).json({ error: 'Unable to create session' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
