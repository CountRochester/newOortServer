/* eslint-disable no-useless-escape */
// const _ = require('lodash')
const moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()

moment.locale('ru')

async function getExtCurrentPositionData (idArr) {
  try {
    let output
    if (idArr) {
      output = await Docs.ExtCurrentPosition.findAll({
        where: {
          id: { [Op.in]: idArr }
        },
        include: [
          {
            model: Docs.Position,
            attributes: ['posName']
          },
          {
            model: Docs.Organisation,
            attributes: ['orgName']
          }
        ]
      }) || []
    } else {
      output = await Docs.ExtCurrentPosition.findAll({
        include: [
          {
            model: Docs.Position,
            attributes: ['posName']
          },
          {
            model: Docs.Organisation,
            attributes: ['orgName']
          }
        ]
      }) || []
    }
    return output
  } catch (error) {
    throw error
  }
}

function formExtCurrentPosition (item) {
  return {
    id: item.id,
    startDate: item.startDate ? moment(item.startDate) : '',
    endDate: item.endDate ? moment(item.endDate) : '',
    ExtEmployeeId: item.ExtEmployeeId,
    PositionId: item.PositionId,
    Position: item.Position.posName,
    OrganisationId: item.OrganisationId,
    Organisation: item.Organisation.orgName,
    createdAt: moment(item.createdAt),
    updatedAt: moment(item.updatedAt)
  }
}

module.exports = {
  async addExtCurrentPosition (root, { extCurrentPosition: { startDate, endDate, ExtEmployeeId, PositionId, OrganisationId } }) {
    try {
      let candidate
      if (startDate && !endDate) {
        candidate = await Docs.ExtCurrentPosition.findOne({ where: { startDate, ExtEmployeeId, PositionId, OrganisationId } })
      } else if (!startDate && endDate) {
        candidate = await Docs.ExtCurrentPosition.findOne({ where: { endDate, ExtEmployeeId, PositionId, OrganisationId } })
      } else if (!startDate && !endDate) {
        candidate = await Docs.ExtCurrentPosition.findOne({ where: { ExtEmployeeId, PositionId, OrganisationId } })
      } else {
        candidate = await Docs.ExtCurrentPosition.findOne({ where: { startDate, endDate, ExtEmployeeId, PositionId, OrganisationId } })
      }
      if (candidate) {
        const message = {
          type: 'addExtCurrentPosition',
          text: 'Такая должность в этом интервале времени уже существует для данного сотрудника',
          messageType: 'error'
        }
        return message
      } else if (ExtEmployeeId && PositionId && OrganisationId) {
        const curPos = await Docs.ExtCurrentPosition.create({
          startDate,
          endDate,
          ExtEmployeeId,
          PositionId,
          OrganisationId
        })
        const message = {
          type: 'addExtCurrentPosition',
          text: 'Должность успешно добавлена',
          messageType: 'success',
          id: curPos.id,
          item: JSON.stringify({ extCurrentPosition: { startDate, endDate, ExtEmployeeId, PositionId, OrganisationId } })
        }
        const output = await getExtCurrentPositionData([curPos.id])
        const newCurPos = formExtCurrentPosition(output[0].dataValues)
        pubsub.publish('EXT_CURRENT_POSITION_CHANGED', {
          extCurrentPositionChanged: {
            type: 'add',
            id: newCurPos.id,
            item: newCurPos
          }
        })
        return message
      } else {
        const message = {
          type: 'addExtCurrentPosition',
          text: 'Необходимо указать работника и должность',
          messageType: 'error'
        }
        return message
      }
    } catch (err) {
      const message = {
        type: 'addExtCurrentPosition',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editExtCurrentPosition (root, { id, extCurrentPosition: { startDate, endDate, ExtEmployeeId, PositionId, OrganisationId } }) {
    try {
      const candidate = await Docs.ExtCurrentPosition.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'editExtCurrentPosition',
          text: 'Должность с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (!ExtEmployeeId || !PositionId || !OrganisationId) {
          const message = {
            type: 'editExtCurrentPosition',
            text: 'Необходимо указать работника, должность и организацию',
            messageType: 'error'
          }
          return message
        } else {
          candidate.startDate = startDate
          candidate.endDate = endDate
          await candidate.save()
          await Promise.all([
            candidate.setExtEmployee(ExtEmployeeId),
            candidate.setPosition(PositionId),
            candidate.setOrganisation(OrganisationId)
          ])
        }
        const message = {
          type: 'editExtCurrentPosition',
          text: 'Должность успешно изменена',
          messageType: 'success',
          id,
          item: JSON.stringify({ extCurrentPosition: { startDate, endDate, ExtEmployeeId, PositionId, OrganisationId } })
        }
        const output = await getExtCurrentPositionData([candidate.id])
        const newCurPos = formExtCurrentPosition(output[0].dataValues)
        pubsub.publish('EXT_CURRENT_POSITION_CHANGED', {
          extCurrentPositionChanged: {
            type: 'edit',
            id: newCurPos.id,
            item: newCurPos
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editExtCurrentPosition',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteExtCurrentPosition (root, { id }) {
    try {
      const candidate = await Docs.ExtCurrentPosition.findByPk(id)
      await candidate.destroy()
      const message = {
        type: 'deleteExtCurrentPosition',
        text: `Должность успешно удалена`,
        messageType: 'success',
        id
      }
      pubsub.publish('EXT_CURRENT_POSITION_CHANGED', {
        extCurrentPositionChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteExtCurrentPosition',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllExtCurrentPosition () {
    try {
      console.time('getAllExtCurrentPosition')
      const output = await getExtCurrentPositionData()
      const curPos = []
      for (let i = 0; i < output.length; i++) {
        const item = output[i].dataValues
        curPos[i] = formExtCurrentPosition(item)
      }
      console.timeEnd('getAllExtCurrentPosition')
      return curPos
    } catch (err) {
      throw err
    }
  },
  async getExtCurrentPosition (root, { id }) {
    try {
      const output = await getExtCurrentPositionData([id])
      const curPos = formExtCurrentPosition(output[0].dataValues)
      return curPos
    } catch (err) {
      throw err
    }
  }
}
