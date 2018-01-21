const express = require('express');
const bodyParser = require('body-parser');
const opn = require('opn');
const path = require('path');

const app = express();

/**
 * parse
 */

app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/**
 * routers
 */

const userLoginRouter = require('./routers/login');
const administrativeRegionRouter = require('./routers/views/administrativeRegion');
const systemLogRouter = require('./routers/views/systemLog');
const systemParameterRouter = require('./routers/views/systemParameter');
const FBackupRouter = require('./routers/views/FBackup');
const messageInSiteRouter = require('./routers/views/messageInSite');

app.use('/user', userLoginRouter);
app.use('/administrativeRegion', administrativeRegionRouter);
app.use('/systemLog', systemLogRouter);
app.use('/systemParameter', systemParameterRouter);
app.use('/FBackup', FBackupRouter);
app.use('/messageInSite', messageInSiteRouter);


/**
 * server running at port 3001
 */

//app.listen(3001);

//opn('http://localhost:3001');

module.exports = app;