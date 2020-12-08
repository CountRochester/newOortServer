// Настройка подключения БД документооборота
// ----------------------------------------------
// Подключение модулей
const Sequelize = require('sequelize')
const keys = require('../keys')
// ----------------------------------------------
const sequelize = new Sequelize(keys.DB_DOCS, keys.DB_USER_DOCS, keys.DB_PSWD_DOCS, {
  host: keys.DB_HOST,
  port: keys.DB_PORT,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 2,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})
module.exports = sequelize
