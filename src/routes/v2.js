'use strict';

const express = require('express');
const dataModules = require('../models/index');
const bearer = require('../middlewares/bearer');
const acl = require('../middlewares/acl');
const routerV2 = express.Router();

routerV2.param('model', (req, res, next) => {
    const modelName = req.params.model;
    if (dataModules[modelName]) {
        req.model = dataModules[modelName];
        next();
    } else {
        next('Invalid Model');
    }
});


routerV2.get('/:model', bearer, acl('read'), handleGetAll);
routerV2.get('/:model/:id', bearer, acl('read'), handleGetOne);
routerV2.post('/:model', bearer, acl('create'), handleCreate);
routerV2.put('/:model/:id', bearer, acl('update'), handleUpdate);
routerV2.delete('/:model/:id', bearer, acl('delete'), handleDelete);
routerV2.delete('/:model', bearer, acl('delete'), handleDeleteAll)


async function handleGetAll(req, res) {
    let allRecords = await req.model.get();
    res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
    const id = req.params.id;
    let theRecord = await req.model.get(id)
    res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
    let obj = req.body;
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
    const id = req.params.id;
    const obj = req.body;
    let updatedRecord = await req.model.update(id, obj)
    res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
    let id = req.params.id;
    let deletedRecord = await req.model.delete(id);
    res.status(200).json(deletedRecord);
}

async function handleDeleteAll(req, res) {
    let deletedRecords = await req.model.delete();
    res.status(200).json(deletedRecords);
}

module.exports = routerV2;