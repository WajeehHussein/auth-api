'use strict';

require('dotenv').config();
const PORT = process.env.PORT

const express = require('express');
const app = express();



// all routes
const userRoutes = require('./routes/user')




app.use(express.json());
app.use(userRoutes)
app.use(express.urlencoded({ extended: true }));


function start() {
    app.listen(PORT, () => {
        console.log(`listen on PORT ${PORT}`);
    })
}

module.exports = {
    app: app,
    start: start,
}