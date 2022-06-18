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
        role: {
            type: DataTypes.ENUM('admin', 'writer', 'editor', 'user'),
            defaultValue: 'user'
        },
        token: {
            type: DataTypes.VIRTUAL,
        },
        actions: {
            type: DataTypes.VIRTUAL,
            get() {
                const acl = {
                    user: ['read'],
                    writer: ['read', 'create'],
                    editor: ['read', 'create', 'update'],
                    admin: ['read', 'create', 'update', 'delete']
                }
                return acl[this.role]
            }
        }
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
