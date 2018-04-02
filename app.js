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

const commonRouter = require('./routers/common');

const userLoginRouter = require('./routers/login');
const indexRouter = require('./routers/index');
const guidanceRouter = require('./routers/guidance');

app.use('/common', commonRouter);

app.use('/user', userLoginRouter);
app.use('/index', indexRouter);
app.use('/guidance', guidanceRouter);

/**
 * 系统参数
 */

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
 * 基础资料
 */

const menuManagementRouter = require('./routers/views/baseData/menuManagement');
const departmentManagementRouter = require('./routers/views/companyOrganization/departmentManagement');
const companyManagementRouter = require('./routers/views/companyOrganization/companyManagement');
const userManagementRouter = require('./routers/views/companyOrganization/userManagement');
const clientInfoRouter = require('./routers/views/clientManagement/clientInfo');

app.use('/menuManagement', menuManagementRouter);
app.use('/departmentManagement', departmentManagementRouter);
app.use('/companyManagement', companyManagementRouter);
app.use('/userManagement', userManagementRouter);
app.use('/clientInfo', clientInfoRouter);

/**
 * server running at port 3333
 */

module.exports = app;