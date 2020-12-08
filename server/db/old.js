// Настройка подключения БД аутентификации
// ----------------------------------------------
// Подключение модулей
const Sequelize = require('sequelize')
const keys = require('../keys')
// ----------------------------------------------
const sequelize = new Sequelize('Old', keys.DB_USER_AUTH, keys.DB_PSWD_AUTH, {
  host: keys.DB_HOST,
  port: keys.DB_PORT,
  dialect: 'postgres',
  logging: false
})
module.exports = sequelize
