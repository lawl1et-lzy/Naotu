const sessionOptions = {
  name: 'naotu',

  secret: '2eb6d8d2f3af11d194e9c60a9edccc8e',

  resave: true,

  saveUninitialized: false,

  rolling: true,
  
  cookie: { 
    maxAge: 3600 * 1000, 
    httpOnly: true 
  }
}

module.exports = sessionOptions