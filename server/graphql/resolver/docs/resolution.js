/* eslint-disable no-useless-escape */
const _ = require('lodash')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const moment = require('moment')
const pubsub = require('../../pubsub').getInstance()

const Docs = require('../../../models/docs')

moment.locale('ru')

function formResolution (item) {
  item.expirationDate = item.expirationDate ? moment(item.expirationDate) : null
  item.createdAt = moment(item.createdAt)
  item.updatedAt = moment(item.updatedAt)
  return item
}

function formResolutionE (item) {
  return {
    id: item.id,
    text: item.text,
    expirationDate: item.expirationDate ? moment(item.expirationDate) : '',
    extIncoming: item.ExtIncomingId,
    intIncoming: item.IntIncomingId,
    internal: item.InternalId,
    author: item.authorId,
    executants: item.executant.reduce((acc, it, index) => { acc[index] = it.id; return acc }, []),
    complete: item.complete,
    createdAt: moment(item.createdAt),
    updatedAt: moment(item.updatedAt)
  }
}

async function getResolutionData (idArr) {
  const output = await Docs.Resolution.findAll({
    where: {
      id: { [Op.in]: idArr }
    },
    include: [
      {
        model: Docs.CurrentPosition,
        as: 'executant',
        attributes: ['id']
      }
    ]
  })
  return output
}

async function getCurrentPositionInDepAndParentsF (id) {
  try {
    if (id) {
      // Получение списка всех дочерних отделов
      const allParentDeps = []
      let parentDep = await Docs.Department.findAll({
        attributes: [
          'id',
          'parentDepartmentId'
        ],
        where: {
          id
        }
      })
      parentDep = parentDep[0].dataValues
      for (; true;) {
        allParentDeps.unshift(parentDep)
        if (!parentDep.parentDepartmentId) {
          break
        } else {
          parentDep = await Docs.Department.findAll({
            attributes: [
              'id',
              'parentDepartmentId'
            ],
            where: {
              id: parentDep.parentDepartmentId
            }
          })
          parentDep = parentDep[0].dataValues
        }
      }
      // Преобразование массива найденных отделов в массив id
      const depIds = allParentDeps.reduce((acc, item, index) => { acc[index] = item.id; return acc }, [])
      // Получение списка всех служащих из найденных отделов
      const curPos = await Docs.CurrentPosition.findAll({
        attributes: ['id'],
        where: {
          DepartmentId: { [Op.in]: depIds }
        }
      })
      const curPosIds = curPos.reduce((acc, item, index) => { acc[index] = item.dataValues.id; return acc }, [])
      // Определение резолюций для всех найденных служащих
      return curPosIds
    } else {
      return null
    }
  } catch (err) {
    throw err
  }
}

module.exports = {
  async addResolution (root, {
    resolution: {
      text,
      expirationDate,
      ExtIncomingId,
      IntIncomingId,
      InternalId,
      authorId,
      complete
    }, executantsId }) {
    try {
      const iText = _.trim(_.replace(text, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      let iComplete = false
      if (complete) {
        iComplete = true
      }
      const resolution = await Docs.Resolution.create({
        text: iText,
        expirationDate,
        ExtIncomingId,
        IntIncomingId,
        InternalId,
        authorId,
        complete: iComplete
      })
      if (executantsId) {
        await resolution.setExecutant(executantsId)
      }
      const message = {
        type: 'addResolution',
        text: 'Резолюция успешно добавлена',
        messageType: 'success',
        id: resolution.id,
        item: JSON.stringify({
          resolution: {
            text,
            expirationDate,
            ExtIncomingId,
            IntIncomingId,
            InternalId,
            authorId,
            complete,
            executantsId
          }
        })
      }
      const output = await getResolutionData([resolution.id])
      pubsub.publish('RESOLUTION_CHANGED', {
        resolutionChanged: {
          type: 'add',
          id: resolution.id,
          item: formResolutionE(output[0].dataValues)
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'addResolution',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editResolution (root, {
    id,
    resolution: {
      text,
      expirationDate,
      ExtIncomingId,
      IntIncomingId,
      InternalId,
      authorId,
      complete
    }, executantsId }) {
    try {
      const iText = _.trim(_.replace(text, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
      const candidate = await Docs.Resolution.findByPk(id)
      let iComplete = false
      if (complete) {
        iComplete = true
      }
      if (!candidate) {
        const message = {
          type: 'editResolution',
          text: 'Резолюции с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        if (iText === '') {
          const message = {
            type: 'editResolution',
            text: 'Резолюция не должна быть пустой',
            messageType: 'error'
          }
          return message
        } else {
          candidate.text = iText
          candidate.expirationDate = expirationDate
          candidate.ExtIncomingId = ExtIncomingId
          candidate.IntIncomingId = IntIncomingId
          candidate.InternalId = InternalId
          candidate.authorId = authorId
          candidate.complete = iComplete
        }
        await candidate.save()
        if (executantsId) {
          await candidate.setExecutant(executantsId)
        }
        const message = {
          type: 'editResolution',
          text: 'Резолюция успешно изменена',
          messageType: 'success',
          id,
          item: JSON.stringify({
            resolution: {
              text,
              expirationDate,
              ExtIncomingId,
              IntIncomingId,
              InternalId,
              authorId,
              complete,
              executantsId
            }
          })
        }
        const output = await getResolutionData([candidate.id])
        pubsub.publish('RESOLUTION_CHANGED', {
          resolutionChanged: {
            type: 'edit',
            id: candidate.id,
            item: formResolutionE(output[0].dataValues)
          }
        })
        return message
      }
    } catch (err) {
      const message = {
        type: 'editResolution',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteResolution (root, { id }) {
    try {
      const candidate = await Docs.Resolution.findByPk(id)
      await candidate.destroy()
      const message = {
        type: 'deleteResolution',
        text: `Резолюция успешно удалена`,
        messageType: 'success',
        id
      }
      pubsub.publish('RESOLUTION_CHANGED', {
        resolutionChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteResolution',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllResolution () {
    try {
      return await Docs.Resolution.findAll()
    } catch (err) {
      throw err
    }
  },
  async getCurrentPositionInDepAndParents (root, { id }) {
    try {
      if (id) {
        // Получение списка всех дочерних отделов
        const allParentDeps = []
        let parentDep = await Docs.Department.findAll({
          attributes: [
            'id',
            'parentDepartmentId'
          ],
          where: {
            id
          }
        })
        parentDep = parentDep[0].dataValues
        for (; true;) {
          allParentDeps.unshift(parentDep)
          if (!parentDep.parentDepartmentId) {
            break
          } else {
            parentDep = await Docs.Department.findAll({
              attributes: [
                'id',
                'parentDepartmentId'
              ],
              where: {
                id: parentDep.parentDepartmentId
              }
            })
            parentDep = parentDep[0].dataValues
          }
        }
        // Преобразование массива найденных отделов в массив id
        const depIds = allParentDeps.reduce((acc, item, index) => { acc[index] = item.id; return acc }, [])
        // Получение списка всех служащих из найденных отделов
        const curPos = await Docs.CurrentPosition.findAll({
          attributes: ['id'],
          where: {
            DepartmentId: { [Op.in]: depIds }
          }
        })
        const curPosIds = curPos.reduce((acc, item, index) => { acc[index] = item.dataValues.id; return acc }, [])
        // Определение резолюций для всех найденных служащих
        return curPosIds
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },
  async getAllResolutionsInDep (root, { id }) {
    try {
      if (id) {
        console.time('getAllResolutionsInDep')
        const curPosIds = await getCurrentPositionInDepAndParentsF(id)
        // Определение резолюций для всех найденных служащих
        const output = await Docs.Resolution.findAll({
          where: {
            authorId: { [Op.in]: curPosIds }
          }
        })
        // const resolutions = JSON.parse(JSON.stringify(output, null, 2))
        // resolutions.forEach((item) => {
        //   item.expirationDate = item.expirationDate ? moment(item.expirationDate) : null
        //   item.createdAt = moment(item.createdAt)
        //   item.updatedAt = moment(item.updatedAt)
        // })
        const resolutions = []
        for (let i = 0; i < output.length; i++) {
          resolutions[i] = formResolution(output[i].dataValues)
        }
        console.timeEnd('getAllResolutionsInDep')
        // console.log(resolutions)
        return resolutions
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getAllResolutionsInDepE (root, { id }) {
    try {
      if (id) {
        console.time('getAllResolutionsInDepE')
        const resolutionsE = []
        const curPosIds = await getCurrentPositionInDepAndParentsF(id)
        const output = await Docs.Resolution.findAll({
          where: {
            authorId: { [Op.in]: curPosIds }
          },
          include: [
            {
              model: Docs.CurrentPosition,
              as: 'executant',
              attributes: ['id']
            }
          ]
        })
        for (let i = 0; i < output.length; i++) {
          const res = output[i].dataValues
          resolutionsE[i] = formResolutionE(res)
        }
        console.timeEnd('getAllResolutionsInDepE')
        // console.log(resolutionsE)
        return resolutionsE
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getResolutionsByDoc (root, { id, type }) {
    switch (type) {
      case 'extInc': {
        const output = await Docs.Resolution.findAll({
          where: {
            ExtIncomingId: id
          },
          include: [
            {
              model: Docs.CurrentPosition,
              as: 'executant',
              attributes: ['id']
            }
          ]
        })
        const resolutions = []
        for (let i = 0; i < output.length; i++) {
          resolutions[i] = formResolutionE(output[i].dataValues)
        }
        return resolutions
      }
      case 'intInc': {
        const output = await Docs.Resolution.findAll({
          where: {
            IntIncomingId: id
          },
          include: [
            {
              model: Docs.CurrentPosition,
              as: 'executant',
              attributes: ['id']
            }
          ]
        })
        const resolutions = []
        for (let i = 0; i < output.length; i++) {
          resolutions[i] = formResolutionE(output[i].dataValues)
        }
        return resolutions
      }
      case 'internal': {
        const output = await Docs.Resolution.findAll({
          where: {
            InternalId: id
          },
          include: [
            {
              model: Docs.CurrentPosition,
              as: 'executant',
              attributes: ['id']
            }
          ]
        })
        const resolutions = []
        for (let i = 0; i < output.length; i++) {
          resolutions[i] = formResolutionE(output[i].dataValues)
        }
        return resolutions
      }
    }
  },

  async getResolution (root, { id }) {
    try {
      if (id) {
        return await Docs.Resolution.findByPk(id)
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getResolutionAuthor (root, { id }) {
    try {
      if (id) {
        const resolution = await this.getResolution({ id })
        return await resolution.getAuthor()
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getResolutionEmployees (root, { id }) {
    try {
      if (id) {
        const resolution = await this.getResolution({ id })
        return await resolution.getEmployees()
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getDocument (resolutions) {
    if (resolutions) {
      const documents = {
        ExtIncomings: [],
        IntIncomings: [],
        Internals: []
      }
      const uniqEI = []
      const uniqII = []
      const uniqI = []
      for (const resolution of resolutions) {
        const extIncoming = await resolution.getExtIncoming()
        if (extIncoming) {
          if (!uniqEI.includes(extIncoming.id)) {
            documents.ExtIncomings.push(extIncoming)
          }
          uniqEI.push(extIncoming.id)
        }

        const intIncoming = await resolution.getIntIncoming()
        if (intIncoming) {
          if (!uniqII.includes(intIncoming.id)) {
            documents.IntIncomings.push(intIncoming)
          }
          uniqII.push(intIncoming.id)
        }

        const internal = await resolution.getInternal()
        if (internal) {
          if (!uniqI.includes(internal.id)) {
            documents.Internals.push(internal)
          }
          uniqII.push(internal.id)
        }
      }
      return documents
    } else {
      return null
    }
  },

  async getAllDocumentsNotComplete () {
    try {
      const resolutions = await Docs.Resolution.findAll({ where: { complete: false } })
      return await this.getDocument(resolutions)
    } catch (err) {
      throw err
    }
  },

  async getAllDocumentsOutOfDate () {
    try {
      const resolutions = await Docs.Resolution.findAll({ where: { complete: false, expirationDate: { [Op.lte]: moment.now() } } })
      return await this.getDocument(resolutions)
    } catch (err) {
      throw err
    }
  },

  async getAllDocumentsToDate (root, { date }) {
    try {
      if (date) {
        const resolutions = await Docs.Resolution.findAll({ where: { complete: false, expirationDate: { [Op.lte]: date } } })
        return await this.getDocument(resolutions)
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getAllDocumentsByResolutionAuthor (root, { id }) {
    try {
      if (id) {
        const resolutions = await Docs.Resolution.findAll({ where: { authorId: id } })
        return await this.getDocument(resolutions)
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async comleteResolution (root, { id }) {
    try {
      if (id) {
        // const resolution = await this.getResolution({ id })
        const output = await getResolutionData([id])
        const resolution = formResolutionE(output[0].dataValues)
        if (resolution) {
          resolution.complete = true
          await resolution.save()
          const message = {
            type: 'comleteResolution',
            text: `Резолюция успешно изменена`,
            messageType: 'success',
            id
          }
          pubsub.publish('RESOLUTION_CHANGED', {
            resolutionChanged: {
              type: 'edit',
              id: resolution.id,
              item: resolution
            }
          })
          return message
        } else {
          const message = {
            type: 'comleteResolution',
            text: `Такой резолюции не существует`,
            messageType: 'error'
          }
          return message
        }
      } else {
        const message = {
          type: 'comleteResolution',
          text: `Не указан id резолюции`,
          messageType: 'error'
        }
        return message
      }
    } catch (err) {
      const message = {
        type: 'comleteResolution',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getResolutionsByIds (root, { ids }) {
    try {
      const output = await getResolutionData(ids)
      const resolution = []
      for (let i = 0; i < output.length; i++) {
        resolution[i] = formResolutionE(output[i].dataValues)
      }
      return resolution
    } catch (err) {
      throw err
    }
  }
}
