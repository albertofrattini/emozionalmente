module.exports = function (express) {

    router = express.Router();

    router.use('/users', require('./users')(router));
    router.use('/data', require('./data')(router));
    router.use('/descriptions', require('./descriptions')(router));

    return router;
    
}