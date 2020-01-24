const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'emozionalmente.polimi@gmail.com',
        clientId: '686968200173-6m43r6gch255r6nb9pv45juh31veibaa.apps.googleusercontent.com',
        clientSecret: 'YCqVp8yQwN2pf4404k-JKYiK',
        refreshToken: '1//04z3LmrZ6S7nbCgYIARAAGAQSNwF-L9IrIdCibjwBfpMyHOJIO7L4E5nXloGBUyOoQJDVn-G09rwZNOUbCPm0BpEIHbkfy0gP-VI',
        accessToken: 'ya29.Il-7B44kbt6DNJuJJMWyVK_GlwVHgmDYcSAh2FjA3UTBkBgUcRk_jpxgEace7tRJA77eMIChQ_FBKqVVqsnQE1pisimgBPvvjfKbREiuDlCgjORyQ--TdZNc4KJzJzLR4Q'
        }
});

module.exports = async (to, content) => {

    var mailOptions = {
        from: `"Emozionalmente" <emozionalmente.polimi@gmail.com>`,
        to: to,
        subject: content.subject,
        html: content.html,
        text: content.text
    }

    transporter.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.log('Error sending an email to ' + to);
            console.log(err);
        } else {
            console.log('Email sent successfully to ' + to);
        }
    });

}