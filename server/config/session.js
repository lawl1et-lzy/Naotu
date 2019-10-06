const sessionOptions = {
  name: 'naotu', // 设置cookie中，保存session的字段名称，默认为connect.sid

  // store: session的存储方式，默认为存放在内存中，我们可以自定义redis等

  secret: '2eb6d8d2f3af11d194e9c60a9edccc8e', // 通过设置的secret字符串，来计算hash值并放在cookie中，使产生的signedCookie防篡改

  resave: true, // 即使session没有被修改，也保存session值，默认为true

  saveUninitialized: false, // 强制未初始化的session保存到数据库

  rolling: true, // 每个请求都重新设置一个cookie，默认为false
  
  cookie: { // 设置存放sessionid的cookie的相关选项
    maxAge: 3600 * 1000, 
    httpOnly: true 
  }
}

module.exports = sessionOptions