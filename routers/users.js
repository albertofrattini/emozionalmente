const Joi = require('joi');
const bcrypt = require('bcrypt');
const userdb = require('../database/users');

module.exports = function (router) {

    router.post('/signup', async function (req, res) {

        let user = req.body;

        console.log(user);

        const { error } = validateUser(user);
        if (error) return res.status(400).send(error.details[0].message);

        const isRegistered = await userdb.finduser(user.email);
        if (isRegistered) return res.status(400).send('User already registered!');

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        userdb.signup(user)
            .then(result => {
                res.status(200).send({
                    message: 'Signup successful!'
                });
            }).catch(error => {
                res.status(400).send({
                    message: 'Something went wrong...'
                });
            });

    });

    router.post('/login', async function (req, res) {

        const credentials = req.body;

        const { error } = validateCredentials(credentials);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await userdb.finduser(credentials.email);
        if (!user) return res.status(400).send('Invalid email or password!');

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return res.status(400).send('Invalid email or password!');

        res.status(200).send(
            {
                message: 'Login successful!',
                user: {
                    username: user.username,
                    email: user.email
                }
            }
        );

        
        req.session.user = {
            username: user.username,
            email: user.email
        };
        req.session.loggedin = true;
        req.session.save();

    });

    router.get('/logout', (req, res) => {

        req.session.destroy();

        res.status(200).send({
            message: 'Logout successful!'
        });

    });

    router.get('/loggedin', (req, res) => {

        if (req.session.loggedin) {
            res.status(200).send({
                message: 'The user currently logged in is ...',
                user: req.session.user
            });
        } else {
            res.status(200).send({
                message: 'No user is logged in...',
                user: {
                    username: null,
                    email: null
                }
            });
        }

    });



    return router;
}


function validateUser(user) {
    const schema = {
        username: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        nationality: Joi.string(),
        age: Joi.string(),
        sex: Joi.string()
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