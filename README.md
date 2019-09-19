### 项目概览

```
---
 |---- app/                            客户端            
 |---- server/                         服务端     
    |---- api/                         接口层           
    |---- config/                      数据库配置项            
    |---- controler/                   业务层        
    |---- dao/                         数据库操作层        
    |---- model/                       模型层      
    |---- public/                      公共资源     
    |---- util/                        工具类       
    |---- package.json                 配置信息            
    |---- api.js                       接口     
    |---- app.js                       项目启动入口          
    |---- README.md                    说明文档     
```

### 环境要求

1. NodeJS 8.9+ 环境
2. MongoDB 4.0.6+


### app
```js
# install dependency
npm install

# develop
npm run dev

# build for production environment
npm run build:prod
```

### server
```js
# install dependency
npm install

# start api server
node app.js / npm start apiserver
```



out 1