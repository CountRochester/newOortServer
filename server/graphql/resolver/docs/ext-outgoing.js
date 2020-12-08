/* eslint-disable no-useless-escape */
const _ = require('lodash')
const moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const { memoize } = require('../../../memo')
const pubsub = require('../../pubsub').getInstance()
const Docs = require('../../../models/docs')
const extOutFile1 = require('./ext-out-file')

moment.locale('ru')

function formExtOutgoingRequest (item) {
  const curAdsress = []
  const curAdsressId = []
  const curTemas = []
  const curTemasId = []
  const curOrgs = []
  const curOrgsId = []
  const curFiles = []
  const curFilesId = []
  const curAnswers = []
  const curAnswersId = []
  const curPodp = []
  const curPodpId = []
  item.ExtCurrentPositions.forEach((addr) => {
    curAdsressId.push(addr.id)
    curAdsress.push(addr.ExtEmployee.secondName + ' ' + addr.ExtEmployee.firstName[0] + '.' + addr.ExtEmployee.middleName[0] + '.')
    curOrgsId.push(addr.Organisation.id)
    curOrgs.push(addr.Organisation.orgName)
  })
  item.Temas.forEach((tema) => {
    curTemas.push(tema.name)
    curTemasId.push(tema.id)
  })
  item.podpisant.forEach((podp) => {
    curPodp.push(podp.Employee.secondName + ' ' + podp.Employee.firstName[0] + '.' + podp.Employee.middleName[0] + '.')
    curPodpId.push(podp.id)
  })
  item.ExtOutFiles.forEach((file) => {
    curFilesId.push(file.id)
    curFiles.push(file.file)
  })
  item.answer.forEach((el) => {
    curAnswersId.push(el.id)
    const date = moment(el.extDate).format('L')
    curAnswers.push(`№${el.extNumber} от ${date}`)
  })
  return {
    id: item.id,
    outNumber: item.outNumber,
    prefix: item.prefix,
    outDate: moment(item.outDate),
    subject: item.subject,
    author: item.author ? item.author.Employee.secondName + ' ' + (item.author.Employee.firstName[0] || '') + '.' + (item.author.Employee.middleName[0] || '') + '.' : null,
    authorId: item.author ? item.author.id : null,
    type: item.Type ? item.Type.name : null,
    typeId: item.Type ? item.Type.id : null,
    state: item.State ? item.State.name : null,
    stateId: item.State ? item.State.id : null,
    podpisants: curPodp.join('\n'),
    podpisantsId: curPodpId,
    addressees: curAdsress.length ? curAdsress.join('\n') : null,
    addresseesId: curAdsressId,
    temas: curTemas.length ? curTemas.join('\n') : null,
    temasId: curTemasId,
    note: item.note,
    organisations: curOrgs.length ? curOrgs.join('\n') : null,
    organisationsId: curOrgsId,
    department: item.author ? item.author.Department.shortName : '',
    departmentId: item.author ? item.author.Department.id : null,
    files: curFiles.join(', '),
    filesId: curFilesId,
    isAnswerOn: curAnswers.length ? curAnswers.join('\n') : null,
    isAnswerOnId: curAnswersId,
    updatedAt: item.updatedAt
  }
}

async function getExtOutgoingRequestData (idArr) {
  const output = await Docs.ExtOutgoing.findAll({
    attributes: [
      'id',
      'outNumber',
      'outDate',
      'prefix',
      'subject',
      'note',
      'updatedAt'
    ],
    where: {
      id: { [Op.in]: idArr }
    },
    include: [
      // Автор
      {
        model: Docs.CurrentPosition,
        as: 'author',
        attributes: [
          'id',
          'extPrefix',
          'intPrefix'
        ],
        include: [
          // Служащий
          {
            model: Docs.Employee,
            attributes: [
              'id',
              'firstName',
              'secondName',
              'middleName'
            ]
          },
          // Отдел
          {
            model: Docs.Department,
            attributes: [
              'id',
              'shortName',
              'depPrefix'
            ]
          }
        ]
      },
      // Состояние
      {
        model: Docs.State,
        attributes: [
          'id',
          'name'
        ]
      },
      // Адрессат
      {
        model: Docs.ExtCurrentPosition,
        attributes: [
          'id'
        ],
        through: {
          attributes: []
        },
        include: [
          {
            model: Docs.Organisation,
            attributes: [
              'id',
              'orgName'
            ]
          },
          {
            model: Docs.ExtEmployee,
            attributes: [
              'id',
              'firstName',
              'secondName',
              'middleName'
            ]
          },
          {
            model: Docs.Position,
            attributes: [
              'id',
              'posName'
            ]
          }
        ]
      },
      // Тип документа
      {
        model: Docs.Type,
        attributes: [
          'id',
          'name'
        ]
      },
      // Тема
      {
        model: Docs.Tema,
        attributes: [
          'id',
          'name'
        ],
        through: {
          attributes: []
        }
      },
      // Подписанты
      {
        model: Docs.CurrentPosition,
        as: 'podpisant',
        attributes: [
          'id',
          'extPrefix',
          'intPrefix'
        ],
        through: {
          attributes: []
        },
        include: [
          // Служащий
          {
            model: Docs.Employee,
            attributes: [
              'id',
              'firstName',
              'secondName',
              'middleName'
            ]
          },
          // Отдел
          {
            model: Docs.Department,
            attributes: [
              'id',
              'shortName'
            ]
          },
          // Должность
          {
            model: Docs.Position,
            attributes: [
              'id',
              'posName'
            ]
          }
        ]
      },
      // Файлы
      {
        model: Docs.ExtOutFile,
        attributes: [
          'id',
          'file'
        ]
      },
      // Ответ на
      {
        model: Docs.ExtIncoming,
        as: 'answer',
        attributes: [
          'id',
          'extNumber',
          'extDate'
        ],
        through: {
          attributes: []
        }
      }
    ]
  })
  return output
}

async function addExtOut ({
  extOutgoing: {
    outNumber,
    outDate,
    prefix,
    subject,
    authorId,
    TypeId,
    StateId
  }, extCurrentPositionId, temaId, podpisantId, answerId, fileId
}) {
  try {
    const iSubject = _.trim(_.replace(subject, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
    const iPrefix = _.trim(_.replace(prefix, /[\[\]&{}<>#$%^*!@+`'"+~]+/g, ''))
    const candidate = await Docs.ExtOutgoing.findOne({ where: { outNumber, outDate } })
    if (candidate) {
      const message = {
        type: 'addExtOutgoing',
        text: 'Такой исходящий документ уже существует',
        messageType: 'error'
      }
      return message
    } else {
      const extOutgoing = await Docs.ExtOutgoing.create({
        outNumber,
        outDate,
        prefix: iPrefix,
        subject: iSubject,
        authorId,
        TypeId,
        StateId
      })
      const message = {
        text: '',
        messageType: 'success',
        item: JSON.stringify({
          extOutgoing: {
            outNumber,
            outDate,
            prefix,
            subject,
            authorId,
            TypeId,
            StateId,
            extCurrentPositionId,
            temaId,
            podpisantId,
            answerId,
            fileId
          }
        })
      }
      if (extCurrentPositionId) {
        await extOutgoing.setExtCurrentPositions(extCurrentPositionId)
      }
      if (temaId) {
        await extOutgoing.setTemas(temaId)
      }
      if (podpisantId) {
        await extOutgoing.setPodpisant(podpisantId)
      }
      if (answerId) {
        await extOutgoing.setAnswer(answerId)
      }
      if (fileId) {
        await extOutgoing.setExtOutFiles(fileId)
      }
      message.text = 'Исходящий документ успешно добавлен'
      message.id = extOutgoing.id
      return message
    }
  } catch (err) {
    const message = {
      type: 'addExtOutgoing',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function editExtOut ({
  id, extOutgoing: {
    outNumber,
    outDate,
    prefix,
    subject,
    authorId,
    TypeId,
    StateId
  }, extCurrentPositionId, temaId, podpisantId, answerId, fileId
}) {
  try {
    const iSubject = _.trim(_.replace(subject, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
    const iPrefix = _.trim(_.replace(prefix, /[\[\]&{}<>#$%^*!@+`'"+~]+/g, ''))
    const candidate = await Docs.ExtOutgoing.findByPk(id)
    if (!candidate) {
      const message = {
        type: 'editExtOutgoing',
        text: 'Исходящего документа с таким id не существует',
        messageType: 'error'
      }
      return message
    } else {
      candidate.outNumber = outNumber
      candidate.outDate = outDate
      candidate.prefix = iPrefix
      candidate.subject = iSubject
      candidate.authorId = authorId
      candidate.TypeId = TypeId
      candidate.StateId = StateId
      await candidate.save()
      const message = {
        type: 'editExtOutgoing',
        text: '',
        messageType: 'success',
        id,
        item: JSON.stringify({
          extOutgoing: {
            outNumber,
            outDate,
            prefix,
            subject,
            authorId,
            TypeId,
            StateId,
            extCurrentPositionId,
            temaId,
            podpisantId,
            answerId,
            fileId
          }
        })
      }
      if (extCurrentPositionId) {
        await candidate.setExtCurrentPositions(extCurrentPositionId)
      }
      if (temaId) {
        await candidate.setTemas(temaId)
      }
      if (podpisantId) {
        await candidate.setPodpisant(podpisantId)
      }
      if (answerId) {
        await candidate.setAnswer(answerId)
      } else {
        await candidate.setAnswer(null)
      }
      if (fileId) {
        await candidate.setExtOutFiles(fileId)
      }
      message.text = 'Данные исходящего документа успешно изменены'
      return message
    }
  } catch (err) {
    const message = {
      type: 'editExtOutgoing',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function nextState ({ id }) {
  try {
    const extOutgoing = await Docs.ExtOutgoing.findByPk(id)
    const nextState = await Docs.State.findOne({ where: { parentStateId: extOutgoing.StateId } })
    if (nextState) {
      extOutgoing.StateId = nextState.id
      await extOutgoing.save()
      const message = {
        type: 'setNextStateExtOutgoing',
        text: 'Состояние успешно изменено',
        messageType: 'success',
        id
      }
      return message
    } else {
      const message = {
        type: 'setNextStateExtOutgoing',
        text: 'Следующее состояние отсутствует',
        messageType: 'error'
      }
      return message
    }
  } catch (err) {
    const message = {
      type: 'setNextStateExtOutgoing',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function prevState ({ id }) {
  try {
    const extOutgoing = await Docs.ExtOutgoing.findByPk(id)
    const state = await Docs.State.findByPk(extOutgoing.StateId)
    const previousState = await Docs.State.findByPk(state.parentStateId)
    if (previousState) {
      extOutgoing.StateId = previousState.id
      await extOutgoing.save()
      const message = {
        type: 'setPreviousStateExtOutgoing',
        text: 'Состояние успешно изменено',
        messageType: 'success',
        id
      }
      return message
    } else {
      const message = {
        type: 'setPreviousStateExtOutgoing',
        text: 'Предшествующее состояние отсутствует',
        messageType: 'error'
      }
      return message
    }
  } catch (err) {
    const message = {
      type: 'setPreviousStateExtOutgoing',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function getRequest (key, { id }) {
  try {
    console.time('Fetching ExtOutgoings')
    const ExtOutgoingRequests = []
    const ids = await Docs.ExtOutgoing.findAll({
      attributes: [
        'id'
      ],
      include: [
        // Автор
        {
          model: Docs.CurrentPosition,
          as: 'author',
          where: {
            DepartmentId: id
          }
        }
      ]
    })
    const fetchedIds = Object.values(JSON.parse(JSON.stringify(ids, null, 2))).reduce((acc, item, index) => { acc[index] = item.id; return acc }, [])
    const output = await getExtOutgoingRequestData(fetchedIds)
    for (let i = 0; i < output.length; i++) {
      const item = output[i].dataValues
      ExtOutgoingRequests[i] = formExtOutgoingRequest(item)
    }
    console.timeEnd('Fetching ExtOutgoings')
    // return {
    //   a: '1'
    // }
    return ExtOutgoingRequests
  } catch (err) {
    throw err
  }
}

const memoizedExtOutgoingReq = memoize(getRequest)
memoizedExtOutgoingReq.maxSize = 10
memoizedExtOutgoingReq.size = 0
memoizedExtOutgoingReq.on('add', (key, err, data) => {
  if (memoizedExtOutgoingReq.size <= memoizedExtOutgoingReq.maxSize) {
    memoizedExtOutgoingReq.size++
  } else {
    memoizedExtOutgoingReq.cache.clear()
    memoizedExtOutgoingReq.size = 1
  }
})
memoizedExtOutgoingReq.on('del', (key) => {
  if (memoizedExtOutgoingReq.cache.has(key)) {
    memoizedExtOutgoingReq.size--
  }
})
memoizedExtOutgoingReq.on('clear', () => {
  memoizedExtOutgoingReq.size = 0
})

const deleteExtOutReqMemo = (id) => {
  const existedReq = memoizedExtOutgoingReq.get(id)
  if (existedReq) {
    memoizedExtOutgoingReq.del(id)
  }
}
const resetExtOutReqMemo = () => {
  memoizedExtOutgoingReq.clear()
}

module.exports = {
  memoizedExtOutgoingReq,
  deleteExtOutReqMemo,
  resetExtOutReqMemo,
  async addExtOutgoing (root, request) {
    const output = await addExtOut(request)
    return output
  },

  async publicateExtOutgoing (root, { id, publicateData }) {
    try {
      let doc, type
      const message = {
        type: 'publicateExtOutgoing',
        messageType: 'success'
      }
      if (id) {
        // Редактирование
        type = 'edit'
        message.text = 'Поиск документа: '
        doc = await Docs.ExtOutgoing.findByPk(id)
        if (doc) {
          message.text += 'документ успешно найден.\n'
          const request = {
            id,
            extOutgoing: {
              outNumber: publicateData.ExtOutgoing.outNumber,
              outDate: publicateData.ExtOutgoing.outDate,
              prefix: publicateData.ExtOutgoing.prefix,
              subject: publicateData.ExtOutgoing.subject,
              authorId: publicateData.ExtOutgoing.authorId,
              TypeId: publicateData.ExtOutgoing.TypeId,
              StateId: publicateData.ExtOutgoing.StateId
            },
            extCurrentPositionId: publicateData.ExtOutgoing.addresseesId,
            temaId: publicateData.ExtOutgoing.temaId,
            podpisantId: publicateData.ExtOutgoing.podpisantId,
            answerId: publicateData.ExtOutgoing.answerId
          }
          const editMess = await editExtOut(request)
          message.text += editMess.text + '\n'
          if (editMess.messageType === 'success') {
            doc = await Docs.ExtOutgoing.findByPk(id)
          } else {
            message.messageType = editMess.messageType
            return message
          }
        } else {
          message.text += `Внешний исходящий документ с id: ${id} отсутствует в базе`
          message.messageType = 'error'
          return message
        }
      } else {
        // Создание вновь
        type = 'add'
        const request = {
          extOutgoing: {
            outNumber: publicateData.ExtOutgoing.outNumber,
            outDate: publicateData.ExtOutgoing.outDate,
            prefix: publicateData.ExtOutgoing.prefix,
            subject: publicateData.ExtOutgoing.subject,
            authorId: publicateData.ExtOutgoing.authorId,
            TypeId: publicateData.ExtOutgoing.TypeId,
            StateId: publicateData.ExtOutgoing.StateId
          },
          extCurrentPositionId: publicateData.ExtOutgoing.addresseesId,
          temaId: publicateData.ExtOutgoing.temaId,
          podpisantId: publicateData.ExtOutgoing.podpisantId,
          answerId: publicateData.ExtOutgoing.answerId
        }
        message.text = 'Создание документа: '
        const addMess = await addExtOut(request)
        message.text += addMess.text + '\n'
        if (addMess.messageType === 'success') {
          doc = await Docs.ExtOutgoing.findByPk(addMess.id)
          console.log(doc)
        } else {
          message.messageType = addMess.messageType
          return message
        }
      }
      const author = await doc.getAuthor()
      const depId = author.DepartmentId
      deleteExtOutReqMemo(depId)
      // Добавление примечания
      if (publicateData.ExtOutgoing.note) {
        try {
          console.log(publicateData.ExtOutgoing)
          if (doc.note !== publicateData.ExtOutgoing.note) {
            doc.note = publicateData.ExtOutgoing.note
            await doc.save()
            message.text += 'Примечание успешно добавлено\n'
          }
        } catch (err) {
          message.text += 'Добавление примечания не удалось. \n' + err
          message.messageType = 'error'
          return message
        }
      } else {
        message.text += 'Добавление примечания не производилось.\n'
      }
      // Добавление файлов
      message.text += 'Добавление файлов: '
      if (publicateData.ExtOutgoing.filesId) {
        const fileMess = await extOutFile1.attachFilesToExtOut(null, {
          fileIds: publicateData.ExtOutgoing.filesId,
          extOutId: doc.id
        })
        message.text += fileMess.text
        if (fileMess.messageType === 'error') {
          message.messageType = fileMess.messageType
          return message
        }
      } else {
        message.text += 'Добавление файлов не производилось.\n'
      }
      // Изменение состояния
      message.text += 'Изменение состояния: '
      if (publicateData.ExtOutgoing.stateChanged) {
        const n = publicateData.ExtOutgoing.stateChanged
        if (n > 0) {
          // уменьшать индекс состояния
          for (let i = 0; i < n; i++) {
            const mess = await prevState({ id: doc.id })
            message.text += mess.text + '\n'
            if (mess.messageType === 'error') {
              message.messageType = mess.messageType
              return message
            }
          }
        } else if (n < 0) {
          // увеличивать индекс состояния
          for (let i = 0; i > n; i--) {
            const mess = await nextState({ id: doc.id })
            message.text += mess.text + '\n'
            if (mess.messageType === 'error') {
              message.messageType = mess.messageType
              return message
            }
          }
        }
      } else {
        message.text += 'изменение состояния не производилось.\n'
      }
      const rawData = await getExtOutgoingRequestData([doc.id])
      const output = formExtOutgoingRequest(rawData[0].dataValues)
      const files = await doc.getExtOutFiles()
      const item = {
        ExtOutgoing: output,
        ExtOutFiles: files
      }
      if (output) {
        pubsub.publish('EXT_OUTGOING_CHANGED', {
          extOutgoingChanged: {
            type,
            id: doc.id,
            item
          }
        })
        message.text += 'Внешний исходящий документ успешно разослан'
        message.id = doc.id
        message.item = JSON.stringify(output)
        console.log(message)
        return message
      } else {
        message.text += `Не удалось сформировать внешний исходящий документ с id: ${doc.id}`
        message.messageType = 'error'
        console.log(message)
        return message
      }
    } catch (err) {
      const message = {
        type: 'publicateExtOutgoing',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      console.log(message)
      return message
    }
  },

  async editExtOutgoing (root, request) {
    const output = await editExtOut(request)
    return output
  },

  async addNoteToExtOutgoing (root, { id, note }) {
    try {
      const extOut = await Docs.ExtOutgoing.findByPk(id)
      if (!extOut) {
        const message = {
          type: 'addNoteToExtOutgoing',
          text: 'Исходящего документа с таким id не существует',
          messageType: 'error'
        }
        return message
      } else {
        extOut.note = note
        await extOut.save()
        const message = {
          type: 'addNoteToExtOutgoing',
          text: 'Примечание успешно добавлено',
          messageType: 'success',
          id
        }
        return message
      }
    } catch (err) {
      const message = {
        type: 'addNoteToExtOutgoing',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async deleteExtOutgoing (root, { id }) {
    try {
      const candidate = await Docs.ExtOutgoing.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'deleteExtOutgoing',
          text: `Ошибка: внешний исходящий документ с id = ${id} не найден`,
          messageType: 'error'
        }
        return message
      }
      resetExtOutReqMemo()
      const files = await candidate.getExtOutFiles() || {}
      if (files.length) {
        for (const file of files) {
          await extOutFile1.deleteExtOutFile(null, { id: file.id })
        }
      }
      await candidate.destroy()
      const message = {
        type: 'deleteExtOutgoing',
        text: 'Входящий исходящий документ успешно удалён',
        messageType: 'success',
        id
      }
      pubsub.publish('EXT_OUTGOING_CHANGED', {
        extOutgoingChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteExtOutgoing',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllExtOutgoing () {
    try {
      return await Docs.ExtOutgoing.findAll()
    } catch (err) {
      throw err
    }
  },

  async getAllExtOutgoingInDepartment (root, { id }) {
    try {
      // const authors = await Department.getAllDepartmentEmployees({ id, date: '1900-01-01' })
      const department = await Docs.Department.findByPk(id)
      const authors = await department.getCurrentPositions()
      const extOutgoings = []
      for (const author of authors) {
        const extOuts = await Docs.ExtOutgoing.findAll({ where: { authorId: author.id } })
        for (const extOut of extOuts) {
          extOutgoings.push(extOut)
        }
      }
      return extOutgoings
    } catch (err) {
      throw err
    }
  },

  async getExtOutgoing (root, { id }) {
    try {
      return await Docs.ExtOutgoing.findByPk(id)
    } catch (err) {
      throw err
    }
  },

  async getExtOutgoingType (root, { id }) {
    try {
      const extOutgoing = await Docs.ExtOutgoing.findByPk(id)
      return await extOutgoing.getType()
    } catch (err) {
      throw err
    }
  },

  async getExtOutgoingState (root, { id }) {
    try {
      const extOutgoing = await Docs.ExtOutgoing.findByPk(id)
      return await extOutgoing.getState()
    } catch (err) {
      throw err
    }
  },

  async getExtOutgoingExtEmployees (root, { id }) {
    try {
      const extOutgoing = await Docs.ExtOutgoing.findByPk(id)
      return await extOutgoing.getExtEmployees()
    } catch (err) {
      throw err
    }
  },

  async getExtOutgoingTemas (root, { id }) {
    try {
      const extOutgoing = await Docs.ExtOutgoing.findByPk(id)
      return await extOutgoing.getTemas()
    } catch (err) {
      throw err
    }
  },

  async getExtOutgoingAuthor (root, { id }) {
    try {
      const extOutgoing = await Docs.ExtOutgoing.findByPk(id)
      return await extOutgoing.getAuthor()
    } catch (err) {
      throw err
    }
  },

  async getExtOutgoingOrganisations (root, { id }) {
    try {
      const extOutgoing = await Docs.ExtOutgoing.findByPk(id)
      const extEmployees = await extOutgoing.getExtEmployees()
      const orgs = []
      let i = 0
      for (const extEmployee of extEmployees) {
        orgs[i++] = await extEmployee.getOrganisation()
      }
      return orgs
    } catch (err) {
      throw err
    }
  },

  async getExtOutgoingDepartment (root, { id }) {
    try {
      const extOutgoing = await Docs.ExtOutgoing.findByPk(id)
      const author = await extOutgoing.getAuthor()
      // const positions = await author.getCurrentPositions()
      // const deps = []
      // for (const item of positions) {
      //   const dep = await item.getDepartment()
      //   if (dep) {
      //     deps.push(dep)
      //   }
      // }
      return await author.getDepartment()
    } catch (err) {
      throw err
    }
  },

  async getExtOutgoingFiles (root, { id }) {
    try {
      const extOutgoing = await Docs.ExtOutgoing.findByPk(id)
      return await extOutgoing.getExtOutFiles()
    } catch (err) {
      throw err
    }
  },

  async getExtOutgoingAnswers (root, { id }) {
    try {
      const extOutgoing = await Docs.ExtOutgoing.findByPk(id)
      return await extOutgoing.getAnswer()
    } catch (err) {
      throw err
    }
  },

  async setNextStateExtOutgoing (root, request) {
    const output = await nextState(request)
    return output
  },

  async setPreviousStateExtOutgoing (root, request) {
    const output = await prevState(request)
    return output
  },

  async setStateExtOutgoing (root, { id, stateId }) {
    try {
      const extOutgoing = await Docs.ExtOutgoing.findByPk(id)
      if (!extOutgoing) {
        return {
          type: 'setStateExtOutgoing',
          text: 'Исходящего документа с таким id не существует',
          messageType: 'error'
        }
      }
      if (stateId) {
        const state = await Docs.State.findByPk(stateId)
        if (!state) {
          return {
            type: 'setStateExtOutgoing',
            text: 'Состояния с таким id не существует',
            messageType: 'error'
          }
        }
        await extOutgoing.setState(stateId)
      } else {
        await extOutgoing.setState(null)
      }
      return {
        type: 'setStateExtOutgoing',
        text: 'Состояние успешно изменено',
        messageType: 'success',
        id
      }
    } catch (err) {
      const message = {
        type: 'setStateExtOutgoing',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getExtOutgoingRequest (root, request) {
    const key = request.id
    const existedData = memoizedExtOutgoingReq.get(key)
    console.log('Cache size: ', (memoizedExtOutgoingReq.calcRAM() / 1024) / 1024 + ' MB')
    if (existedData) {
      return existedData
    }
    const output = await memoizedExtOutgoingReq(key, request)
    console.log('Cache size: ', (memoizedExtOutgoingReq.calcRAM() / 1024) / 1024 + ' MB')
    return output
  },

  async getExtOutgoingRequestById (root, { id }) {
    try {
      console.time('Fetching getExtOutgoingRequestById')
      const output = await getExtOutgoingRequestData([id])
      const ExtOutgoingRequest = formExtOutgoingRequest(output[0].dataValues)
      console.timeEnd('Fetching getExtOutgoingRequestById')
      return ExtOutgoingRequest
    } catch (err) {
      throw err
    }
  },

  async getExtOutgoingRequestByIds (root, { ids }) {
    try {
      console.time('Fetching getExtOutgoingRequestByIds')
      const output = await getExtOutgoingRequestData(ids)
      const ExtOutgoingRequest = []
      for (let i = 0; i < output.length; i++) {
        ExtOutgoingRequest[i] = formExtOutgoingRequest(output[i].dataValues)
      }
      console.timeEnd('Fetching getExtOutgoingRequestByIds')
      return ExtOutgoingRequest
    } catch (err) {
      throw err
    }
  },

  async updateExtOutgoingRequest (root, { id, time }) {
    try {
      console.time('updateExtOutgoingRequest')
      const ExtOutgoingRequest = []
      const lastUpdate = moment(+time).toISOString()
      const ids = await Docs.ExtOutgoing.findAll({
        attributes: ['id', 'updatedAt'],
        where: { updatedAt: { [Op.gte]: lastUpdate } },
        include: [
          // Автор
          {
            model: Docs.CurrentPosition,
            as: 'author',
            where: {
              DepartmentId: id
            }
          }
        ]
      })
      const fetchedIds = Object.values(JSON.parse(JSON.stringify(ids, null, 2))).reduce((acc, item, index) => { acc[index] = item.id; return acc }, [])
      const output = await getExtOutgoingRequestData(fetchedIds)
      for (let i = 0; i < output.length; i++) {
        const item = output[i].dataValues
        ExtOutgoingRequest[i] = formExtOutgoingRequest(item, id)
      }
      console.timeEnd('updateExtOutgoingRequest')
      return ExtOutgoingRequest
    } catch (error) {
      throw error
    }
  }
}
