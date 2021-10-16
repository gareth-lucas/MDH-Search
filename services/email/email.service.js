const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
});

module.exports = {
    sendMail
}

async function sendMail(email) {
    try {

        const mail = {
            to: email.to,
            from: email.from,
            subject: email.subject,
            html: email.body
        }

        transporter.sendMail(mail)
            .then(info => console.info(`Message Sent: ${info.messageId}`))
            .catch(err => {
                throw err;
            });

    } catch (err) {
        console.error("emailService Error", err);
        throw (err);
    }
}