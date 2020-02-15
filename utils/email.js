const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) create a transporter

/*
    // service could be Gmail yahoo, microsoft etc
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: process.env.GMAIL_EMAIL_PORT,
        auth: {
            user: process.env.GMAIL_EMAIL_USERNAME,
            password: process.env.GMAIL_EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
        // Activate in gmail "less secure app" option
    });
*/
    /*
        Host:	smtp.mailtrap.io
        Port:	25 or 465 or 587 or 2525
        Username:	872944adc6e2b0
        Password:	e4f55485fcb0e3
        Auth:	PLAIN, LOGIN and CRAM-MD5
        TLS:	Optional (STARTTLS on all ports)
      */

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false,
        auth: {
            // type: 'login',
            user: process.env.MAILTRAP_EMAIL_USERNAME,
            pass: process.env.MAILTRAP_EMAIL_PASSWORD
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'Natours page',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);

};

module.exports = sendEmail;
