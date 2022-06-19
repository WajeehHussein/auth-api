'use strict';

const { Users } = require('../models/index.js');

module.exports = async (req, res, next) => {

    try {
        // console.log('rrrrrrrrr', req.headers.authorization);
        if (!req.headers.authorization) { next('Invalid Login') }
        const token = req.headers.authorization.split(' ').pop();
        console.log('rrrrrrrrr', token);

        const validUser = await Users.authenticateBearer(token);
        // console.log({ validUser });

        req.user = validUser;
        req.token = validUser.token;
        next();

    } catch (e) {
        console.error(e);
        res.status(403).send('Invalid Login');
    }
}
