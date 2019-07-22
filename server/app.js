const express = require('express');
const path = require('path');
// 实现cookie的解析
const cookieParser = require('cookie-parser');
// 引入文件模块
const fs = require('fs');
// 日志组件
const logger = require('morgan');
// 引入api
const api = require('./api');
const http = require('http');
const https = require('https');
// mongodb 配置
const db =  require('./db/connect.js');
db.openDB();  // mongodb 启动
// 端口号
const PORT = 3000;
const SSLPORT = 3001;
const app = express();

var certOptions = {
  key: fs.readFileSync('ssl/server.key','utf8'),
  cert: fs.readFileSync('ssl/server.crt','utf8')
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(api);

//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin)
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",'3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  // 允许跨域cookie存储
  res.header("Access-Control-Allow-Credentials", "true")
  if(req.method=="OPTIONS") res.sendStatus(200);/*让options请求快速返回*/
  else  next();
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(certOptions, app);

httpServer.listen(PORT);
httpsServer.listen(SSLPORT);

console.log('success listen http server…………', PORT);
console.log('success listen https server…………', SSLPORT);

module.exports = app;
