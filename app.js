const express = require('express');
const bodyParser = require('body-parser');
const opn = require('opn');
const path = require('path');

const app = express();

/**
 * parse
 */

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/**
 * routers
 */

const userLoginRouter = require('./routers/login');


const administrativeRegionRouter = require('./routers/views/systemSettings/administrativeRegion');
const systemLogRouter = require('./routers/views/systemSettings/systemLog');
const systemParameterRouter = require('./routers/views/systemSettings/systemParameter');
const FBackupRouter = require('./routers/views/systemSettings/FBackup');
const messageInSiteRouter = require('./routers/views/systemSettings/messageInSite');
const phoneInfoRouter = require('./routers/views/systemSettings/phoneInfo');
const emailInfoRouter = require('./routers/views/systemSettings/emailInfo');
const settlementNAntiSettlementRouter = require('./routers/views/systemSettings/settlementNAntiSettlement');
const auditProcessRouter = require('./routers/views/systemSettings/auditProcess');
const printTemplateRouter = require('./routers/views/systemSettings/printTemplate');

app.use('/user', userLoginRouter);
app.use('/administrativeRegion', administrativeRegionRouter);
app.use('/systemLog', systemLogRouter);
app.use('/systemParameter', systemParameterRouter);
app.use('/FBackup', FBackupRouter);
app.use('/messageInSite', messageInSiteRouter);
app.use('/phoneInfo', phoneInfoRouter);
app.use('/emailInfo', emailInfoRouter);
app.use('/settlementNAntiSettlement', settlementNAntiSettlementRouter);
app.use('/auditProcess', auditProcessRouter);
app.use('/printTemplate', printTemplateRouter);

/**
 * server running at port 3001
 */

module.exports = app;