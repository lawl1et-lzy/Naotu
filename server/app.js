const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser'); // 实现cookie的解析
const session = require('express-session')
const fs = require('fs'); // 引入文件模块
const logger = require('morgan'); // 日志组件
const api = require('./api/index.js'); // 引入api
const http = require('http');
const db =  require('./config/connect.js'); // mongodb 配置
const validateMW = require('./util/validate.js') // 验证中间件
const sessionCfg = require('./config/session.js') // session 配置
const app = express();

db.openDB();  // mongodb 启动
const PORT = 3000; // 端口号

app.use(session(sessionCfg));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'tmp')));

// 验证session
app.use(validateMW.validateSession)

app.use(api);

const httpServer = http.createServer(app);

httpServer.listen(PORT);

console.log('success listen http server…………', PORT);

module.exports = app;
