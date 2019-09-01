const db = require('./db.js')
const mongoose = require('mongoose')

const mongo = db.mongo;
// let url = `mongodb://${mongo.user}:${mongo.pwd}@${mongo.host}:${mongo.port}/${mongo.name}?authSource=admin`
let url = `mongodb://${mongo.host}:${mongo.port}/${mongo.name}`

module.exports.openDB = function() {
  // 连接数据库
  mongoose.connect(url, { useNewUrlParser: true })

  const db = mongoose.connection;

  db.on('error', () => {
    console.log('url', url)
    console.log('mongoDB connect error')
  })

  db.once('open', () => {
    console.log('mongoDB connect success')
  })

  return db
}


