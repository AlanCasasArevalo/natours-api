const nodemailer = require('nodemailer');
const pug = require('pug')
const htmlToText = require('html-to-text')

class Email {
    constructor(user, url) {
        this.userToSendEmail = user.email
        this.firstName = user.name.split(' ')[0]
        this.url = url
        this.from = `YOUR_NAME <${process.env.EMAIL_FROM}>`
    }

    createTransport() {
        if (process.env.NODE_ENV === 'production') {
            // Sendgrid
            return 1
        }

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

        return transporter
    }

    async sendEmail(template, subject) {
        // Render html based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        })

        // 2) Define the email options
        const mailOptions = {
            from: this.from,
            to: this.userToSendEmail,
            subject,
            html,
            text: htmlToText.fromString(html),
        };

        // Create transport and send email
        await this.createTransport().sendMail(mailOptions)

    }

    async sendWelcome(template, subject) {
        await this.sendEmail('welcome', 'Welcome to the Natours family')
    }
}

module.exports = Email