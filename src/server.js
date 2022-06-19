'use strict';

require('dotenv').config();
const PORT = process.env.PORT

const express = require('express');
const app = express();



// all routes
const userRoutes = require('./routes/user')
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');

const v1Routes = require('./routes/v1.js');
const v2Routes = require('./routes/v2')

app.use(express.json());
app.use(userRoutes)
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

app.use('*', notFoundHandler);
app.use(errorHandler);


function start() {
    app.listen(PORT, () => {
        console.log(`listen on PORT ${PORT}`);
    })
}

module.exports = {
    app: app,
    start: start,
}