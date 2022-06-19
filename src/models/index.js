'use strict';

require('dotenv').config()
const { Sequelize, DataTypes } = require('sequelize');

const users = require('./user')
const clothesModel = require('./clothes/model.js');
const foodModel = require('./food/model.js');
const Collection = require('./data-collection.js');
const POSTGRES_URI = process.env.NODE_ENV === 'test' ? 'sqlite:memory:' : process.env.DATABASE_URL;

let sequelizeOptions =
    process.env.NODE_ENV === "production"
        ? {
            dialect: 'postgres',
            protocol: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                },
                native: true
            }
        } : {};


let sequelize = new Sequelize(POSTGRES_URI, sequelizeOptions);
const food = foodModel(sequelize, DataTypes);
const clothes = clothesModel(sequelize, DataTypes);


module.exports = {
    sequelize: sequelize,
    Users: users(sequelize, DataTypes),
    food: new Collection(food),
    clothes: new Collection(clothes),
};