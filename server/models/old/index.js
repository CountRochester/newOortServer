const Sequelize = require('sequelize')
const dbOld = require('../../db/old')
// ----------------------------------------------------------------------------------
// Подключение моделей
const IsModel = require('./is')
const VxModel = require('./vx')
const VxOtprModel = require('./vx_otpr')
const VxTipModel = require('./vx_tip')
const VxSubjModel = require('./vx_subj')
const IsSubjModel = require('./is_subj')
const IsIspolModel = require('./is_ispol')
const IsOtpravModel = require('./is_otprav')
const IsPolModel = require('./is_pol')

// ----------------------------------------------------------------------------------
// Подключение вспомогательных моделей
const Is = IsModel(dbOld, Sequelize)
const Vx = VxModel(dbOld, Sequelize)
const VxOtpr = VxOtprModel(dbOld, Sequelize)
const VxTip = VxTipModel(dbOld, Sequelize)
const VxSubj = VxSubjModel(dbOld, Sequelize)
const IsSubj = IsSubjModel(dbOld, Sequelize)
const IsIspol = IsIspolModel(dbOld, Sequelize)
const IsOtprav = IsOtpravModel(dbOld, Sequelize)
const IsPol = IsPolModel(dbOld, Sequelize)

// ----------------------------------------------------------------------------------
// Регистрация связей моделей

// ----------------------------------------------------------------------------------
module.exports = {
  dbOld,
  Sequelize,
  Is,
  VxOtpr,
  Vx,
  VxTip,
  VxSubj,
  IsSubj,
  IsIspol,
  IsOtprav,
  IsPol
}
