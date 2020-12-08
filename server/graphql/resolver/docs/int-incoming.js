/* eslint-disable no-useless-escape */
const _ = require('lodash')
const moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const { memoize } = require('../../../memo')
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()
const incomingNumber = require('./int-incoming-number')
const intIncState = require('./int-inc-state')
const intIncFile1 = require('./int-inc-file')
const Resolution = require('./resolution')
const Note = require('./int-inc-note')

moment.locale('ru')

function formIntIncomingRequest (item, id) {
  const curTemas = []
  const curTemasId = []
  const podpisantsId = []
  const podpisantsName = []
  const addresseeNames = []
  const addresseeId = []
  const answersId = []
  const answers = []
  const intIncFiles = []
  const intIncFilesId = []
  const IntIncDepData = []
  const Notes = []
  item.Temas.forEach((tema) => {
    curTemas.push(tema.name)
    curTemasId.push(tema.id)
  })
  item.podpisant.forEach((podp) => {
    podpisantsId.push(podp.id)
    const name = `${podp.Employee ? podp.Employee.secondName : ''} ${podp.Employee ? podp.Employee.firstName[0] : ''}.${podp.Employee ? podp.Employee.middleName[0] : ''}.`
    podpisantsName.push(`${name} ${podp.Position ? podp.Position.posName : ''} (${podp.Department ? podp.Department.shortName : ''})`)
  })
  item.addressee.forEach((addr) => {
    const name = addr.Employee.secondName + ' ' + addr.Employee.firstName[0] + '.' + addr.Employee.middleName[0] + '.'
    addresseeNames.push(`${name} ${addr.Position.posName} (${addr.Department.shortName})`)
    addresseeId.push(addr.id)
  })
  item.IntOutgoings.forEach((ans) => {
    answersId.push(ans.id)
    const podp = ans.podpisant.length ? ans.podpisant[0] : {}
    const podpDep = podp.Department || {}
    const prefix = podp.intPrefix ? `${podpDep.depPrefix}-${podp.intPrefix}` : `${podpDep.depPrefix}`
    const date = moment(ans.outDate).format('L')
    answers.push(`Исх. от ${date} №${prefix}/${ans.outNumber}`)
  })
  let sourceOutgoing = ''
  let sourceOutgoingId = null
  if (item.source) {
    const podp = item.source.podpisant.length ? item.source.podpisant[0] : {}
    const podpDep = podp.Department || {}
    const prefix = podp.intPrefix ? `${podpDep.depPrefix}-${podp.intPrefix}` : `${podpDep.depPrefix}`
    const sourceDate = moment(item.source.outDate).format('L')
    sourceOutgoing = `Исх. от ${sourceDate} №${prefix}/${item.source.outNumber}`
    sourceOutgoingId = item.source.id
  }
  item.IntIncFiles.forEach((file) => {
    intIncFilesId.push(file.id)
    intIncFiles.push(file.file)
  })
  const resIds = item.Resolutions.reduce((acc, item, index) => { acc[index] = item.id; return acc }, [])
  const incNumber = (item.IntIncomingNumbers.length && item.addressee.length && id)
    ? item.IntIncomingNumbers.find(el => el.DepartmentId.toString() === id) || {}
    : {}
  const state = (item.IntIncStates.length && id)
    ? item.IntIncStates.find(el => el.DepartmentId.toString() === id) || {}
    : {}
  const depsArray = item.addressee.length
    ? item.addressee.filter((item, index, self) =>
      index === self.findIndex(t => (t.Department.id === item.Department.id)))
    : []
  for (let j = 0; j < depsArray.length; j++) {
    const IntIncState = item.IntIncStates.length
      ? item.IntIncStates.find(el => el.DepartmentId.toString() === depsArray[j].Department.id.toString()) || {}
      : {}
    const StateId = IntIncState.State
      ? IntIncState.State.id
      : null
    const StateName = IntIncState.State
      ? IntIncState.State.name
      : null
    const IntIncStateReq = {
      IntIncStateId: IntIncState.id,
      StateId,
      StateName
    }
    const incNum = item.IntIncomingNumbers.length
      ? item.IntIncomingNumbers.find(el => el.DepartmentId.toString() === depsArray[j].Department.id.toString()) || {}
      : {}
    const IntIncNumber = {
      IntIncNumberId: incNum.id,
      incNumberDigit: incNum.incNumber,
      incDate: moment(incNum.incDate),
      prefix: incNum.prefix
    }
    // IntIncDepData.push({
    //   DepartmentId: item.addressee[j].Department.id,
    //   state: { ...IntIncStateReq },
    //   incNumber: { ...IntIncNumber }
    // })
    const dataToAdd = { DepartmentId: item.addressee[j].Department.id }
    if (IntIncStateReq.IntIncStateId) {
      dataToAdd.state = { ...IntIncStateReq }
    }
    if (IntIncNumber.IntIncNumberId) {
      dataToAdd.incNumber = { ...IntIncNumber }
    }
    IntIncDepData.push(dataToAdd)
  }
  item.IntIncNotes.forEach((el) => {
    Notes.push({
      id: el.id,
      DepartmentId: el.DepartmentId,
      text: el.text
    })
  })
  return {
    id: item.id,
    subject: item.subject,
    extNumber: item.extNumber, // item.author.length ? item.author[0].Department.depPrefix + '/' + item.extNumber : item.extNumber,
    extDate: moment(item.extDate),
    extNumberPrefix: item.extNumberPrefix,
    needAnswer: item.needAnswer,
    type: item.Type ? item.Type.name : null,
    typeId: item.Type ? item.Type.id : null,
    state: state.State ? state.State.name : null,
    stateId: state.State ? state.State.id : null,
    incNumber: (incNumber.incNumber)
      ? incNumber.prefix + incNumber.incNumber
      : null,
    incNumberDigit: incNumber.incNumber || null,
    incDate: incNumber.incDate ? moment(incNumber.incDate) : null,
    incNumberId: incNumber.id || null,
    IntIncDepData,
    temas: curTemas.join('\n'),
    temasId: curTemasId,
    author: item.author.length ? item.author[0].Employee.secondName + ' ' + item.author[0].Employee.firstName[0] + '.' + item.author[0].Employee.middleName[0] + '.' : '',
    authorId: item.author.length ? item.author[0].id : null,
    podpisants: podpisantsName.length ? podpisantsName.join('\n') : '',
    podpisantsId,
    addressee: addresseeNames.join('\n'),
    addresseeId,
    answers,
    answersId,
    sourceOutgoing,
    sourceOutgoingId,
    resolutions: resIds,
    notes: Notes,
    Files: intIncFiles.join('\n'),
    FilesId: intIncFilesId,
    updatedAt: item.updatedAt
  }
}

async function getIntIncomingRequestData (idArr) {
  const output = await Docs.IntIncoming.findAll({
    attributes: [
      'id',
      'subject',
      'extNumber',
      'extNumberPrefix',
      'extDate',
      'needAnswer',
      'updatedAt'
    ],
    where: {
      id: { [Op.in]: idArr }
    },
    include: [
      // Служащие кому направлено
      {
        model: Docs.CurrentPosition,
        as: 'addressee',
        attributes: [
          'id',
          'intPrefix'
        ],
        required: true,
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
      // Резолюции
      {
        model: Docs.Resolution,
        required: false,
        attributes: [
          'id'
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
      // Состояние документа в отделах
      {
        model: Docs.IntIncState,
        attributes: [
          'id',
          'DepartmentId'
        ],
        include: [
          {
            model: Docs.State,
            attributes: [
              'id',
              'name'
            ]
          }
        ]
      },
      // Темы
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
              'shortName',
              'depPrefix'
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
      // Является ответом на
      {
        model: Docs.IntOutgoing,
        attributes: [
          'id',
          'outNumber',
          'outDate'
        ],
        through: {
          attributes: []
        },
        include: [
          {
            model: Docs.CurrentPosition,
            as: 'podpisant',
            attributes: [
              'id'
            ],
            include: [
              {
                model: Docs.Department,
                attributes: [
                  'id',
                  'depPrefix'
                ]
              }
            ]
          }
        ]
      },
      // Исходник
      {
        model: Docs.IntOutgoing,
        as: 'source',
        attributes: [
          'id',
          'outNumber',
          'outDate'
        ],
        include: [
          {
            model: Docs.CurrentPosition,
            as: 'podpisant',
            attributes: [
              'id'
            ],
            include: [
              {
                model: Docs.Department,
                attributes: [
                  'id',
                  'depPrefix'
                ]
              }
            ]
          }
        ]
      },
      // Файлы
      {
        model: Docs.IntIncFile,
        attributes: [
          'id',
          'file'
        ]
      },
      // Примечания
      {
        model: Docs.IntIncNote,
        attributes: [
          'id',
          'text',
          'DepartmentId'
        ]
      },
      // Входящие номера отделов
      {
        model: Docs.IntIncomingNumber,
        attributes: [
          'id',
          'incNumber',
          'prefix',
          'incDate',
          'DepartmentId'
        ]
      }
    ]
    // raw: true
  })
  return output
}

async function addIntInc ({
  intIncoming: {
    subject,
    extNumber,
    extNumberPrefix,
    extDate,
    needAnswer,
    TypeId
  }, resId, temaId, podpisantId, authorId, addresseeId, fileId
}) {
  try {
    const iSubject = _.trim(_.replace(subject, /[\[\]&{}<>#$%^*!@+\/`~]+/g, ''))
    const iExtNumberPrefix = _.trim(_.replace(extNumberPrefix, /[\[\]&{}<>#$%^*!@+`~]+/g, ''))
    // Определение отдела, из которого отправляется документ по отделу исполнителя
    // const ispoln = await Docs.CurrentPosition.findOne({
    //   where: {
    //     id: authorId
    //   },
    //   attributes: ['DepartmentId']
    // }) || {}
    // Номер отдела исполнителя
    // const depId = JSON.parse(JSON.stringify(ispoln, null, 2)).DepartmentId
    // определение есть ли документ с таким исходящим в отделе
    const candidate = await Docs.IntIncoming.findOne({
      where: {
        extNumber,
        extNumberPrefix,
        extDate
      },
      attributes: ['id']
      // include: [
      //   {
      //     model: Docs.CurrentPosition,
      //     as: 'author',
      //     where: {
      //       DepartmentId: depId
      //     },
      //     attributes: ['id']
      //   }
      // ]
    })
    if (candidate) {
      const message = {
        type: 'addIntIncoming',
        text: 'Такой входящий документ уже существует',
        messageType: 'error'
      }
      return message
    } else {
      const intIncoming = await Docs.IntIncoming.create({
        subject: iSubject,
        extNumber,
        extNumberPrefix: iExtNumberPrefix,
        extDate,
        needAnswer,
        TypeId
      })
      const message = {
        type: 'addIntIncoming',
        text: '',
        messageType: 'success',
        id: intIncoming.id,
        item: JSON.stringify({
          intIncoming:
          {
            subject,
            extNumber,
            extNumberPrefix,
            extDate,
            needAnswer,
            TypeId,
            resId,
            temaId,
            podpisantId,
            authorId,
            addresseeId,
            fileId
          }
        })
      }
      if (resId) {
        for (const res of resId) {
          const resItem = await Docs.Resolution.findByPk(res)
          if (resItem.IntIncomingId) {
            message.text += `Резолюция с id = ${res} уже назначена для входящего с id ${resItem.IntIncomingId} \n\r`
            message.messageType = 'error'
          }
        }
        if (message.messageType === 'error') {
          return message
        } else {
          await intIncoming.setResolutions(resId)
        }
      }
      if (temaId) {
        await intIncoming.setTemas(temaId)
      }
      if (podpisantId) {
        await intIncoming.setPodpisant(podpisantId)
      }
      if (authorId) {
        await intIncoming.setAuthor(authorId)
      }
      if (addresseeId) {
        await intIncoming.setAddressee(addresseeId)
      }
      if (fileId) {
        await intIncoming.setIntIncFiles(fileId)
      }
      message.text = 'Входящий документ успешно добавлен'
      return message
    }
  } catch (err) {
    const message = {
      type: 'addIntIncoming',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function editIntInc ({
  id, intIncoming: {
    subject,
    extNumber,
    extNumberPrefix,
    extDate,
    needAnswer,
    TypeId
  }, resId, temaId, podpisantId, authorId, addresseeId, fileId
}) {
  try {
    const iSubject = _.trim(_.replace(subject, /[\[\]&{}<>#$%^*!@+\/`~]+/g, ''))
    const iExtNumberPrefix = _.trim(_.replace(extNumberPrefix, /[\[\]&{}<>#$%^*!@+`~]+/g, ''))
    const candidate = await Docs.IntIncoming.findByPk(id)
    if (!candidate) {
      const message = {
        type: 'editIntIncoming',
        text: 'Входящего документа с таким id не существует',
        messageType: 'error'
      }
      return message
    } else {
      candidate.subject = iSubject
      candidate.extNumber = extNumber
      candidate.extNumberPrefix = iExtNumberPrefix
      candidate.extDate = extDate
      candidate.needAnswer = needAnswer
      candidate.TypeId = TypeId
      await candidate.save()
      const message = {
        type: 'editIntIncoming',
        text: '',
        messageType: 'success',
        id,
        item: JSON.stringify({
          intIncoming:
          {
            subject,
            extNumber,
            extNumberPrefix,
            extDate,
            needAnswer,
            TypeId,
            resId,
            temaId,
            podpisantId,
            authorId,
            addresseeId,
            fileId
          }
        })
      }
      if (resId) {
        for (const res of resId) {
          const resItem = await Docs.Resolution.findByPk(res)
          if (resItem.IntIncomingId) {
            message.text += `Резолюция с id = ${res} уже назначена для входящего с id ${resItem.IntIncomingId} \n\r`
            message.messageType = 'error'
          }
        }
        if (message.messageType === 'error') {
          return message
        } else {
          await candidate.setResolutions(resId)
        }
      }
      if (temaId) {
        await candidate.setTemas(temaId)
      }
      if (podpisantId) {
        await candidate.setPodpisant(podpisantId)
      }
      if (authorId) {
        await candidate.setAuthor(authorId)
      }
      if (addresseeId) {
        await candidate.setAddressee(addresseeId)
      }
      if (fileId) {
        await candidate.setIntIncFiles(fileId)
      }
      message.text = 'Данные входящего документа успешно изменены'
      return message
    }
  } catch (err) {
    const message = {
      type: 'editIntIncoming',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function nextState ({ id, depsId }) {
  try {
    // const intIncStates = await intIncState.getIntIncStateInDepartments({ id, depsId })
    const intIncStates = []
    const nextStates = []
    for (const dep of depsId) {
      intIncStates.push(await Docs.IntIncState.findOne({ where: { IntIncomingId: id, DepartmentId: dep } }))
    }
    for (const incState of intIncStates) {
      nextStates.push(await Docs.State.findOne({ where: { parentStateId: incState.StateId } }))
    }
    if (nextStates.length) {
      let i = 0
      let state = nextStates[0].id
      for (const dep of depsId) {
        if (!nextStates[i]) {
          state = intIncStates[i].StateId
        } else {
          state = nextStates[i].id
        }
        await intIncState.addIntIncStateToDocument(null, { IntIncomingId: id, DepartmentId: dep, StateId: state })
        i++
      }
      const message = {
        type: 'setNextStateIntIncoming',
        text: 'Состояние успешно изменено',
        messageType: 'success',
        id
      }
      return message
    } else {
      const message = {
        type: 'setNextStateIntIncoming',
        text: 'Следующее состояние отсутствует',
        messageType: 'error'
      }
      return message
    }
  } catch (err) {
    const message = {
      type: 'setNextStateIntIncoming',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function prevState ({ id, depsId }) {
  try {
    const intIncStates = await intIncState.getIntIncStateInDepartments({ id, depsId })
    const previousStates = []
    for (const incState of intIncStates) {
      previousStates.push(await Docs.State.findByPk(incState.StateId))
    }
    if (previousStates.length) {
      let i = 0
      let state = previousStates[0].parentStateId
      for (const dep of depsId) {
        if (!previousStates[i]) {
          state = intIncStates[i].StateId
        } else {
          state = previousStates[i].parentStateId
        }
        await intIncState.addIntIncStateToDocument(null, { IntIncomingId: id, DepartmentId: dep, StateId: state })
        i++
      }
      const message = {
        type: 'setPreviousStateIntIncoming',
        text: 'Состояние успешно изменено',
        messageType: 'success',
        id
      }
      return message
    } else {
      const message = {
        type: 'setPreviousStateIntIncoming',
        text: 'Предшествующее состояние отсутствует',
        messageType: 'error'
      }
      return message
    }
  } catch (err) {
    const message = {
      type: 'setPreviousStateIntIncoming',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function send ({ id, execsId }) {
  try {
    // console.time('sendIntIncomingToExecs')
    const intIncoming = await Docs.IntIncoming.findByPk(id)
    if (!intIncoming) {
      const message = {
        type: 'sendIntIncomingToExecs',
        text: `Ошибка: внутренний документ с id = ${id} не найден`,
        messageType: 'error'
      }
      return message
    }
    if (!execsId) {
      const message = {
        type: 'sendIntIncomingToExecs',
        text: 'Ошибка: не указаны исполнители',
        messageType: 'error'
      }
      return message
    }
    let execsIds = execsId.length ? execsId : {}
    // Исключение повторов
    execsIds = execsIds.filter((item, index, self) =>
      index === self.findIndex(t => (t === item))
    )
    const message = {
      type: 'sendIntIncomingToExecs',
      text: '',
      messageType: 'success',
      id
    }
    // Проверка есть ли такие исполнители
    let execs = await Docs.CurrentPosition.findAll({
      attributes: ['id'],
      where: {
        id: { [Op.in]: execsIds }
      }
    })
    execs = JSON.parse(JSON.stringify(execs, null, 2))
    const ids = execs.reduce((acc, item, index) => { acc[index] = item.id.toString(); return acc }, [])
    for (const item of execsIds) {
      // const dep = await Docs.Department.findByPk(item)
      if (!ids.includes(item)) {
        message.text += `Исполнителя с id = ${item} не найдено`
        message.messageType = 'error'
        execsIds = execsIds.filter(v => v !== item)
      }
    }
    // Определение отделов куда уже расписано
    const oldExecs = await intIncoming.getAddressee() || []
    if (oldExecs.length) {
      for (const item of oldExecs) {
        if (execsIds.includes(item.id.toString())) {
          execsIds = execsIds.filter(el => el !== item.id)
        }
      }
    }
    if (execsIds.length) {
      for (const item of oldExecs) {
        execsIds.push(item.id.toString())
      }
      execsIds = execsIds.filter((item, index, self) =>
        index === self.findIndex(t => (t === item))
      )
      await intIncoming.setAddressee(execsIds)
    }
    if (message.messageType !== 'error') {
      message.text = 'Документ успешно отправлен в отделы'
    }
    // console.timeEnd('sendIntIncomingToExecs')
    return message
  } catch (err) {
    const message = {
      type: 'sendIntIncomingToExecs',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function formDocData (doc) {
  const rawData = await getIntIncomingRequestData([doc.id])
  const output = formIntIncomingRequest(rawData[0].dataValues)
  let IncNumbers, IntIncStates, IntIncFiles, Resolutions
  await Promise.all([
    IncNumbers = doc.getIntIncomingNumbers(),
    IntIncStates = doc.getIntIncStates(),
    IntIncFiles = doc.getIntIncFiles(),
    Resolutions = Resolution.getResolutionsByDoc(null, { id: doc.id, type: 'intInc' })
  ])
  const item = {
    IntIncoming: output,
    IncNumbers,
    IntIncStates,
    IntIncFiles,
    Resolutions
  }
  return item
}

async function getRequest (key, { id }) {
  try {
    console.time('Fetching IntIncoming')
    const IntIncomingRequests = []
    // console.time('First fetch id')
    // Определение всех id внутренних входящих документов в отделе
    console.time('First fetch')
    const ids = await Docs.IntIncoming.findAll({
      attributes: ['id'],
      include: [
        {
          model: Docs.CurrentPosition,
          as: 'addressee',
          attributes: [],
          through: {
            attributes: []
          },
          where: {
            DepartmentId: id
          }
        }
      ]
    })
    console.timeEnd('First fetch')
    // преобразование результата в массив
    const fetchedIds = Object.values(JSON.parse(JSON.stringify(ids, null, 2))).reduce((acc, item, index) => { acc[index] = item.id; return acc }, [])
    console.time('Second fetch')
    const output = await getIntIncomingRequestData(fetchedIds)
    console.timeEnd('Second fetch')
    for (let i = 0; i < output.length; i++) {
      const item = output[i]
      IntIncomingRequests[i] = formIntIncomingRequest(item, id)
    }
    console.timeEnd('Fetching IntIncoming')
    // console.log(IntIncomingRequests)
    return IntIncomingRequests
  } catch (err) {
    throw err
  }
}

const memoizedIntIncomingReq = memoize(getRequest)
memoizedIntIncomingReq.maxSize = 10
memoizedIntIncomingReq.size = 0
memoizedIntIncomingReq.on('add', (key, err, data) => {
  if (memoizedIntIncomingReq.size <= memoizedIntIncomingReq.maxSize) {
    memoizedIntIncomingReq.size++
  } else {
    memoizedIntIncomingReq.cache.clear()
    memoizedIntIncomingReq.size = 1
  }
})
memoizedIntIncomingReq.on('del', (key) => {
  if (memoizedIntIncomingReq.cache.has(key)) {
    memoizedIntIncomingReq.size--
  }
})
memoizedIntIncomingReq.on('clear', () => {
  memoizedIntIncomingReq.size = 0
})

const deleteIntIncReqMemo = (id) => {
  const existedReq = memoizedIntIncomingReq.get(id)
  if (existedReq) {
    memoizedIntIncomingReq.del(id)
  }
}
const resetIntIncReqMemo = () => {
  memoizedIntIncomingReq.clear()
}

module.exports = {
  memoizedIntIncomingReq,
  deleteIntIncReqMemo,
  resetIntIncReqMemo,
  async addIntIncoming (root, request) {
    const output = await addIntInc(request)
    return output
  },

  async editIntIncoming (root, request) {
    const output = await editIntInc(request)
    return output
  },

  async deleteIntIncoming (root, { id }) {
    try {
      const candidate = await Docs.IntIncoming.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'deleteIntIncoming',
          text: `Ошибка: внутренний документ с id = ${id} не найден`,
          messageType: 'error'
        }
        return message
      }
      resetIntIncReqMemo()
      const files = await candidate.getIntIncFiles() || {}
      if (files.length) {
        for (const file of files) {
          await intIncFile1.deleteIntIncFile(null, { id: file.id })
        }
      }
      const intIncRes = await candidate.getResolutions() || []
      const states = await candidate.getIntIncStates() || []
      const incNums = await candidate.getIntIncomingNumbers() || []
      const notes = await candidate.getIntIncNotes() || []
      for (const item of intIncRes) {
        await item.destroy()
      }
      for (const item of states) {
        await item.destroy()
      }
      for (const item of incNums) {
        await item.destroy()
      }
      for (const item of notes) {
        await item.destroy()
      }
      await candidate.destroy()
      const message = {
        type: 'deleteIntIncoming',
        text: 'Входящий документ успешно удалён',
        messageType: 'success',
        id
      }
      pubsub.publish('INT_INCOMING_CHANGED', {
        intIncomingChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteIntIncoming',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async publicateIntIncoming (root, { id, publicateData }) {
    try {
      let doc, type
      const message = {
        type: 'publicateIntIncoming',
        messageType: 'success'
      }
      resetIntIncReqMemo()
      if (id) {
        type = 'edit'
        doc = await Docs.IntIncoming.findByPk(id)
        if (doc) {
          const request = {
            id,
            intIncoming: {
              subject: publicateData.IntIncoming.subject,
              extNumber: publicateData.IntIncoming.extNumber,
              extNumberPrefix: publicateData.IntIncoming.extNumberPrefix,
              extDate: publicateData.IntIncoming.extDate,
              needAnswer: publicateData.IntIncoming.needAnswer,
              TypeId: publicateData.IntIncoming.TypeId
            },
            temaId: publicateData.IntIncoming.temaId,
            podpisantId: publicateData.IntIncoming.podpisantId,
            authorId: publicateData.IntIncoming.authorId,
            addresseeId: publicateData.IntIncoming.addresseeId
          }
          message.text = 'Редактирование документа: '
          const editMess = await editIntInc(request)
          message.text += editMess.text + '\n'
          if (editMess.messageType === 'error') {
            message.messageType = editMess.messageType
            return message
          }
        } else {
          message.text = `Внутренний входящий документ с id: ${id} отсутствует в базе`
          message.messageType = 'error'
          return message
        }
      } else {
        type = 'add'
        const request = {
          intIncoming: {
            subject: publicateData.IntIncoming.subject,
            extNumber: publicateData.IntIncoming.extNumber,
            extNumberPrefix: publicateData.IntIncoming.extNumberPrefix,
            extDate: publicateData.IntIncoming.extDate,
            needAnswer: publicateData.IntIncoming.needAnswer,
            TypeId: publicateData.IntIncoming.TypeId
          },
          temaId: publicateData.IntIncoming.temaId,
          podpisantId: publicateData.IntIncoming.podpisantId,
          authorId: publicateData.IntIncoming.authorId,
          addresseeId: publicateData.IntIncoming.addresseeId
        }
        message.text = 'Добавление документа: '
        const addMess = await addIntInc(request)
        message.text += addMess.text + '\n'
        if (addMess.messageType === 'error') {
          message.messageType = addMess.messageType
          return message
        }
        doc = await Docs.IntIncoming.findByPk(addMess.id)
        if (!doc) {
          message.text += 'Не удалось найти в базе только что созданный документ'
          message.messageType = 'error'
          return message
        }
      }
      message.id = doc.id
      const IntIncomingId = doc.id
      const depData = publicateData.DepData
      if (depData) {
        const DepartmentId = depData.DepartmentId
        // Добавление входящего номера
        message.text += 'Добавление/изменение входящего номера: '
        if (depData.incNumber || depData.incDate) {
          const existedIncNums = await doc.getIntIncomingNumbers() || []
          const existedIncNum = existedIncNums.find(el => el.DepartmentId.toString() === DepartmentId)
          if (existedIncNum && existedIncNum.incNumber !== depData.incNumber &&
            existedIncNum.incDate !== depData.incDate &&
            existedIncNum.prefix !== depData.prefix) {
            const incNumMess = await incomingNumber.editIntIncomingNumber(null, {
              id: existedIncNum.id,
              intIncomingNumber: {
                incNumber: depData.incNumber,
                incDate: depData.incDate,
                prefix: depData.prefix,
                DepartmentId,
                IntIncomingId
              }
            })
            message.text += incNumMess.text + '\n'
            if (incNumMess.messageType === 'error') {
              message.messageType = incNumMess.messageType
              return message
            }
          } else {
            const incNumMess = await incomingNumber.addIntIncomingNumber(null, {
              intIncomingNumber: {
                incNumber: depData.incNumber,
                incDate: depData.incDate,
                prefix: depData.prefix,
                DepartmentId,
                IntIncomingId
              }
            })
            message.text += incNumMess.text + '\n'
            if (incNumMess.messageType === 'error') {
              message.messageType = incNumMess.messageType
              return message
            }
          }
        } else {
          message.text += 'не проводилось.\n'
        }
        // Добавление состояния
        message.text += 'Добавление состояния: '
        if (depData.state) {
          const stateMess = await intIncState.addIntIncStateToDocument(null, {
            IntIncomingId,
            DepartmentId,
            StateId: depData.state
          })
          message.text += stateMess.text + '\n'
          if (stateMess.messageType === 'error') {
            message.messageType = stateMess.messageType
            return message
          }
        } else {
          message.text += 'не проводилось.\n'
        }
        // Изменение состояния
        message.text += 'Изменение состояния: '
        if (depData.changedState) {
          const n = depData.changedState
          if (n > 0) {
            // уменьшать индекс состояния
            for (let i = 0; i < n; i++) {
              const mess = await prevState({ id: IntIncomingId, depsId: [DepartmentId] })
              message.text += mess.text + '\n'
              if (mess.messageType === 'error') {
                message.messageType = mess.messageType
                return message
              }
            }
          } else if (n < 0) {
            // увеличивать индекс состояния
            for (let i = 0; i > n; i--) {
              const mess = await nextState({ id: IntIncomingId, depsId: [DepartmentId] })
              message.text += mess.text + '\n'
              if (mess.messageType === 'error') {
                message.messageType = mess.messageType
                return message
              }
            }
          }
        } else {
          message.text += 'не проводилось.\n'
        }
        // Добавление примечания
        message.text += 'Добавление примечания: '
        if (depData.noteText) {
          const existedNotes = await doc.getIntIncNotes() || []
          const existedNote = existedNotes.find(el => el.DepartmentId.toString() === DepartmentId)
          if (existedNote && existedNote.text !== depData.noteText) {
            const noteMess = await Note.editIntIncNote(null, {
              id: existedNote.id,
              intIncNote: {
                text: depData.noteText,
                IntIncomingId,
                DepartmentId
              }
            })
            message.text += noteMess.text
            if (noteMess.messageType === 'error') {
              message.messageType = noteMess.messageType
              return message
            }
          } else {
            const noteMess = await Note.addIntIncNote(null, {
              intIncNote: {
                text: depData.noteText,
                IntIncomingId,
                DepartmentId
              }
            })
            message.text += noteMess.text
            if (noteMess.messageType === 'error') {
              message.messageType = noteMess.messageType
              return message
            }
          }
        } else {
          message.text += 'не проводилось.\n'
        }
      }
      // Добавление файлов
      message.text += 'Добавление файлов: '
      if (publicateData.IntIncoming.filesId) {
        const fileMess = await intIncFile1.attachFilesToIntInc(null, {
          fileIds: publicateData.IntIncoming.filesId,
          intIncId: IntIncomingId
        })
        message.text += fileMess.text
        if (fileMess.messageType === 'error') {
          message.messageType = fileMess.messageType
          return message
        }
      } else {
        message.text += 'не проводилось.\n'
      }
      // Работа с резолюциями
      let execs = []
      if (publicateData.IntIncoming.resolutions) {
        const resolutions = JSON.parse(publicateData.IntIncoming.resolutions)
        // Добавление резолюций
        message.text += 'Добавление резолюций: '
        if (resolutions.resolutionsToAdd) {
          const resToAdd = resolutions.resolutionsToAdd
          for (let i = 0; i < resToAdd.length; i++) {
            const res = resToAdd[i]
            const mess = await Resolution.addResolution(null, {
              resolution: {
                text: res.text,
                expirationDate: res.expirationDate,
                IntIncomingId,
                authorId: res.authorId,
                complete: res.complete
              },
              executantsId: res.executantsId
            })
            message.text += mess.text + '\n'
            if (mess.messageType === 'error') {
              message.messageType = mess.messageType
              return message
            } else {
              execs = [...res.executantsId, ...execs]
            }
          }
        } else {
          message.text += 'не проводилось.\n'
        }
        // Редактирование резолюций
        message.text += 'Редактирование резолюций: '
        if (resolutions.resolutionsToEdit) {
          const resToEdit = resolutions.resolutionsToEdit
          for (let i = 0; i < resToEdit.length; i++) {
            const res = resToEdit[i]
            const mess = await Resolution.editResolution(null, {
              id: res.id,
              resolution: {
                text: res.text,
                expirationDate: res.expirationDate,
                IntIncomingId,
                authorId: res.authorId,
                complete: res.complete
              },
              executantsId: res.executantsId
            })
            message.text += mess.text + '\n'
            if (mess.messageType === 'error') {
              message.messageType = mess.messageType
              return message
            } else {
              execs = [...res.executantsId, ...execs]
            }
          }
        } else {
          message.text += 'не проводилось.\n'
        }
        // Удаление резолюций
        message.text += 'Удаление резолюций: '
        if (resolutions.resolutionsToDelete) {
          const resToDelete = resolutions.resolutionsToDelete
          for (let i = 0; i < resToDelete.length; i++) {
            const res = resToDelete[i]
            const mess = await Resolution.deleteResolution(null, { id: res })
            message.text += mess.text + '\n'
            if (mess.messageType === 'error') {
              message.messageType = mess.messageType
              return message
            }
          }
        } else {
          message.text += 'не проводилось.\n'
        }
      }
      if (message.messageType === 'success') {
        if (execs.length) {
          message.text += 'Рассылка исполнителям: '
          const sendMess = await send({ id: IntIncomingId, execsId: execs })
          message.text += sendMess.text + '\n'
          if (sendMess.messageType === 'error') {
            message.messageType = sendMess.messageType
            return message
          }
        }
        const item = await formDocData(doc)
        pubsub.publish('INT_INCOMING_CHANGED', {
          intIncomingChanged: {
            type,
            id: doc.id,
            item
          }
        })
        message.item = JSON.stringify(item)
        return message
      } else {
        return message
      }
    } catch (err) {
      const message = {
        type: 'publicateIntIncoming',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async sendIntIncomingToExecs (root, request) {
    const output = await send(request)
    return output
  },

  async getAllIntIncoming () {
    try {
      return await Docs.IntIncoming.findAll()
    } catch (err) {
      throw err
    }
  },

  async getAllIntIncomingInDepartment (root, { id }) {
    try {
      const department = await Docs.Department.findByPk(id)
      const authors = await department.getCurrentPositions()
      const docs = []
      for (const author of authors) {
        const items = await author.getIntIncomings() || []
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

  async getIntIncoming (root, { id }) {
    try {
      return await Docs.IntIncoming.findByPk(id)
    } catch (err) {
      throw err
    }
  },

  async getIntIncomingType (root, { id }) {
    try {
      const intIncoming = await Docs.IntIncoming.findByPk(id)
      return await intIncoming.getType()
    } catch (err) {
      throw err
    }
  },

  async getIntIncomingState (root, { id }) {
    try {
      const intIncoming = await Docs.IntIncoming.findByPk(id)
      return await intIncoming.getState()
    } catch (err) {
      throw err
    }
  },

  async getIntIncomingResolutions (root, { id }) {
    try {
      const intIncoming = await Docs.IntIncoming.findByPk(id)
      return await intIncoming.getResolutions()
    } catch (err) {
      throw err
    }
  },

  async getIntIncomingTemas (root, { id }) {
    try {
      const intIncoming = await Docs.IntIncoming.findByPk(id)
      return await intIncoming.getTemas()
    } catch (err) {
      throw err
    }
  },

  async getIntIncomingPodpisants (root, { id }) {
    try {
      const intIncoming = await Docs.IntIncoming.findByPk(id)
      return await intIncoming.getPodpisant()
    } catch (err) {
      throw err
    }
  },

  async getIntIncomingDepartments (root, { id }) {
    try {
      const intIncoming = await Docs.IntIncoming.findByPk(id)
      const employees = await intIncoming.getPodpisant()
      // const orgs = []
      // for (const extEmployee of extEmployees) {
      //   orgs.push(await extEmployee.getOrganisation())
      // }
      return await employees.getDepartments()
    } catch (err) {
      throw err
    }
  },

  async getIntIncomingToDepartments (root, { id }) {
    try {
      const intIncoming = await Docs.IntIncoming.findByPk(id)
      return await intIncoming.getDepartments()
    } catch (err) {
      throw err
    }
  },

  async getIntIncomingFiles (root, { id }) {
    try {
      const intIncoming = await Docs.IntIncoming.findByPk(id)
      return await intIncoming.getIntIncFiles()
    } catch (err) {
      throw err
    }
  },

  async getIntIncomingAnswers (root, { id }) {
    try {
      const intIncoming = await Docs.IntIncoming.findByPk(id)
      return await intIncoming.getIntOutgoings()
    } catch (err) {
      throw err
    }
  },

  async getIntIncomingSource (root, { id }) {
    try {
      const intIncoming = await Docs.IntIncoming.findByPk(id)
      return await intIncoming.getSource()
    } catch (err) {
      throw err
    }
  },

  // async setIntIncState (intIncoming, deps, states) {
  //   try {
  //     if (!deps || !intIncoming) {
  //       return false
  //     }
  //     let statesArr = []
  //     if (states) {
  //       statesArr = states
  //     }
  //     let i = 0
  //     let state = statesArr[i]
  //     for (const department of deps) {
  //       if (!statesArr[i]) {
  //         state = 1
  //       } else {
  //         state = statesArr[i++]
  //       }
  //       await intIncState.addIntIncStateToDocument({ IntIncomingId: intIncoming.id, DepartmentId: department, StateId: state })
  //     }
  //   } catch (err) {
  //     throw err
  //   }
  // },

  async setNextStateIntIncoming (root, request) {
    const output = await nextState(request)
    return output
  },

  async setPreviousStateIntIncoming (root, request) {
    const output = await prevState(request)
    return output
  },

  async getIntIncomingRequest (root, request) {
    const key = request.id
    const existedData = memoizedIntIncomingReq.get(key)
    console.log('Cache size: ', (memoizedIntIncomingReq.calcRAM() / 1024) / 1024 + ' MB')
    if (existedData) {
      return existedData
    }
    const output = await memoizedIntIncomingReq(key, request)
    console.log('Cache size: ', (memoizedIntIncomingReq.calcRAM() / 1024) / 1024 + ' MB')
    return output
  },
  async getIntIncomingRequestById (root, { id, depId }) {
    try {
      console.time('Fetching getIntIncomingRequestById')
      const output = await getIntIncomingRequestData([id])
      const IntIncomingRequest = formIntIncomingRequest(output[0].dataValues, depId)
      console.timeEnd('Fetching getIntIncomingRequestById')
      return IntIncomingRequest
    } catch (err) {
      throw err
    }
  },

  async getIntIncomingRequestByIds (root, { ids }) {
    try {
      console.time('Fetching getIntIncomingRequestByIds')
      const output = await getIntIncomingRequestData(ids)
      const IntIncomingRequest = []
      for (let i = 0; i < output.length; i++) {
        IntIncomingRequest[i] = formIntIncomingRequest(output[i].dataValues)
      }
      console.timeEnd('Fetching getIntIncomingRequestByIds')
      return IntIncomingRequest
    } catch (err) {
      throw err
    }
  },

  async updateIntIncomingRequest (root, { id, time }) {
    try {
      console.time('updateIntIncomingRequest')
      const IntIncomingRequest = []
      const lastUpdate = moment(+time).toISOString()
      const ids = await Docs.IntIncoming.findAll({
        attributes: ['id', 'updatedAt'],
        where: { updatedAt: { [Op.gte]: lastUpdate } },
        include: [
          {
            model: Docs.CurrentPosition,
            as: 'addressee',
            attributes: [],
            through: {
              attributes: []
            },
            where: {
              DepartmentId: id
            }
          }
        ]
      })
      const fetchedIds = Object.values(JSON.parse(JSON.stringify(ids, null, 2))).reduce((acc, item, index) => { acc[index] = item.id; return acc }, [])
      const output = await getIntIncomingRequestData(fetchedIds)
      for (let i = 0; i < output.length; i++) {
        const item = output[i].dataValues
        IntIncomingRequest[i] = formIntIncomingRequest(item, id)
      }
      console.timeEnd('updateIntIncomingRequest')
      return IntIncomingRequest
    } catch (error) {
      throw error
    }
  }
}
