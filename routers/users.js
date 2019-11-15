const Joi = require('joi');
const bcrypt = require('bcrypt');
const userdb = require('../database/users');

module.exports = function (router) {

    /*
    router.get('/', function (req, res) {
        res.send('users /');
    });
    */





    router.get('/signup', async function (req, res) {
        
        res.send('users /signup');

        let user = request.body;

        const { error } = validateUser(user);
        if (error) return res.status(400).send(error.details[0].message);

        const isRegistered = await userdb.finduser(user.email);
        if (user) return res.status(400).send('User already registered!');

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        userdb.signup(user).then(result => {
            res.status(200).send(result);
        });

    });







    router.get('/login', async function (req, res) {

        res.send('users /login');

        const credentials = request.body;

        const { error } = validateCredentials(credentials);
        if (error) return res.status(400).send(error.details[0].message)

        const user = userdb.finduser(credentials.email)
        if (!user) return res.status(400).send('Invalid email or password!');

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return res.status(400).send('Invalid email or password!');

        res.status(200).send('Login successful!');

        /*
        request.session.user = user.email;
        request.session.loggedin = true;
        request.session.save();
        */

    });



    return router;

}








function validateUser(user) {
    const schema = {
      name: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
}

function validateCredentials(credentials) {
    const schema = {
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(credentials, schema);
}