// Simple Node.js/Express backend for handling contact form submissions
const express = require('express');
const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer'); // uncomment if you want to send emails

const app = express();
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
