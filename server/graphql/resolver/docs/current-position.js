/* eslint-disable no-useless-escape */
const _ = require('lodash')
const moment = require('moment')
const Sequelize = require('sequelize')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()
const Op = Sequelize.Op
// const subscriptionKeys = require('../subscription-keys')

moment.locale('ru')

// type CurrentPosition {
//   id: ID!
//   startDate: Date
//   endDate: Date
//   EmployeeId: ID!
//   PositionId: ID!
//   DepartmentId: ID!
//   SubdivisionId: [ID]
//   Subdivision: String
//   extPrefix: String
//   intPrefix: String
//   createdAt: TimeStamp!
//   updatedAt: TimeStamp!
// }
const getCurrentPositionData = async (ids) => {
  const where = ids ? { where: { id: { [Op.in]: ids } } } : {}
  return await Docs.CurrentPosition.findAll({
    ...where,
    include: [
      {
        model: Docs.Subdivision,
        attributes: ['id', 'name'],
        through: {
          attributes: []
        }
      }
    ]
  }) || []
}
const formCurrentPosition = (items) => {
  const output = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i].dataValues
    const subdivId = []
    const subdiv = []
    item.Subdivisions.forEach((el) => {
      subdivId.push(el.id)
      subdiv.push(el.name)
    })
    output[i] = {
      id: item.id,
      startDate: item.startDate ? moment(item.startDate) : '',
      endDate: item.endDate ? moment(item.endDate) : '',
      EmployeeId: item.EmployeeId,
      PositionId: item.PositionId,
      DepartmentId: item.DepartmentId,
      SubdivisionId: subdivId,
      Subdivision: subdiv.join('\n'),
      extPrefix: item.extPrefix,
      intPrefix: item.intPrefix,
      createdAt: moment(item.createdAt),
      updatedAt: moment(item.updatedAt)
    }
  }
  return output
}

module.exports = {
  async addCurrentPosition (root, { currentPosition: { startDate, endDate, EmployeeId, PositionId, DepartmentId, SubdivisionId, extPrefix, intPrefix } }) {
    try {
      const iExtPrefix = _.trim(_.replace(extPrefix, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iIntPrefix = _.trim(_.replace(intPrefix, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      let candidate
      if (startDate && !endDate) {
        candidate = await Docs.CurrentPosition.findOne({ where: { startDate, EmployeeId, PositionId, DepartmentId } })
      } else if (!startDate && endDate) {
        candidate = await Docs.CurrentPosition.findOne({ where: { endDate, EmployeeId, PositionId, DepartmentId } })
      } else if (!startDate && !endDate) {
        candidate = await Docs.CurrentPosition.findOne({ where: { EmployeeId, PositionId, DepartmentId } })
      } else {
        candidate = await Docs.CurrentPosition.findOne({ where: { startDate, endDate, EmployeeId, PositionId, DepartmentId } })
      }
      if (candidate) {
        const message = {
          type: 'addCurrentPosition',
          text: 'Такая должность в этом интервале времени уже существует для данного сотрудника',
          messageType: 'error'
        }
        return message
      } else if (EmployeeId && PositionId && DepartmentId) {
        const curPos = await Docs.CurrentPosition.create({
          startDate,
          endDate,
          EmployeeId,
          PositionId,
          DepartmentId,
          extPrefix: iExtPrefix,
          intPrefix: iIntPrefix
        })
        if (SubdivisionId) {
          if (SubdivisionId.length) {
            await curPos.setSubdivisions(SubdivisionId)
          }
        }
        const message = {
          type: 'addCurrentPosition',
          text: 'Должность успешно добавлена',
          messageType: 'success',
          id: curPos.id,
          item: JSON.stringify({
            currentPosition: {
              startDate,
              endDate,
              EmployeeId,
              PositionId,
              DepartmentId,
              SubdivisionId: SubdivisionId || [],
              extPrefix,
              intPrefix
            }
          })
        }
        // curPos.SubdivisionId = curPos.SubdivisionId || []
        const candidateData = await getCurrentPositionData([curPos.id])
        const item = formCurrentPosition(candidateData)[0]
        pubsub.publish('CURRENT_POSITION_CHANGED', {
          currentPositionChanged: {
            type: 'add',
            id: [curPos.id],
            item: [item]
          }
        })
        return message
      } else {
        const message = {
          type: 'addCurrentPosition',
          text: 'Необходимо указать работника и должность',
          messageType: 'error'
        }
        return message
      }
    } catch (err) {
      const message = {
        type: 'addCurrentPosition',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editCurrentPosition (root, { id, currentPosition: { startDate, endDate, EmployeeId, PositionId, DepartmentId, SubdivisionId, extPrefix, intPrefix } }) {
    try {
      const candidate = await Docs.CurrentPosition.findByPk(id)
      const iExtPrefix = _.trim(_.replace(extPrefix, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const iIntPrefix = _.trim(_.replace(intPrefix, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      if (!candidate) {
        const message = {
          type: 'editCurrentPosition',
          text: 'Должность с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (!EmployeeId || !PositionId || !DepartmentId) {
          const message = {
            type: 'editCurrentPosition',
            text: 'Необходимо указать работника, должность и отдел',
            messageType: 'error'
          }
          return message
        } else {
          candidate.startDate = startDate
          candidate.endDate = endDate
          candidate.extPrefix = iExtPrefix
          candidate.intPrefix = iIntPrefix
          await candidate.save()
          await Promise.all([
            candidate.setEmployee(EmployeeId),
            candidate.setPosition(PositionId),
            candidate.setDepartment(DepartmentId),
            candidate.setSubdivisions(SubdivisionId)
            // SubdivisionId
            //   ? SubdivisionId.length
            //     ? candidate.setSubdivisions(SubdivisionId)
            //     : null
            //   : null
          ])
        }
        const message = {
          type: 'editCurrentPosition',
          text: 'Должность успешно изменена',
          messageType: 'success',
          id,
          item: JSON.stringify({ currentPosition: { startDate, endDate, EmployeeId, PositionId, DepartmentId, SubdivisionId, extPrefix, intPrefix } })
        }
        const candidateData = await getCurrentPositionData([candidate.id])
        const item = formCurrentPosition(candidateData)[0]
        pubsub.publish('CURRENT_POSITION_CHANGED', {
          currentPositionChanged: {
            type: 'edit',
            id: [candidate.id],
            item: [item]
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editCurrentPosition',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteCurrentPosition (root, { ids }) {
    try {
      // const candidate = await Docs.CurrentPosition.findByPk(id)
      await Docs.CurrentPosition.destroy({ where: { id: { [Op.in]: ids } } })
      const message = {
        type: 'deleteCurrentPosition',
        text: 'Должности успешно удалены',
        messageType: 'success',
        id: ids
      }
      pubsub.publish('CURRENT_POSITION_CHANGED', {
        currentPositionChanged: {
          type: 'delete',
          id: ids
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteCurrentPosition',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllCurrentPosition () {
    try {
      console.time('getAllCurrentPosition')
      const itemData = await getCurrentPositionData()
      const output = formCurrentPosition(itemData)
      console.timeEnd('getAllCurrentPosition')
      return output
    } catch (err) {
      throw err
    }
  },
  async getCurrentPosition (root, { id }) {
    try {
      const itemData = await getCurrentPositionData([id])
      const output = formCurrentPosition(itemData)[0]
      return output
    } catch (err) {
      throw err
    }
  }
}
