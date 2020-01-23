const nodemailer = require('nodemailer');

const credentials = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
}

const transporter = nodemailer.createTransport(credentials);

module.exports = async (to, content) => {

    const contacts = {
        from: `"Emozionalmente" <${process.env.MAIL_USER}>`,
        to: to
    }

    const email = Object.assign({}, content, contacts);

    try {
        await transporter.sendMail(email);
    } catch (error) {
        console.log('Something went wrong');
        console.log(error);
    }

}