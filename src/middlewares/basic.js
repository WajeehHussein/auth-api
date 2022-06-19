'use strict';
require('dotenv').config();

const base64 = require('base-64');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')
const SECRET = process.env.API_SECRET || "api srcret"

module.exports = (Users) => async (req, res, next) => {

    let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
    console.log('req.headers.auth', req.headers.authorization);
    console.log('req.headers', req.headers);

    let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
    console.log('//////////////////////////////////', encodedString);
    let decodedString = base64.decode(encodedString); // "username:password"
    console.log('ddddddddddddddddddddddddddddddddddd', decodedString);

    let [username, password] = decodedString.split(':'); // username, password
    try {
        const user = await Users.findOne({ where: { username: username } });
        const valid = await bcrypt.compare(password, user.password);
        if (valid) {
            let newToken = jwt.sign({ username: user.username }, SECRET, { expiresIn: '15m' })
            user.token = newToken;
            console.log('sssssssssssssssss0', user);
            console.log('tttttttttttttttttttttttt', user.token);
            req.user = user;
        }
        else {
            throw new Error('Invalid login');
        }
    } catch (error) { res.status(403).send('Invalid Login'); }
    next();
}