/* eslint-disable no-useless-escape */
const _ = require('lodash')
const moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const { memoize } = require('../../../memo')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()
const intIncoming1 = require('./int-incoming')
const intOutFile1 = require('./int-out-file')
const intIncFile1 = require('./int-inc-file')

moment.locale('ru')

function formIntOutgoingRequest (item) {
  const curAdsress = []
  const curAdsressId = []
  const curTemas = []
  const curTemasId = []
  const curFiles = []
  const curFilesId = []
  const curAnswers = []
  const curAnswersId = []
  const curPodp = []
  const curPodpId = []
  item.addressee.forEach((addr) => {
    curAdsressId.push(addr.id)
    const name = addr.Employee.secondName + ' ' + addr.Employee.firstName[0] + '.' + addr.Employee.middleName[0] + '.'
    curAdsress.push(`${name} ${addr.Position.posName} (${addr.Department.shortName})`)
  })
  item.Temas.forEach((tema) => {
    curTemas.push(tema.name)
    curTemasId.push(tema.id)
  })
  item.podpisant.forEach((podp) => {
    const name = `${podp.Employee ? podp.Employee.secondName : ''} ${podp.Employee ? podp.Employee.firstName[0] : ''}.${podp.Employee ? podp.Employee.middleName[0] : ''}.`
    curPodp.push(`${name} ${podp.Position ? podp.Position.posName : ''} (${podp.Department ? podp.Department.shortName : ''})`)
    curPodpId.push(podp.id)
  })
  item.IntOutFiles.forEach((file) => {
    curFilesId.push(file.id)
    curFiles.push(file.file)
  })
  item.answer.forEach((el) => {
    curAnswersId.push(el.id)
    const date = moment(el.extDate).format('L')
    curAnswers.push(`№${el.extNumberPrefix}${el.extNumber} от ${date}`)
  })
  return {
    id: item.id,
    outNumber: item.prefix + item.outNumber,
    prefix: item.prefix,
    outNumberDigit: item.outNumber || null,
    outDate: moment(item.outDate),
    subject: item.subject,
    author: item.author ? item.author.Employee.secondName + ' ' + item.author.Employee.firstName[0] + '.' + item.author.Employee.middleName[0] + '.' : null,
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
    department: item.author ? item.author.Department.shortName : '',
    departmentId: item.author ? item.author.Department.id : null,
    files: curFiles,
    filesId: curFilesId,
    isAnswerOn: curAnswers.length ? curAnswers : null,
    isAnswerOnId: curAnswersId,
    updatedAt: item.updatedAt
  }
}

async function getIntOutgoingRequestData (idArr) {
  const output = await Docs.IntOutgoing.findAll({
    attributes: [
      'id',
      'outNumber',
      'prefix',
      'outDate',
      'subject',
      'note',
      'updatedAt'
    ],
    where: {
      id: { [Op.in]: idArr }
    },
    // order: [
    //   ['outDate', 'DESC']
    // ],
    // limit,
    // offset,
    // subQuery: false,
    include: [
      // Исполнитель
      {
        model: Docs.CurrentPosition,
        as: 'author',
        attributes: [
          'id'
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
      // Адресаты
      {
        model: Docs.CurrentPosition,
        as: 'addressee',
        attributes: [
          'id'
        ],
        include: [
          // Служащий
          {
            model: Docs.Employee,
            attributes: [
              'id',
              'firstName',
              'secondNameDat',
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
          },
          // Должность
          {
            model: Docs.Position,
            attributes: [
              'id',
              'posName',
              'posNameDat'
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
        model: Docs.IntOutFile,
        attributes: [
          'id',
          'file'
        ]
      },
      // Ответ на
      {
        model: Docs.IntIncoming,
        as: 'answer',
        attributes: [
          'id',
          'extNumber',
          'extNumberPrefix',
          'extDate'
        ],
        through: {
          attributes: []
        }
      }
    ]
    // logging: console.log
  })
  return output
}

async function addIntOut ({
  intOutgoing: {
    outNumber,
    outDate,
    prefix,
    subject,
    author,
    TypeId,
    StateId
  }, addresseeId, temaId, podpisantId, answerId, fileId
}) {
  try {
    console.time('addIntOutgoing')
    const iSubject = _.trim(_.replace(subject, /[\[\]&{}<>#$%^*!@+\/`~]+/g, ''))
    const iPrefix = _.trim(_.replace(prefix, /[\[\]&{}<>#$%^*!@+`'"+~]+/g, ''))
    // Определение отдела, из которого отправляется документ по отделу исполнителя
    const ispoln = await Docs.CurrentPosition.findOne({
      where: {
        id: author
      },
      attributes: ['DepartmentId']
    }) || {}
    // номер отдела
    const depId = JSON.parse(JSON.stringify(ispoln, null, 2)).DepartmentId
    // определение есть ли документ с таким исходящим в отделе
    const candidate = await Docs.IntOutgoing.findOne({
      where: {
        outNumber,
        outDate
      },
      attributes: ['id'],
      include: [
        {
          model: Docs.CurrentPosition,
          as: 'author',
          where: {
            DepartmentId: depId
          },
          attributes: ['id']
        }
      ]
    })
    if (candidate) {
      const message = {
        type: 'addIntOutgoing',
        text: 'Такой исходящий документ уже существует',
        messageType: 'error'
      }
      return message
    } else {
      const intOutgoing = await Docs.IntOutgoing.create({
        outNumber,
        outDate,
        prefix: iPrefix,
        subject: iSubject,
        TypeId,
        StateId
      })
      const message = {
        type: 'addIntOutgoing',
        text: '',
        messageType: 'success',
        id: intOutgoing.id,
        item: JSON.stringify({
          intOutgoing: {
            outNumber,
            outDate,
            prefix,
            subject,
            author,
            TypeId,
            StateId,
            addresseeId,
            temaId,
            podpisantId,
            answerId,
            fileId
          }
        })
      }
      await Promise.all([
        author ? intOutgoing.setAuthor(author) : null,
        addresseeId ? intOutgoing.setAddressee(addresseeId) : null,
        temaId ? intOutgoing.setTemas(temaId) : null,
        podpisantId ? intOutgoing.setPodpisant(podpisantId) : null,
        answerId ? intOutgoing.setAnswer(answerId) : null,
        fileId ? intOutgoing.setIntOutFiles(fileId) : null
      ])
      message.text = 'Исходящий документ успешно добавлен'
      console.timeEnd('addIntOutgoing')
      return message
    }
  } catch (err) {
    const message = {
      type: 'addIntOutgoing',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function editIntOut ({
  id, intOutgoing: {
    outNumber,
    outDate,
    prefix,
    subject,
    author,
    TypeId,
    StateId
  }, addresseeId, temaId, podpisantId, answerId, fileId
}) {
  try {
    const iSubject = _.trim(_.replace(subject, /[\[\]\&\{\}\<\>\#\$\%\^\*\!\@\+\/\`\~]+/g, ''))
    const iPrefix = _.trim(_.replace(prefix, /[\[\]&{}<>#$%^*!@+`'"+~]+/g, ''))
    const candidate = await Docs.IntOutgoing.findByPk(id)
    if (!candidate) {
      const message = {
        type: 'editIntOutgoing',
        text: 'Исходящего документа с таким id не существует',
        messageType: 'error'
      }
      return message
    } else {
      candidate.outNumber = outNumber
      candidate.outDate = outDate
      candidate.prefix = iPrefix
      candidate.subject = iSubject
      candidate.TypeId = TypeId
      candidate.StateId = StateId
      await candidate.save()
      const message = {
        type: 'editIntOutgoing',
        text: '',
        messageType: 'success',
        id,
        item: JSON.stringify({
          intOutgoing: {
            outNumber,
            outDate,
            prefix,
            subject,
            author,
            TypeId,
            StateId,
            addresseeId,
            temaId,
            podpisantId,
            answerId,
            fileId
          }
        })
      }
      if (author) {
        await candidate.setAuthor(author)
      }
      if (addresseeId) {
        await candidate.setAddressee(addresseeId)
      }
      if (temaId) {
        await candidate.setTemas(temaId)
      }
      if (podpisantId) {
        await candidate.setPodpisant(podpisantId)
      }
      if (answerId) {
        await candidate.setAnswer(answerId)
      }
      if (fileId) {
        await candidate.setIntOutFiles(fileId)
      }
      message.text = 'Данные исходящего документа успешно изменены'
      return message
    }
  } catch (err) {
    const message = {
      type: 'editIntOutgoing',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function nextState ({ id }) {
  try {
    const intOutgoing = await Docs.IntOutgoing.findByPk(id)
    const nextState = await Docs.State.findOne({ where: { parentStateId: intOutgoing.StateId } })
    if (nextState) {
      intOutgoing.StateId = nextState.id
      await intOutgoing.save()
      const message = {
        type: 'setNextStateIntOutgoing',
        text: 'Состояние успешно изменено',
        messageType: 'success',
        id
      }
      return message
    } else {
      const message = {
        type: 'setNextStateIntOutgoing',
        text: 'Следующее состояние отсутствует',
        messageType: 'error'
      }
      return message
    }
  } catch (err) {
    const message = {
      type: 'setNextStateIntOutgoing',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function prevState ({ id }) {
  try {
    const intOutgoing = await Docs.IntOutgoing.findByPk(id)
    const state = await Docs.State.findByPk(intOutgoing.StateId)
    const previousState = await Docs.State.findByPk(state.parentStateId)
    if (previousState) {
      intOutgoing.StateId = previousState.id
      await intOutgoing.save()
      const message = {
        type: 'setPreviousStateIntOutgoing',
        text: 'Состояние успешно изменено',
        messageType: 'success',
        id
      }
      return message
    } else {
      const message = {
        type: 'setPreviousStateIntOutgoing',
        text: 'Предшествующее состояние отсутствует',
        messageType: 'error'
      }
      return message
    }
  } catch (err) {
    const message = {
      type: 'setPreviousStateIntOutgoing',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function setState ({ id, stateId }) {
  try {
    const intOutgoing = await Docs.IntOutgoing.findByPk(id)
    const state = await Docs.State.findByPk(stateId)
    if (!intOutgoing) {
      const message = {
        type: 'setStateIntOutgoing',
        text: `Ошибка: внутренний документ с id = ${id} не найден`,
        messageType: 'error'
      }
      return message
    }
    if (!state) {
      const message = {
        type: 'setStateIntOutgoing',
        text: `Ошибка: состояние с id = ${stateId} не найдено`,
        messageType: 'error'
      }
      return message
    }
    await intOutgoing.setState(state)
    const message = {
      type: 'setStateIntOutgoing',
      text: 'Состояние успешно изменено',
      messageType: 'success',
      id
    }
    return message
  } catch (err) {
    const message = {
      type: 'setStateIntOutgoing',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function addNote ({ id, note }) {
  try {
    const intOut = await Docs.IntOutgoing.findByPk(id)
    if (!intOut) {
      const message = {
        type: 'addNoteToIntOutgoing',
        text: 'Исходящего документа с таким id не существует',
        messageType: 'error'
      }
      return message
    } else {
      intOut.note = note
      await intOut.save()
      const message = {
        type: 'addNoteToIntOutgoing',
        text: 'Примечание успешно добавлено',
        messageType: 'success',
        id
      }
      return message
    }
  } catch (err) {
    const message = {
      type: 'addNoteToIntOutgoing',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function getRequest (key, { id }) {
  try {
    console.time('Fetching IntOutgoings')
    const IntOutgoingRequests = []
    const ids = await Docs.IntOutgoing.findAll({
      attributes: [
        'id'
      ],
      include: [
        {
          model: Docs.CurrentPosition,
          as: 'author',
          where: {
            DepartmentId: id
          },
          attributes: [
            'id'
          ]
        }
      ]
    })
    const fetchedIds = Object.values(JSON.parse(JSON.stringify(ids, null, 2))).reduce((acc, item, index) => { acc[index] = item.id; return acc }, [])
    const output = await getIntOutgoingRequestData(fetchedIds)
    // console.time('Form array')
    for (let i = 0; i < output.length; i++) {
      const item = output[i].dataValues
      IntOutgoingRequests[i] = formIntOutgoingRequest(item)
    }
    // console.timeEnd('Form array')
    console.timeEnd('Fetching IntOutgoings')
    return IntOutgoingRequests
  } catch (err) {
    throw err
  }
}

const memoizedIntOutgoingReq = memoize(getRequest)
memoizedIntOutgoingReq.maxSize = 10
memoizedIntOutgoingReq.size = 0
memoizedIntOutgoingReq.on('add', (key, err, data) => {
  if (memoizedIntOutgoingReq.size <= memoizedIntOutgoingReq.maxSize) {
    memoizedIntOutgoingReq.size++
  } else {
    memoizedIntOutgoingReq.cache.clear()
    memoizedIntOutgoingReq.size = 1
  }
})
memoizedIntOutgoingReq.on('del', (key) => {
  if (memoizedIntOutgoingReq.cache.has(key)) {
    memoizedIntOutgoingReq.size--
  }
})
memoizedIntOutgoingReq.on('clear', () => {
  memoizedIntOutgoingReq.size = 0
})

const deleteIntOutReqMemo = (id) => {
  const existedReq = memoizedIntOutgoingReq.get(id)
  if (existedReq) {
    memoizedIntOutgoingReq.del(id)
  }
}
const resetIntOutReqMemo = () => {
  memoizedIntOutgoingReq.clear()
}

module.exports = {
  memoizedIntOutgoingReq,
  deleteIntOutReqMemo,
  resetIntOutReqMemo,
  async addIntOutgoing (root, request) {
    const output = await addIntOut(request)
    return output
  },

  async sendIntOutgoing (root, { id }) {
    try {
      console.time('sendIntOutgoing')
      const intOutgoing = await Docs.IntOutgoing.findByPk(id)
      const files = await intOutgoing.getIntOutFiles()
      const temas = await intOutgoing.getTemas()
      const podpisants = await intOutgoing.getPodpisant()
      const author = await intOutgoing.getAuthor()
      const addressees = await intOutgoing.getAddressee()
      const temaId = temas.reduce((acc, item) => [...acc, item.id], [])
      const podpisantId = podpisants.reduce((acc, item) => [...acc, item.id], [])
      const addresseeId = addressees.reduce((acc, item) => [...acc, item.id], [])
      const filesId = files.reduce((acc, item) => [...acc, item.id], [])
      const request = {
        intIncoming: {
          subject: intOutgoing.subject,
          extNumber: intOutgoing.outNumber,
          extNumberPrefix: intOutgoing.prefix,
          extDate: intOutgoing.outDate,
          needAnswer: false,
          TypeId: intOutgoing.TypeId
        },
        temaId,
        podpisantId,
        authorId: author.id,
        addresseeId
      }
      const mes = await intIncoming1.addIntIncoming(null, request)
      if (mes.messageType === 'success') {
        console.log('Перепрекрепление файлов')
        const filemes = await intIncFile1.attachIntOutFilesToIntInc(null, { fileIds: filesId, intIncId: mes.id })
        console.log('Перепрекрепление файлов завершено')
        console.log(filemes)
      }
      console.timeEnd('sendIntOutgoing')
      const message = {
        type: 'sendIntOutgoing',
        text: 'Исходящий документ успешно отправлен',
        messageType: 'success',
        id
      }
      const newIntInc = await Docs.IntIncoming.findByPk(mes.id)
      await newIntInc.setSource(id)
      return message
    } catch (err) {
      const message = {
        type: 'sendIntOutgoing',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editIntOutgoing (root, request) {
    const output = await editIntOut(request)
    return output
  },

  async publicateIntOutgoing (root, { id, publicateData }) {
    try {
      let doc, type
      const message = {
        type: 'publicateIntOutgoing',
        messageType: 'success'
      }
      if (id) {
        // Редактирование
        type = 'edit'
        message.text = 'Поиск документа: '
        doc = await Docs.IntOutgoing.findByPk(id)
        if (doc) {
          message.text += 'документ успешно найден.\n'
          const request = {
            id,
            intOutgoing: {
              outNumber: publicateData.IntOutgoing.outNumber,
              outDate: publicateData.IntOutgoing.outDate,
              prefix: publicateData.IntOutgoing.prefix,
              subject: publicateData.IntOutgoing.subject,
              author: publicateData.IntOutgoing.authorId,
              TypeId: publicateData.IntOutgoing.TypeId,
              StateId: publicateData.IntOutgoing.StateId
            },
            addresseeId: publicateData.IntOutgoing.addresseeId,
            temaId: publicateData.IntOutgoing.temaId,
            podpisantId: publicateData.IntOutgoing.podpisantId,
            answerId: publicateData.IntOutgoing.answerId
          }
          message.text = 'Редактирование документа: '
          const editMess = await editIntOut(request)
          message.text += editMess.text + '\n'
          if (editMess.messageType === 'success') {
            doc = await Docs.IntOutgoing.findByPk(id)
          } else {
            message.messageType = editMess.messageType
            return message
          }
        } else {
          message.text += `Внутренний исходящий документ с id: ${id} отсутствует в базе`
          message.messageType = 'error'
          return message
        }
      } else {
        // Создание вновь
        type = 'add'
        const request = {
          intOutgoing: {
            outNumber: publicateData.IntOutgoing.outNumber,
            outDate: publicateData.IntOutgoing.outDate,
            prefix: publicateData.IntOutgoing.prefix,
            subject: publicateData.IntOutgoing.subject,
            author: publicateData.IntOutgoing.authorId,
            TypeId: publicateData.IntOutgoing.TypeId,
            StateId: publicateData.IntOutgoing.StateId
          },
          addresseeId: publicateData.IntOutgoing.addresseeId,
          temaId: publicateData.IntOutgoing.temaId,
          podpisantId: publicateData.IntOutgoing.podpisantId,
          answerId: publicateData.IntOutgoing.answerId
        }
        message.text = 'Создание документа: '
        const addMess = await addIntOut(request)
        message.text += addMess.text + '\n'
        if (addMess.messageType === 'success') {
          doc = await Docs.IntOutgoing.findByPk(addMess.id)
        } else {
          message.messageType = addMess.messageType
          return message
        }
      }
      const author = await doc.getAuthor()
      const depId = author.DepartmentId
      deleteIntOutReqMemo(depId)
      message.id = doc.id
      // Добавление примечания
      message.text += 'Добавление примечания: '
      if (publicateData.IntOutgoing.note) {
        try {
          if (doc.note !== publicateData.IntOutgoing.note) {
            doc.note = publicateData.IntOutgoing.note
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
      if (publicateData.IntOutgoing.filesId) {
        const fileMess = await intOutFile1.attachFilesToIntOut(null, {
          fileIds: publicateData.IntOutgoing.filesId,
          intOutId: doc.id
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
      if (publicateData.IntOutgoing.stateChanged) {
        const n = publicateData.IntOutgoing.stateChanged
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
      const rawData = await getIntOutgoingRequestData([doc.id])
      const output = formIntOutgoingRequest(rawData[0].dataValues)
      const files = await doc.getIntOutFiles()
      const item = {
        IntOutgoing: output,
        IntOutFiles: files
      }
      if (output) {
        pubsub.publish('INT_OUTGOING_CHANGED', {
          intOutgoingChanged: {
            type,
            id: doc.id,
            item
          }
        })
        message.text += 'Внешний исходящий документ успешно разослан'
        message.id = doc.id
        message.item = JSON.stringify(output)
        return message
      } else {
        message.text += `Не удалось сформировать внешний исходящий документ с id: ${doc.id}`
        message.messageType = 'error'
        return message
      }
    } catch (err) {
      const message = {
        type: 'publicateIntOutgoing',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async addNoteToIntOutgoing (root, request) {
    const output = await addNote(request)
    return output
  },

  async deleteIntOutgoing (root, { id }) {
    try {
      const candidate = await Docs.IntOutgoing.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'deleteIntOutgoing',
          text: `Ошибка: внутренний документ с id = ${id} не найден`,
          messageType: 'error'
        }
        return message
      }
      resetIntOutReqMemo()
      const files = await candidate.getIntOutFiles() || {}
      if (files.length) {
        for (const file of files) {
          await intOutFile1.deleteIntOutFile(null, { id: file.id })
        }
      }
      await candidate.destroy()
      const message = {
        type: 'deleteIntOutgoing',
        text: 'Исходящий документ успешно удалён',
        messageType: 'success',
        id
      }
      pubsub.publish('INT_OUTGOING_CHANGED', {
        intOutgoingChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteIntOutgoing',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllIntOutgoing () {
    try {
      return await Docs.IntOutgoing.findAll()
    } catch (err) {
      throw err
    }
  },

  async getAllIntOutgoingInDepartment (root, { id }) {
    try {
      const department = await Docs.Department.findByPk(id)
      const authors = await department.getCurrentPositions()
      const docs = []
      for (const author of authors) {
        const items = await author.getIntOutgoings() || []
        if (items.length) {
          for (const item of items) {
            docs.push(item)
          }
        }
      }
      return docs
    } catch (err) {
      throw err
    }
  },

  async getIntOutgoing (root, { id }) {
    try {
      return await Docs.IntOutgoing.findByPk(id)
    } catch (err) {
      throw err
    }
  },

  async getIntOutgoingType (root, { id }) {
    try {
      const intOutgoing = await Docs.IntOutgoing.findByPk(id)
      return await intOutgoing.getType()
    } catch (err) {
      throw err
    }
  },

  async getIntOutgoingState (root, { id }) {
    try {
      const intOutgoing = await Docs.IntOutgoing.findByPk(id)
      return await intOutgoing.getState()
    } catch (err) {
      throw err
    }
  },

  async getIntOutgoingToDepartments (root, { id }) {
    try {
      const intOutgoing = await Docs.IntOutgoing.findByPk(id)
      return await intOutgoing.getDepartments()
    } catch (err) {
      throw err
    }
  },

  async getIntOutgoingTemas (root, { id }) {
    try {
      const intOutgoing = await Docs.IntOutgoing.findByPk(id)
      return await intOutgoing.getTemas()
    } catch (err) {
      throw err
    }
  },

  async getIntOutgoingAuthor (root, { id }) {
    try {
      const intOutgoing = await Docs.IntOutgoing.findByPk(id)
      return await intOutgoing.getAuthor()
    } catch (err) {
      throw err
    }
  },

  async getIntOutgoingDepartment (root, { id }) {
    try {
      const intOutgoing = await Docs.IntOutgoing.findByPk(id)
      const author = await Docs.Employee.findByPk(intOutgoing.author)
      return await author.getDepartment()
    } catch (err) {
      throw err
    }
  },

  async getIntOutgoingFiles (root, { id }) {
    try {
      const intOutgoing = await Docs.IntOutgoing.findByPk(id)
      return await intOutgoing.getIntOutFiles()
    } catch (err) {
      throw err
    }
  },

  async getIntOutgoingPodpisants (root, { id }) {
    try {
      const intOutgoing = await Docs.IntOutgoing.findByPk(id)
      return await intOutgoing.getPodpisant()
    } catch (err) {
      throw err
    }
  },

  async getIntOutgoingAnswers (root, { id }) {
    try {
      const intOutgoing = await Docs.IntOutgoing.findByPk(id)
      return await intOutgoing.getAnswer()
    } catch (err) {
      throw err
    }
  },

  async getIntOutgoingIncomings (root, { id }) {
    try {
      const intOutgoing = await Docs.IntOutgoing.findByPk(id)
      return await intOutgoing.getIntIncomings()
    } catch (err) {
      throw err
    }
  },

  async setNextStateIntOutgoing (root, request) {
    const output = await nextState(request)
    return output
  },

  async setPreviousStateIntOutgoing (root, request) {
    const output = await prevState(request)
    return output
  },

  async setStateIntOutgoing (root, request) {
    const output = await setState(request)
    return output
  },

  async getIntOutgoingRequest (root, request) {
    const key = request.id
    const existedData = memoizedIntOutgoingReq.get(key)
    console.log('Cache size: ', (memoizedIntOutgoingReq.calcRAM() / 1024) / 1024 + ' MB')
    if (existedData) {
      return existedData
    }
    const output = await memoizedIntOutgoingReq(key, request)
    console.log('Cache size: ', (memoizedIntOutgoingReq.calcRAM() / 1024) / 1024 + ' MB')
    return output
  },

  async getIntOutgoingRequestById (root, { id }) {
    try {
      console.time('Fetching getIntOutgoingRequestById')
      const output = await getIntOutgoingRequestData([id])
      const IntOutgoingRequest = formIntOutgoingRequest(output[0].dataValues)
      console.timeEnd('Fetching getIntOutgoingRequestById')
      return IntOutgoingRequest
    } catch (err) {
      throw err
    }
  },

  async getIntOutgoingRequestByIds (root, { ids }) {
    try {
      console.time('Fetching getIntOutgoingRequestByIds')
      const output = await getIntOutgoingRequestData(ids)
      const IntOutgoingRequest = []
      for (let i = 0; i < output.length; i++) {
        IntOutgoingRequest[i] = formIntOutgoingRequest(output[i].dataValues)
      }
      console.timeEnd('Fetching getIntOutgoingRequestByIds')
      return IntOutgoingRequest
    } catch (err) {
      throw err
    }
  },

  async updateIntOutgoingRequest (root, { id, time }) {
    try {
      console.time('updateIntOutgoingRequest')
      const IntOutgoingRequest = []
      const lastUpdate = moment(+time).toISOString()
      const ids = await Docs.IntOutgoing.findAll({
        attributes: ['id', 'updatedAt'],
        where: { updatedAt: { [Op.gte]: lastUpdate } },
        include: [
          {
            model: Docs.CurrentPosition,
            as: 'author',
            where: {
              DepartmentId: id
            },
            attributes: [
              'id'
            ]
          }
        ]
      })
      const fetchedIds = Object.values(JSON.parse(JSON.stringify(ids, null, 2))).reduce((acc, item, index) => { acc[index] = item.id; return acc }, [])
      const output = await getIntOutgoingRequestData(fetchedIds)
      for (let i = 0; i < output.length; i++) {
        const item = output[i].dataValues
        IntOutgoingRequest[i] = formIntOutgoingRequest(item, id)
      }
      console.timeEnd('updateIntOutgoingRequest')
      return IntOutgoingRequest
    } catch (error) {
      throw error
    }
  }
}
