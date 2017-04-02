/**
 * Created by Gryzli on 24.01.2017.
 */


// server/index.js
'use strict';
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const version = require('../package.json').version;
const app = express();
const chart = require('./chart');
const PORT = process.env.PORT || 3001;
const groupId = '1707149242852457';
let count = 0;
// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
console.log(process.env.NODE_ENV);
console.log(process.env.npm_package_version);
// Serve static assets
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '..', 'build')));
}


app.get('/info', (req, res) => {
    console.log({
        version:process.env.npm_package_version,
        node_env: process.env.NODE_ENV,
        port: process.env.PORT
    });
    res.send('hello world! my version is: ' + version + ' you are ' + ++count + ' person');
});
app.get('/api/get_chart', (req, res) => {
    let query = req.query;
    console.log('in get chart.');
    console.time('obtain-chart');
    chart(31, query.since, query.until, query.access_token, groupId).then((body) => {
        console.log('returning chart list with: '+ body.chart.length);
        console.timeEnd('obtain-chart');
        res.status(200).send(body);
    }).catch((err) => {
        console.error('error on /api/get_chart');
        console.error(err);
        let statusCode = err.statusCode || 400;
        const error = err.sub_error || 'Sorry we don\'t know what happened :( ';
        res.status(statusCode).send(error)
    });
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});