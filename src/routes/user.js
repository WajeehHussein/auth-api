'use strict';

const express = require('express');
const usersRouter = express.Router();

const bcrypt = require('bcrypt');

const { Users } = require('../models/index')
const auth = require('../middlewares/basic')
const bearer = require('../middlewares/bearer');
const acl = require('../middlewares/acl');


usersRouter.get('/', home)
usersRouter.post('/signup', signUp);
usersRouter.post('/signin', auth(Users), signIn);
usersRouter.get('/myorders', bearer, getOreders)

////// ACL
usersRouter.get('/img', bearer, acl('read'), (req, res) => {
    res.send('this is new image')
});
usersRouter.post('/img', bearer, acl('create'), (req, res) => {
    res.send('created')
});
usersRouter.put('/img', bearer, acl('update'), (req, res) => {
    res.send('updated')
});
usersRouter.delete('/img', bearer, acl('delete'), (req, res) => {
    res.send('deleted')
});

function home(req, res) {
    res.send('home page')
}


async function signUp(req, res) {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const record = await Users.create(req.body);
        res.status(200).json(record);

    } catch (e) { res.status(403).send('Error Creating User'); }
}

async function signIn(req, res) {
    res.status(200).json(req.user);

}

function getOreders(req, res) {

    res.json({
        'message': 'You are authorized to view the user orders',
        'user': req.user
    });

};

module.exports = usersRouter;