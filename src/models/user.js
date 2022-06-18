"use strict";
require('dotenv').config()
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Users = (sequelize, DataTypes) => {
    const model = sequelize.define("users", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.VIRTUAL,
        },
    });


    model.authenticateBearer = async function (token) {
        try {
            const parsedToken = jwt.verify(token, process.env.API_SECRET || "secret word");
            const user = this.findOne({ where: { username: parsedToken.username } });
            if (user) {
                return user;
            }
            throw new Error("User Not Found");
        } catch (e) {
            throw new Error(e.message);
        }
    };

    return model;
};

module.exports = Users;
