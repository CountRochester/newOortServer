/* eslint-disable no-useless-escape */
const _ = require('lodash')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const moment = require('moment')
const { memoize } = require('../../../memo')

const pubsub = require('../../pubsub').getInstance()
const Docs = require('../../../models/docs')
const incNum1 = require('./incoming-number')
const extIncNote = require('./ext-inc-note')
const extIncState = require('./ext-inc-state')
const extIncFile1 = require('./ext-inc-file')
const Resolution = require('./resolution')
moment.locale('ru')

function formExtIncomingRequest (item, id) {
  const temasNames = []
  const temasIds = []
  const authorsNames = []
  const authorsIds = []
  const orgNames = []
  const OrganisationIds = []
  const extIncFiles = []
  const extIncFilesId = []
  const execs = []
  const ExecutantsId = []
  const AnswersId = []
  const Answers = []
  const ExtIncDepData = []
  const Notes = []
  const resolutions = item.Resolutions.length ? item.Resolutions.reduce((acc, item, index) => { acc[index] = item.id; return acc }, []) : []
  item.executant.forEach((exec) => {
    ExecutantsId.push(exec.id)
    const name = `${exec.Employee ? exec.Employee.secondName : ''} ${exec.Employee ? exec.Employee.firstName[0] : ''}.${exec.Employee ? exec.Employee.middleName[0] : ''}.`
    execs.push(`${name} ${exec.Position ? exec.Position.posName : ''} (${exec.Department ? exec.Department.shortName : ''})`)
  })
  item.Temas.forEach((tema) => {
    temasNames.push(tema.name)
    temasIds.push(tema.id)
  })
  item.ExtCurrentPositions.forEach((name) => {
    authorsNames.push(name.ExtEmployee.secondName + ' ' + name.ExtEmployee.firstName[0] + '.' + name.ExtEmployee.middleName[0] + '.')
    authorsIds.push(name.id)
    if (name.Organisation) {
      orgNames.push(name.Organisation.orgName)
      OrganisationIds.push(name.Organisation.id)
    }
  })
  item.ExtIncFiles.forEach((file) => {
    extIncFiles.push(file.file)
    extIncFilesId.push(file.id)
  })
  const incNumber = (item.IncomingNumbers.length && item.executant.length && id)
    ? item.IncomingNumbers.find(el => el.DepartmentId.toString() === id) || {}
    : {}
  const state = (item.ExtIncStates.length && id)
    ? item.ExtIncStates.find(el => el.DepartmentId.toString() === id) || {}
    : {}
  item.ExtOutgoings.forEach((el) => {
    AnswersId.push(el.id)
    Answers.push(`от ${moment(el.outDate).format('L')} №${el.outNumber}`)
  })
  const depsArray = item.executant.length
    ? item.executant.filter((item, index, self) =>
      index === self.findIndex(t => (t.Department.id === item.Department.id)))
    : []
  for (let j = 0; j < depsArray.length; j++) {
    const ExtIncState = item.ExtIncStates.length
      ? item.ExtIncStates.find(el => el.DepartmentId.toString() === depsArray[j].Department.id.toString()) || {}
      : {}
    const StateId = ExtIncState.State
      ? ExtIncState.State.id
      : null
    const StateName = ExtIncState.State
      ? ExtIncState.State.name
      : null
    const ExtIncStateReq = {
      ExtIncStateId: ExtIncState.id,
      StateId,
      StateName
    }
    const incNum = item.IncomingNumbers.length
      ? item.IncomingNumbers.find(el => el.DepartmentId.toString() === depsArray[j].Department.id.toString()) || {}
      : {}
    const ExtIncNumber = {
      ExtIncNumberId: incNum.id,
      incNumberDigit: incNum.incNumber,
      incDate: moment(incNum.incDate),
      prefix: incNum.prefix
    }
    // ExtIncDepData.push({
    //   DepartmentId: item.executant[j].Department.id,
    //   state: { ...ExtIncStateReq },
    //   incNumber: { ...ExtIncNumber }
    // })
    const dataToAdd = { DepartmentId: item.executant[j].Department.id }
    if (ExtIncStateReq.ExtIncStateId) {
      dataToAdd.state = { ...ExtIncStateReq }
    }
    if (ExtIncNumber.ExtIncNumberId) {
      dataToAdd.incNumber = { ...ExtIncNumber }
    }
    ExtIncDepData.push(dataToAdd)
  }
  item.ExtIncNotes.forEach((el) => {
    Notes.push({
      id: el.id,
      DepartmentId: el.DepartmentId,
      text: el.text
    })
  })
  // console.log(ExtIncDepData)
  const output = {
    id: item.id,
    subject: item.subject,
    extNumber: item.extNumber,
    extDate: moment(item.extDate),
    needAnswer: item.needAnswer,
    type: item.Type ? item.Type.name : null,
    TypeId: item.Type ? item.Type.id : null,
    state: state.State ? state.State.name : null,
    extIncStateId: state.State ? state.State.id : null,
    incNumber: incNumber
      ? incNumber.prefix
        ? incNumber.prefix + incNumber.incNumber
        : incNumber.incNumber
      : null,
    incDate: incNumber.incDate ? moment(incNumber.incDate) : null,
    extIncNumberId: incNumber.id || null,
    incNumberDigit: incNumber.incNumber || null,
    ExtIncDepData,
    temas: temasNames.join('\n'),
    temasId: temasIds,
    authors: authorsNames.join('\n'),
    authorsId: authorsIds,
    Organisation: orgNames.join('\n'),
    OrganisationId: OrganisationIds,
    Executants: execs.join('\n'),
    ExecutantsId,
    resolutions,
    AnswersId,
    Answers,
    notes: Notes,
    Files: extIncFiles.join('\n'),
    FilesId: extIncFilesId,
    updatedAt: item.updatedAt
  }
  return output
}

async function getExtIncomingRequestData (idArr) {
  const output = await Docs.ExtIncoming.findAll({
    attributes: [
      'id',
      'subject',
      'extNumber',
      'extDate',
      'needAnswer',
      'updatedAt'
    ],
    where: {
      id: { [Op.in]: idArr }
    },
    order: [
      ['extDate', 'DESC'], 'extNumber'
    ],
    include: [
      // Служащие кому направлено
      {
        model: Docs.CurrentPosition,
        as: 'executant',
        attributes: [
          'id'
          // 'extPrefix'
        ],
        through: {
          attributes: []
        },
        include: [
          // Служащий
          {
            model: Docs.Employee,
            attributes: [
              // 'id',
              'firstName',
              // 'secondNameDat',
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
              // 'depPrefix'
            ]
          },
          // Должность
          {
            model: Docs.Position,
            attributes: [
              // 'id',
              'posName'
              // 'posNameDat'
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
        model: Docs.ExtIncState,
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
      // Кто подписал
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
              // 'id',
              'firstName',
              'secondName',
              'middleName'
            ]
          }
          // {
          //   model: Docs.Position,
          //   attributes: [
          //     'id',
          //     'posName'
          //   ]
          // }
        ]
      },
      // Файлы
      {
        model: Docs.ExtIncFile,
        attributes: [
          'id',
          'file'
        ]
      },
      // Примечания
      {
        model: Docs.ExtIncNote,
        attributes: [
          'id',
          'text',
          'DepartmentId'
        ]
      },
      // Ответы
      {
        model: Docs.ExtOutgoing,
        attributes: [
          'id',
          'outNumber',
          'outDate'
        ],
        through: {
          attributes: []
        }
      },
      // Входящие номера отделов
      {
        model: Docs.IncomingNumber,
        attributes: [
          'id',
          'incNumber',
          'incDate',
          'prefix',
          'DepartmentId'
        ]
      }
    ]
  })
  return output
}

async function setExtIncState (extIncoming, deps, states) {
  try {
    if (!deps || !extIncoming) {
      return false
    }
    const statesArr = states || []
    for (let i = 0; i < deps.length; i++) {
      const state = statesArr[i] || 1
      await extIncState.addExtIncStateToDocument(null, { ExtIncomingId: extIncoming.id, DepartmentId: deps[i], StateId: state })
    }
  } catch (err) {
    throw err
  }
}

async function addExtInc ({
  extIncoming: {
    subject,
    extNumber,
    extDate,
    needAnswer,
    TypeId
  }, resId, temaId, authorId, execId, fileId
}) {
  try {
    const iSubject = _.trim(_.replace(subject, /[\[\]&{}<>#$%^*!@+\/\`~]+/g, ''))
    const candidate = await Docs.ExtIncoming.findOne({ where: { extNumber, extDate } })
    if (candidate) {
      const message = {
        type: 'addExtIncoming',
        text: 'Такой входящий документ уже существует',
        messageType: 'error'
      }
      return message
    } else {
      const extIncoming = await Docs.ExtIncoming.create({
        subject: iSubject,
        extNumber,
        extDate,
        needAnswer,
        TypeId
      })
      const message = {
        type: 'addExtIncoming',
        text: '',
        messageType: 'success',
        item: JSON.stringify({
          extIncoming: {
            subject,
            extNumber,
            extDate,
            needAnswer,
            TypeId,
            resId,
            temaId,
            authorId,
            execId,
            fileId
          }
        })
      }
      if (resId) {
        let count = 0
        for (const res of resId) {
          const resItem = await Docs.Resolution.findByPk(res)
          if (resItem.ExtIncomingId) {
            message.text += `Резолюция с id = ${res} уже назначена для входящего с id ${resItem.ExtIncomingId} \n\r`
            message.messageType = 'error'
            count++
          }
        }
        if (count >= resId.length) {
          return message
        } else {
          await extIncoming.setResolutions(resId)
        }
      }
      if (temaId) {
        await extIncoming.setTemas(temaId)
      }
      if (authorId) {
        await extIncoming.setExtCurrentPositions(authorId)
      }
      if (execId) {
        // Проверка есть ли такие исполнители
        let execs = await Docs.CurrentPosition.findAll({
          attributes: ['id', 'DepartmentId'],
          where: {
            id: { [Op.in]: execId }
          }
        })
        // Список всех исполнителей, если они существуют
        execs = JSON.parse(JSON.stringify(execs, null, 2))
        const ids = execs.reduce((acc, item, index) => { acc[index] = item.id.toString(); return acc }, [])
        const depId = execs.reduce((acc, item, index) => { acc[index] = item.DepartmentId.toString(); return acc }, [])
        for (const item of execId) {
          if (!ids.includes(item)) {
            message.text += `Исполнителя с id = ${item} не найдено`
            message.messageType = 'error'
            // Исключение несуществующих исполнителей
            execId = execId.filter(v => v !== item)
          }
        }
        await extIncoming.setExecutant(execId)
        await setExtIncState(extIncoming, depId)
      }
      if (fileId) {
        await extIncoming.setExtIncFiles(fileId)
      }
      message.text = 'Входящий документ успешно добавлен'
      message.messageType = 'success'
      message.id = extIncoming.id
      return message
    }
  } catch (err) {
    const message = {
      type: 'addExtIncoming',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function editExtInc ({
  id, extIncoming: {
    subject,
    extNumber,
    extDate,
    needAnswer,
    TypeId
  }, resId, temaId, authorId, execId, statesId, fileId
}) {
  try {
    const iSubject = _.trim(_.replace(subject, /[\[\]&{}<>#$%^*!@+\/\`~]+/g, ''))
    const candidate = await Docs.ExtIncoming.findByPk(id)
    if (!candidate) {
      const message = {
        type: 'editExtIncoming',
        text: 'Входящего документа с таким id не существует',
        messageType: 'error'
      }
      return message
    } else {
      if (iSubject) {
        candidate.subject = iSubject
      }
      if (extNumber) {
        candidate.extNumber = extNumber
      }
      if (extDate) {
        candidate.extDate = extDate
      }
      if (needAnswer) {
        candidate.needAnswer = needAnswer
      }
      if (TypeId) {
        candidate.TypeId = TypeId
      }
      await candidate.save()
      const message = {
        type: 'editExtIncoming',
        text: '',
        messageType: 'success',
        id,
        item: JSON.stringify({
          extIncoming: {
            subject,
            extNumber,
            extDate,
            needAnswer,
            TypeId,
            resId,
            temaId,
            authorId,
            execId,
            fileId
          }
        })
      }
      if (resId) {
        let count = 0
        for (const res of resId) {
          const resItem = await Docs.Resolution.findByPk(res)
          if (resItem.ExtIncomingId) {
            message.text += `Резолюция с id = ${res} уже назначена для входящего с id ${resItem.ExtIncomingId} \n\r`
            message.messageType = 'error'
            count++
          }
        }
        if (count >= resId.length) {
          return message
        } else {
          await candidate.setResolutions(resId)
        }
      }
      if (temaId) {
        await candidate.setTemas(temaId)
      }
      if (authorId) {
        await candidate.setExtCurrentPositions(authorId)
      }
      if (execId) {
        // Проверка есть ли такие исполнители
        let execs = await Docs.CurrentPosition.findAll({
          attributes: ['id', 'DepartmentId'],
          where: {
            id: { [Op.in]: execId }
          }
        })
        // Список всех исполнителей, если они существуют
        execs = JSON.parse(JSON.stringify(execs, null, 2))
        const ids = execs.reduce((acc, item, index) => { acc[index] = item.id.toString(); return acc }, [])
        const depId = execs.reduce((acc, item, index) => { acc[index] = item.DepartmentId.toString(); return acc }, [])
        for (const item of execId) {
          if (!ids.includes(item)) {
            message.text += `Исполнителя с id = ${item} не найдено`
            message.messageType = 'error'
            // Исключение несуществующих исполнителей
            const index = execId.findIndex(item)
            execId = execId.filter(v => v !== item)
            statesId = statesId.splice(index, 1)
          }
        }
        await candidate.setExecutant(execId)
        if (statesId && statesId.length) {
          await setExtIncState(candidate, depId, statesId)
        }
      }
      if (fileId) {
        await candidate.setExtIncFiles(fileId)
      }
      message.text = 'Данные входящего документа успешно изменены'
      message.messageType = 'success'
      return message
    }
  } catch (err) {
    const message = {
      type: 'editExtIncoming',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function nextState ({ id, depsId }) {
  try {
    const extIncStates = await extIncState.getExtIncStateInDepartments(null, { id, depsId })
    const nextStates = []
    for (const incState of extIncStates) {
      nextStates.push(await Docs.State.findOne({ where: { parentStateId: incState.StateId } }))
    }
    let i = 0
    let state = nextStates[0].id
    for (const dep of depsId) {
      if (!nextStates[i]) {
        state = extIncStates[i].StateId
      } else {
        state = nextStates[i].id
      }
      await extIncState.addExtIncStateToDocument(null, { ExtIncomingId: id, DepartmentId: dep, StateId: state })
      i++
    }
    const message = {
      type: 'setNextStateExtIncoming',
      text: 'Состояние успешно изменено',
      messageType: 'success',
      id
    }
    return message
  } catch (err) {
    const message = {
      type: 'setNextStateExtIncoming',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function prevState ({ id, depsId }) {
  try {
    const extIncStates = await extIncState.getExtIncStateInDepartments(null, { id, depsId })
    const States = []
    for (const incState of extIncStates) {
      States.push(await Docs.State.findByPk(incState.StateId))
    }
    let i = 0
    let state = States[0].parentStateId
    for (const dep of depsId) {
      if (!States[i]) {
        state = extIncStates[i].StateId
      } else {
        state = States[i].parentStateId
      }
      await extIncState.addExtIncStateToDocument(null, { ExtIncomingId: id, DepartmentId: dep, StateId: state })
      i++
    }
    const message = {
      type: 'setPreviousStateExtIncoming',
      text: 'Состояние успешно изменено',
      messageType: 'success',
      id
    }
    return message
  } catch (err) {
    const message = {
      type: 'setPreviousStateExtIncoming',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function sendToExecs ({ id, execsId }) {
  try {
    console.time('sendExtIncomingToExecs')
    const extIncoming = await Docs.ExtIncoming.findByPk(id)
    if (!extIncoming) {
      const message = {
        type: 'sendExtIncomingToExecs',
        text: `Ошибка: внешний документ с id = ${id} не найден`,
        messageType: 'error'
      }
      return message
    }
    if (!execsId) {
      const message = {
        type: 'sendExtIncomingToExecs',
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
      type: 'sendExtIncomingToExecs',
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
    const oldExecs = await extIncoming.getExecutant() || []
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
      await extIncoming.setExecutant(execsIds)
    }
    if (message.messageType !== 'error') {
      message.text = 'Документ успешно отправлен в отделы'
    }
    console.timeEnd('sendExtIncomingToExecs')
    return message
  } catch (err) {
    const message = {
      type: 'sendExtIncomingToExecs',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function getRequest (key, { id }) {
  console.log('id: ', id)
  console.log('key: ', key)
  try {
    console.time('Fetching ExtIncomings')
    // console.time('First fetch')
    const ExtIncomingRequests = []
    // Определение всех id внутренних входящих документов в отделе
    const ids = await Docs.ExtIncoming.findAll({
      attributes: ['id'],
      include: [
        {
          model: Docs.CurrentPosition,
          as: 'executant',
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
    // преобразование результата в массив
    // console.timeEnd('First fetch')
    // console.time('Fetching ID')
    const fetchedIds = Object.values(JSON.parse(JSON.stringify(ids, null, 2))).reduce((acc, item, index) => { acc[index] = item.id; return acc }, [])
    // console.timeEnd('Fetching ID')
    // console.log(fetchedIds)
    // console.time('Second fetch')
    const output = await getExtIncomingRequestData(fetchedIds)
    for (let i = 0; i < output.length; i++) {
      const item = output[i].dataValues
      ExtIncomingRequests[i] = formExtIncomingRequest(item, id)
    }
    // console.timeEnd('Form array')
    console.timeEnd('Fetching ExtIncomings')
    // console.log(ExtIncomingRequests)
    return ExtIncomingRequests
  } catch (err) {
    throw err
  }
}

async function formDocData (doc) {
  const rawData = await getExtIncomingRequestData([doc.id])
  const output = formExtIncomingRequest(rawData[0].dataValues)
  let IncNumbers, ExtIncStates, ExtIncFiles, Resolutions
  await Promise.all([
    IncNumbers = doc.getIncomingNumbers(),
    ExtIncStates = doc.getExtIncStates(),
    ExtIncFiles = doc.getExtIncFiles(),
    Resolutions = Resolution.getResolutionsByDoc(null, { id: doc.id, type: 'extInc' })
  ])
  const item = {
    ExtIncoming: output,
    IncNumbers,
    ExtIncStates,
    ExtIncFiles,
    Resolutions
  }
  return item
}

const memoizedExtIncomingReq = memoize(getRequest)
memoizedExtIncomingReq.maxSize = 10
memoizedExtIncomingReq.size = 0
memoizedExtIncomingReq.on('add', (key, err, data) => {
  if (memoizedExtIncomingReq.size <= memoizedExtIncomingReq.maxSize) {
    memoizedExtIncomingReq.size++
  } else {
    memoizedExtIncomingReq.cache.clear()
    memoizedExtIncomingReq.size = 1
  }
})
memoizedExtIncomingReq.on('del', (key) => {
  if (memoizedExtIncomingReq.cache.has(key)) {
    memoizedExtIncomingReq.size--
  }
})
memoizedExtIncomingReq.on('clear', () => {
  memoizedExtIncomingReq.size = 0
})

const deleteExtIncReqMemo = (id) => {
  const existedReq = memoizedExtIncomingReq.get(id)
  if (existedReq) {
    memoizedExtIncomingReq.del(id)
  }
}
const resetExtIncReqMemo = () => {
  memoizedExtIncomingReq.clear()
}

module.exports = {
  memoizedExtIncomingReq,
  deleteExtIncReqMemo,
  resetExtIncReqMemo,
  async addExtIncoming (root, request) {
    const mess = await addExtInc(request)
    return mess
  },

  async publicateExtIncoming (root, { id, publicateData }) {
    try {
      let doc, type
      const message = {
        type: 'publicateExtIncoming',
        messageType: 'success'
      }
      resetExtIncReqMemo()
      if (id) {
        doc = await Docs.ExtIncoming.findByPk(id)
        if (doc) {
          type = 'edit'
          const editRequest = {
            id,
            extIncoming: {
              subject: publicateData.ExtIncoming.subject,
              extNumber: publicateData.ExtIncoming.extNumber,
              extDate: publicateData.ExtIncoming.extDate,
              needAnswer: publicateData.ExtIncoming.needAnswer,
              TypeId: publicateData.ExtIncoming.TypeId
            },
            temaId: publicateData.ExtIncoming.temaId,
            authorId: publicateData.ExtIncoming.authorId,
            execId: publicateData.ExtIncoming.execId
          }
          message.text = 'Редактирование документа: '
          const editMess = await editExtInc(editRequest)
          message.text += editMess.text + '\n'
          if (editMess.messageType === 'error') {
            message.messageType = editMess.messageType
            return message
          }
        } else {
          message.text = `Внешний входящий документ с id: ${id} отсутствует в базе`
          message.messageType = 'error'
          return message
        }
      } else {
        type = 'add'
        const addRequest = {
          extIncoming: {
            subject: publicateData.ExtIncoming.subject,
            extNumber: publicateData.ExtIncoming.extNumber,
            extDate: publicateData.ExtIncoming.extDate,
            needAnswer: publicateData.ExtIncoming.needAnswer,
            TypeId: publicateData.ExtIncoming.TypeId
          },
          temaId: publicateData.ExtIncoming.temaId,
          authorId: publicateData.ExtIncoming.authorId,
          execId: publicateData.ExtIncoming.execId
        }
        message.text = 'Добавление документа: '
        const addMess = await addExtInc(addRequest)
        message.text += addMess.text + '\n'
        if (addMess.messageType === 'error') {
          message.messageType = addMess.messageType
          return message
        }
        doc = await Docs.ExtIncoming.findByPk(addMess.id)
        if (!doc) {
          message.text += 'Не удалось найти в базе только что созданный документ'
          message.messageType = 'error'
          return message
        }
      }
      message.id = doc.id
      const depData = publicateData.DepData
      const ExtIncomingId = doc.id
      // deleteExtIncReqMemo(DepartmentId)
      if (depData) {
        const DepartmentId = depData.DepartmentId
        // Добавление входящего номера
        message.text += 'Добавление/изменение входящего номера: '
        if (depData.incNumber && depData.incDate) {
          const incNumRequest = {
            incomingNumber: {
              incNumber: depData.incNumber,
              incDate: depData.incDate,
              prefix: depData.prefix,
              DepartmentId,
              ExtIncomingId
            }
          }
          const incNums = await doc.getIncomingNumbers()
          const existedIncNum = incNums.find(el => el.dataValues.DepartmentId.toString() === DepartmentId)
          if (existedIncNum) {
            if (existedIncNum.incNumber !== depData.incNumber ||
              existedIncNum.incDate !== depData.incDate ||
              existedIncNum.prefix !== depData.prefix) {
              const incNumMess = await incNum1.editIncomingNumber(null, {
                id: existedIncNum.id,
                incomingNumber: incNumRequest.incomingNumber
              })
              message.text += incNumMess.text + '\n'
              if (incNumMess.messageType === 'error') {
                message.messageType = incNumMess.messageType
                return message
              }
            }
          } else {
            const incNumMess = await incNum1.addIncomingNumber(null, incNumRequest)
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
          const extIncStateRequest = {
            extIncState: {
              ExtIncomingId,
              DepartmentId,
              StateId: depData.state
            }
          }
          const stateMess = await extIncState.addExtIncStateToDocument(null, extIncStateRequest.extIncState)
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
              const mess = await prevState({ id: ExtIncomingId, depsId: [DepartmentId] })
              message.text += mess.text + '\n'
              if (mess.messageType === 'error') {
                message.messageType = mess.messageType
                return message
              }
            }
          } else if (n < 0) {
            // увеличивать индекс состояния
            for (let i = 0; i > n; i--) {
              const mess = await nextState({ id: ExtIncomingId, depsId: [DepartmentId] })
              message.text += mess.text + '\n'
              if (mess.messageType === 'error') {
                message.messageType = mess.messageType
                return message
              }
            }
          }
          if (n) {
            message.text += 'не проводилось.\n'
          }
        } else {
          message.text += 'не проводилось.\n'
        }
        // Добавление примечания
        message.text += 'Добавление примечания: '
        if (depData.noteText) {
          const noteRequest = {
            extIncNote: {
              text: depData.noteText,
              ExtIncomingId,
              DepartmentId
            }
          }
          const notes = await doc.getExtIncNotes() || []
          const existedNote = notes.find(el => el.DepartmentId.toString() === DepartmentId)
          if (existedNote) {
            if (existedNote.text !== depData.noteText) {
              const noteMess = await extIncNote.editExtIncNote(null, { id: existedNote.id, extIncNote: noteRequest.extIncNote })
              message.text += noteMess.text
              if (noteMess.messageType === 'error') {
                message.messageType = noteMess.messageType
                return message
              }
            }
          } else {
            const noteMess = await extIncNote.addExtIncNote(null, noteRequest)
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
      if (publicateData.ExtIncoming.filesId) {
        if (publicateData.ExtIncoming.filesId.length) {
          const fileRequest = {
            fileIds: publicateData.ExtIncoming.filesId,
            extIncId: ExtIncomingId
          }
          const fileMess = await extIncFile1.attachFilesToExtInc(null, fileRequest)
          message.text += fileMess.text
          if (fileMess.messageType === 'error') {
            message.messageType = fileMess.messageType
            return message
          }
        } else {
          message.text += 'не проводилось.\n'
        }
      } else {
        message.text += 'не проводилось.\n'
      }
      // Работа с резолюциями
      let execs = []
      if (publicateData.ExtIncoming.resolutions) {
        const resolutions = JSON.parse(publicateData.ExtIncoming.resolutions)
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
                ExtIncomingId,
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
                ExtIncomingId,
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
          const sendMess = await sendToExecs({ id: ExtIncomingId, execsId: execs })
          message.text += sendMess.text + '\n'
          if (sendMess.messageType === 'error') {
            message.messageType = sendMess.messageType
            return message
          }
        }
        const item = await formDocData(doc)
        pubsub.publish('EXT_INCOMING_CHANGED', {
          extIncomingChanged: {
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
        type: 'publicateExtIncoming',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async editExtIncoming (root, request) {
    const mess = await editExtInc(request)
    return mess
  },

  async sendExtIncomingToExecs (root, request) {
    const mess = await sendToExecs(request)
    return mess
  },

  async deleteExtIncoming (root, { id }) {
    try {
      const candidate = await Docs.ExtIncoming.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'deleteExtIncoming',
          text: `Ошибка: внешний документ с id = ${id} не найден`,
          messageType: 'error'
        }
        return message
      }
      resetExtIncReqMemo()
      const files = await candidate.getExtIncFiles() || {}
      if (files.length) {
        for (const file of files) {
          await extIncFile1.deleteExtIncFile(null, { id: file.id })
        }
      }
      const extIncNumbers = await candidate.getIncomingNumbers() || []
      const extIncStates = await candidate.getExtIncStates() || []
      const extIncRes = await candidate.getResolutions() || []
      const notes = await candidate.getExtIncNotes() || []
      for (const item of extIncNumbers) {
        await item.destroy()
      }
      for (const item of extIncStates) {
        await item.destroy()
      }
      for (const item of extIncRes) {
        await item.destroy()
      }
      for (const item of notes) {
        await item.destroy()
      }
      await candidate.destroy()
      const message = {
        type: 'deleteExtIncoming',
        text: 'Входящий документ успешно удалён',
        messageType: 'success',
        id
      }
      pubsub.publish('EXT_INCOMING_CHANGED', {
        extIncomingChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteExtIncoming',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllExtIncoming () {
    try {
      return await Docs.ExtIncoming.findAll()
    } catch (err) {
      throw err
    }
  },

  async getAllExtIncomingInDepartment (root, { id }) {
    try {
      const department = await Docs.Department.findByPk(id)
      return department.getExtIncomings()
    } catch (err) {
      throw err
    }
  },

  async getExtIncoming (root, { id }) {
    try {
      return await Docs.ExtIncoming.findByPk(id)
    } catch (err) {
      throw err
    }
  },

  async getExtIncomingType (root, { id }) {
    try {
      const extIncoming = await Docs.ExtIncoming.findByPk(id)
      return await extIncoming.getType()
    } catch (err) {
      throw err
    }
  },

  async getExtIncomingState (root, { id }) {
    try {
      const extIncoming = await Docs.ExtIncoming.findByPk(id)
      return await extIncoming.getState()
    } catch (err) {
      throw err
    }
  },

  async getExtIncomingResolutions (root, { id }) {
    try {
      const extIncoming = await Docs.ExtIncoming.findByPk(id)
      return await extIncoming.getResolutions()
    } catch (err) {
      throw err
    }
  },

  async getExtIncomingTemas (root, { id }) {
    try {
      const extIncoming = await Docs.ExtIncoming.findByPk(id)
      return await extIncoming.getTemas()
    } catch (err) {
      throw err
    }
  },

  async getExtIncomingAuthors (root, { id }) {
    try {
      const extIncoming = await Docs.ExtIncoming.findByPk(id)
      return await extIncoming.getExtCurrentPositions()
    } catch (err) {
      throw err
    }
  },

  async getExtIncomingOrganisations (root, { id }) {
    try {
      const extIncoming = await Docs.ExtIncoming.findByPk(id) || {}
      const extEmployees = await extIncoming.getExtCurrentPositions() || []
      const orgs = []
      for (const extEmployee of extEmployees) {
        orgs.push(await extEmployee.getOrganisation())
      }
      return orgs
    } catch (err) {
      throw err
    }
  },

  async getExtIncomingDepartments (root, { id }) {
    try {
      const extIncoming = await Docs.ExtIncoming.findByPk(id)
      return await extIncoming.getDepartments()
    } catch (err) {
      throw err
    }
  },

  async getExtIncomingFile (root, { id }) {
    try {
      const extIncoming = await Docs.ExtIncoming.findByPk(id)
      return await extIncoming.getExtIncFiles()
    } catch (err) {
      throw err
    }
  },

  async getExtIncomingAnswers (root, { id }) {
    try {
      const extIncoming = await Docs.ExtIncoming.findByPk(id)
      return await extIncoming.getExtOutgoings()
    } catch (err) {
      throw err
    }
  },

  async setNextStateExtIncoming (root, request) {
    const message = await nextState(request)
    return message
  },

  async setPreviousStateExtIncoming (root, request) {
    const message = await prevState(request)
    return message
  },

  async getExtIncomingRequest (root, request) {
    const key = request.id
    const existedData = memoizedExtIncomingReq.get(key)
    console.log('Cache size: ', (memoizedExtIncomingReq.calcRAM() / 1024) / 1024 + ' MB')
    if (existedData) {
      console.log('Return from cache')
      return existedData
    }
    const output = await memoizedExtIncomingReq(key, request)
    // console.log('Cache size: ', (memoizedExtIncomingReq.calcRAM() / 1024) / 1024 + ' MB')
    return output
  },
  async getExtIncomingRequestById (root, { id, depId }) {
    try {
      console.time('Fetching getExtIncomingRequestById')
      const output = await getExtIncomingRequestData([id])
      const ExtIncomingRequest = formExtIncomingRequest(output[0].dataValues, depId)
      console.timeEnd('Fetching getExtIncomingRequestById')
      return ExtIncomingRequest
    } catch (err) {
      throw err
    }
  },

  async getExtIncomingRequestByIds (root, { ids }) {
    try {
      console.time('Fetching getExtIncomingRequestByIds')
      const output = await getExtIncomingRequestData(ids)
      const ExtIncomingRequest = []
      for (let i = 0; i < output.length; i++) {
        ExtIncomingRequest[i] = formExtIncomingRequest(output[i].dataValues)
      }
      console.timeEnd('Fetching getExtIncomingRequestByIds')
      return ExtIncomingRequest
    } catch (err) {
      throw err
    }
  },
  async updateExtIncomingRequest (root, { id, time }) {
    try {
      console.time('updateExtIncomingRequest')
      const ExtIncomingRequests = []
      const lastUpdate = moment(+time).toISOString()
      const ids = await Docs.ExtIncoming.findAll({
        attributes: ['id', 'updatedAt'],
        where: { updatedAt: { [Op.gte]: lastUpdate } },
        include: [
          {
            model: Docs.CurrentPosition,
            as: 'executant',
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
      const output = await getExtIncomingRequestData(fetchedIds)
      for (let i = 0; i < output.length; i++) {
        const item = output[i].dataValues
        ExtIncomingRequests[i] = formExtIncomingRequest(item, id)
      }
      console.timeEnd('updateExtIncomingRequest')
      return ExtIncomingRequests
    } catch (error) {
      throw error
    }
  }
}
