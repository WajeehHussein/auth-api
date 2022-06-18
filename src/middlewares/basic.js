'use strict';
require('dotenv').config();

const base64 = require('base-64');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')
const SECRET = process.env.API_SECRET || "api srcret"

module.exports = (Users) => async (req, res, next) => {
    // console.log(Users);
    let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
    let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
    let decodedString = base64.decode(encodedString); // "username:password"
    let [username, password] = decodedString.split(':'); // username, password

    try {
        const user = await Users.findOne({ where: { username: username } });
        const valid = await bcrypt.compare(password, user.password);
        if (valid) {
            let newToken = jwt.sign({ username: user.username }, SECRET, { expiresIn: '15m' })
            user.token = newToken;
            req.user = user;
        }
        else {
            throw new Error('Invalid login');
        }
    } catch (error) { res.status(403).send('Invalid Login'); }
    next();
}