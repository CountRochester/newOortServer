/* eslint-disable no-useless-escape */
const _ = require('lodash')
const moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Docs = require('../../../models/docs')
const pubsub = require('../../pubsub').getInstance()
const internalIncState1 = require('./internal-inc-state')
const internalFile1 = require('./internal-file')
const incomingNumber = require('./internal-incoming-number')
const Resolution = require('./resolution')
const Note = require('./internal-note')

moment.locale('ru')

function formInternalRequest (item, id) {
  const curTemas = []
  const curTemasId = []
  const podpisantsId = []
  const podpisantsName = []
  const addresseeNames = []
  const addresseeId = []
  const internalFiles = []
  const internalFilesId = []
  const InternalDepData = []
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
  item.InternalFiles.forEach((file) => {
    internalFilesId.push(file.id)
    internalFiles.push(file.file)
  })
  const resIds = item.Resolutions.reduce((acc, item, index) => { acc[index] = item.id; return acc }, [])
  const incNumber = (item.InternalIncomingNumbers.length && id)
    ? item.InternalIncomingNumbers.find(el => el.DepartmentId.toString() === id) || {}
    : {}
  const state = (item.InternalIncStates.length && id)
    ? item.InternalIncStates.find(el => el.DepartmentId.toString() === id) || {}
    : {}
  const depsArray = item.addressee.length
    ? item.addressee.filter((item, index, self) =>
      index === self.findIndex(t => (t.Department.id === item.Department.id)))
    : []
  for (let j = 0; j < depsArray.length; j++) {
    const InternalState = item.InternalIncStates.length
      ? item.InternalIncStates.find(el => el.DepartmentId.toString() === depsArray[j].Department.id.toString()) || {}
      : {}
    const StateId = InternalState.State
      ? InternalState.State.id
      : null
    const StateName = InternalState.State
      ? InternalState.State.name
      : null
    const InternalStateReq = {
      InternalStateId: InternalState.id,
      StateId,
      StateName
    }
    const incNum = item.InternalIncomingNumbers.length
      ? item.InternalIncomingNumbers.find(el => el.DepartmentId.toString() === depsArray[j].Department.id.toString()) || {}
      : {}
    const InternalNumber = {
      InternalIncNumberId: incNum.id,
      incNumberDigit: incNum.incNumber,
      incDate: moment(incNum.incDate),
      prefix: incNum.prefix
    }
    const dataToAdd = { DepartmentId: item.addressee[j].Department.id }
    if (InternalStateReq.InternalStateId) {
      dataToAdd.state = { ...InternalStateReq }
    }
    if (InternalNumber.InternalIncNumberId) {
      dataToAdd.incNumber = { ...InternalNumber }
    }
    InternalDepData.push(dataToAdd)
  }
  item.InternalNotes.forEach((el) => {
    Notes.push({
      id: el.id,
      DepartmentId: el.DepartmentId,
      text: el.text
    })
  })
  return {
    id: item.id,
    subject: item.subject,
    docNumber: item.docNumber,
    docDate: moment(item.docDate),
    docNumberPrefix: item.docNumberPrefix || '',
    type: item.Type ? item.Type.name : null,
    typeId: item.Type ? item.Type.id : null,
    state: state.State ? state.State.name : null,
    stateId: state.State ? state.State.id : null,
    incNumber: (incNumber.incNumber)
      ? incNumber.prefix + incNumber.incNumber
      : null,
    incDate: incNumber.incDate ? moment(incNumber.incDate) : null,
    incNumberId: incNumber.id || null,
    incNumberDigit: incNumber.incNumber || null,
    temas: curTemas.join('\n'),
    temasId: curTemasId,
    author: item.author ? item.author.Employee.secondName + ' ' + item.author.Employee.firstName[0] + '.' + item.author.Employee.middleName[0] + '.' : '',
    authorId: item.author ? item.author.id : null,
    podpisants: podpisantsName.length ? podpisantsName.join('\n') : '',
    podpisantsId,
    addressee: addresseeNames.join('\n'),
    addresseeId,
    resolutions: resIds,
    InternalDepData,
    notes: Notes,
    Files: internalFiles,
    FilesId: internalFilesId,
    updatedAt: item.updatedAt
  }
}

async function getInternalRequestData (idArr) {
  const output = await Docs.Internal.findAll({
    attributes: [
      'id',
      'subject',
      'docNumber',
      'docNumberPrefix',
      'docDate',
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
        model: Docs.InternalIncState,
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
      // Примечания
      {
        model: Docs.InternalNote,
        attributes: [
          'id',
          'text',
          'DepartmentId'
        ]
      },
      // Файлы
      {
        model: Docs.InternalFile,
        attributes: [
          'id',
          'file'
        ]
      },
      // Входящие номера отделов
      {
        model: Docs.InternalIncomingNumber,
        attributes: [
          'id',
          'incNumber',
          'prefix',
          'incDate',
          'DepartmentId'
        ]
      }
    ]
  })
  return output
}

async function addInt ({
  internal: {
    subject,
    docNumber,
    docNumberPrefix,
    docDate,
    TypeId,
    authorId
  }, resId, temaId, podpisantId, addresseeId, fileId
}) {
  try {
    const iSubject = _.trim(_.replace(subject, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
    const iDocNumberPrefix = _.trim(_.replace(docNumberPrefix, /[\[\]&{}<>#$%^*!@+`~]+/g, ''))
    const candidate = await Docs.Internal.findOne({ where: { docNumber, docDate } })
    if (candidate) {
      const message = {
        type: 'addInternal',
        text: 'Такой внутренний документ уже существует',
        messageType: 'error'
      }
      return message
    } else {
      const internal = await Docs.Internal.create({
        subject: iSubject,
        docNumber,
        docNumberPrefix: iDocNumberPrefix,
        docDate,
        TypeId
      })
      const message = {
        type: 'addInternal',
        text: '',
        messageType: 'success',
        id: internal.id,
        item: JSON.stringify({
          internal: {
            subject,
            docNumber,
            docNumberPrefix,
            docDate,
            TypeId,
            authorId,
            resId,
            temaId,
            podpisantId,
            addresseeId,
            fileId
          }
        })
      }
      if (resId) {
        for (const res of resId) {
          const resItem = await Docs.Resolution.findByPk(res)
          if (resItem.InternalId) {
            message.text += `Резолюция с id = ${res} уже назначена для входящего с id ${resItem.InternalId} \n\r`
            message.messageType = 'error'
          }
        }
        if (message.messageType === 'error') {
          return message
        } else {
          await internal.setResolutions(resId)
        }
      }
      if (authorId) {
        await internal.setAuthor(authorId)
      }
      if (temaId) {
        await internal.setTemas(temaId)
      }
      if (podpisantId) {
        await internal.setPodpisant(podpisantId)
      }
      if (addresseeId) {
        await internal.setAddressee(addresseeId)
      }
      if (fileId) {
        await internal.setInternalFiles(fileId)
      }
      message.id = internal.id
      message.text = 'Внутренний документ успешно добавлен'
      return message
    }
  } catch (err) {
    const message = {
      type: 'addInternal',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function editInt ({
  id, internal: {
    subject,
    docNumber,
    docNumberPrefix,
    docDate,
    TypeId,
    authorId
  }, resId, temaId, podpisantId, addresseeId, fileId
}) {
  try {
    const iSubject = _.trim(_.replace(subject, /[\[\]&{}<>#$%^*!@+\/\\`~]+/g, ''))
    const iDocNumberPrefix = _.trim(_.replace(docNumberPrefix, /[\[\]&{}<>#$%^*!@+`~]+/g, ''))
    const candidate = await Docs.Internal.findByPk(id)
    if (!candidate) {
      const message = {
        type: 'editInternal',
        text: 'Внутреннего документа с таким id не существует',
        messageType: 'error'
      }
      return message
    } else {
      candidate.subject = iSubject
      candidate.docNumber = docNumber
      candidate.docNumberPrefix = iDocNumberPrefix
      candidate.docDate = docDate
      candidate.TypeId = TypeId
      await candidate.save()
      const message = {
        type: 'editInternal',
        text: '',
        messageType: 'success',
        id,
        item: JSON.stringify({
          internal: {
            subject,
            docNumber,
            docNumberPrefix,
            docDate,
            TypeId,
            authorId,
            resId,
            temaId,
            podpisantId,
            addresseeId,
            fileId
          }
        })
      }
      if (resId) {
        for (const res of resId) {
          const resItem = await Docs.Resolution.findByPk(res)
          if (resItem.InternalId) {
            message.text += `Резолюция с id = ${res} уже назначена для входящего с id ${resItem.InternalId} \n\r`
            message.messageType = 'error'
          }
        }
        if (message.messageType === 'error') {
          return message
        } else {
          await candidate.setResolutions(resId)
        }
      }
      if (authorId) {
        await candidate.setAuthor(authorId)
      }
      if (temaId) {
        await candidate.setTemas(temaId)
      }
      if (podpisantId) {
        await candidate.setPodpisant(podpisantId)
      }
      if (addresseeId) {
        await candidate.setAddressee(addresseeId)
      }
      if (fileId) {
        await candidate.setInternalFiles(fileId)
      }
      message.text = 'Данные внутреннего документа успешно изменены'
      return message
    }
  } catch (err) {
    const message = {
      type: 'editInternal',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function send ({ id, execsId }) {
  try {
    console.time('sendInternalToExecs')
    const internal = await Docs.Internal.findByPk(id)
    if (!internal) {
      const message = {
        type: 'sendInternalToExecs',
        text: `Ошибка: документ с id = ${id} не найден`,
        messageType: 'error'
      }
      return message
    }
    if (!execsId) {
      const message = {
        type: 'sendInternalToExecs',
        text: 'Ошибка: не указаны адресаты',
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
      type: 'sendInternalToExecs',
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
    const oldExecs = await internal.getAddressee() || []
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
      await internal.setAddressee(execsIds)
    }
    if (message.messageType !== 'error') {
      message.text = 'Документ успешно отправлен в отделы'
    }
    console.timeEnd('sendInternalToExecs')
    return message
  } catch (err) {
    const message = {
      type: 'sendInternalToExecs',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function nextState ({ id, depsId }) {
  try {
    const internalIncStates = []
    const nextStates = []
    for (const dep of depsId) {
      internalIncStates.push(await Docs.InternalIncState.findOne({ where: { InternalId: id, DepartmentId: dep } }))
    }
    for (const incState of internalIncStates) {
      nextStates.push(await Docs.State.findOne({ where: { parentStateId: incState.StateId } }))
    }
    if (nextStates.length) {
      let i = 0
      let state = nextStates[0].id
      for (const dep of depsId) {
        if (!nextStates[i]) {
          state = internalIncStates[i].StateId
        } else {
          state = nextStates[i].id
        }
        await internalIncState1.addInternalIncStateToDocument(null, { InternalId: id, DepartmentId: dep, StateId: state })
        i++
      }
      const message = {
        type: 'setNextStateInternal',
        text: 'Состояние успешно изменено',
        messageType: 'success',
        id
      }
      return message
    } else {
      const message = {
        type: 'setNextStateInternal',
        text: 'Следующее состояние отсутствует',
        messageType: 'error'
      }
      return message
    }
  } catch (err) {
    const message = {
      type: 'setNextStateInternal',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function prevState ({ id, depsId }) {
  try {
    const internalIncStates = await internalIncState1.getInternalIncStateInDepartments(null, { id, depsId })
    const previousStates = []
    for (const incState of internalIncStates) {
      previousStates.push(await Docs.State.findByPk(incState.StateId))
    }
    if (previousStates.length) {
      let i = 0
      let state = previousStates[0].parentStateId
      for (const dep of depsId) {
        if (!previousStates[i]) {
          state = internalIncStates[i].StateId
        } else {
          state = previousStates[i].parentStateId
        }
        await internalIncState1.addInternalIncStateToDocument(null, { InternalId: id, DepartmentId: dep, StateId: state })
        i++
      }
      const message = {
        type: 'setPreviousStateInternal',
        text: 'Состояние успешно изменено',
        messageType: 'success',
        id
      }
      return message
    } else {
      const message = {
        type: 'setPreviousStateInternal',
        text: 'Предшествующее состояние отсутствует',
        messageType: 'error'
      }
      return message
    }
  } catch (err) {
    const message = {
      type: 'setPreviousStateInternal',
      text: `Ошибка: ${err}`,
      messageType: 'error'
    }
    return message
  }
}

async function formDocData (doc) {
  const rawData = await getInternalRequestData([doc.id])
  const output = formInternalRequest(rawData[0].dataValues)
  let IncNumbers, InternalStates, InternalFiles, Resolutions
  await Promise.all([
    IncNumbers = doc.getInternalIncomingNumbers(),
    InternalStates = doc.getInternalIncStates(),
    InternalFiles = doc.getInternalFiles(),
    Resolutions = Resolution.getResolutionsByDoc(null, { id: doc.id, type: 'internal' })
  ])
  const item = {
    Internal: output,
    IncNumbers,
    InternalStates,
    InternalFiles,
    Resolutions
  }
  return item
}

module.exports = {
  async addInternal (root, request) {
    const output = await addInt(request)
    return output
  },

  async editInternal (root, request) {
    const output = await editInt(request)
    return output
  },

  async publicateInternal (root, { id, publicateData }) {
    try {
      let doc, type
      const message = {
        type: 'publicateInternal',
        messageType: 'success'
      }
      if (id) {
        type = 'edit'
        doc = await Docs.Internal.findByPk(id)
        if (doc) {
          const request = {
            id,
            internal: {
              subject: publicateData.Internal.subject,
              docNumber: publicateData.Internal.docNumber,
              docNumberPrefix: publicateData.Internal.docNumberPrefix,
              docDate: publicateData.Internal.docDate,
              authorId: publicateData.Internal.authorId,
              TypeId: publicateData.Internal.TypeId
            },
            temaId: publicateData.Internal.temaId,
            podpisantId: publicateData.Internal.podpisantId,
            addresseeId: publicateData.Internal.addresseeId
          }
          message.text = 'Редактирование документа: '
          const editMess = await editInt(request)
          message.text += editMess.text + '\n'
          if (editMess.messageType === 'error') {
            message.messageType = editMess.messageType
            return message
          }
        } else {
          message.text = `Внутренний документ с id: ${id} отсутствует в базе`
          message.messageType = 'error'
          return message
        }
      } else {
        type = 'add'
        const request = {
          internal: {
            subject: publicateData.Internal.subject,
            docNumber: publicateData.Internal.docNumber,
            docNumberPrefix: publicateData.Internal.docNumberPrefix,
            docDate: publicateData.Internal.docDate,
            authorId: publicateData.Internal.authorId,
            TypeId: publicateData.Internal.TypeId
          },
          temaId: publicateData.Internal.temaId,
          podpisantId: publicateData.Internal.podpisantId,
          addresseeId: publicateData.Internal.addresseeId
        }
        message.text = 'Добавление документа: '
        const addMess = await addInt(request)
        message.text += addMess.text + '\n'
        if (addMess.messageType === 'error') {
          message.messageType = addMess.messageType
          return message
        }
        doc = await Docs.Internal.findByPk(addMess.id)
        if (!doc) {
          message.text += 'Не удалось найти в базе только что созданный документ'
          message.messageType = 'error'
          return message
        }
      }
      message.id = doc.id
      const InternalId = doc.id
      const depData = publicateData.DepData
      if (depData) {
        const DepartmentId = depData.DepartmentId
        // Добавление входящего номера
        message.text += 'Добавление/изменение входящего номера: '
        if (depData.incNumber || depData.incDate) {
          const existedIncNums = await doc.getInternalIncomingNumbers() || []
          const existedIncNum = existedIncNums.find(el => el.DepartmentId.toString() === DepartmentId)
          if (existedIncNum && existedIncNum.incNumber !== depData.incNumber &&
            existedIncNum.incDate !== depData.incDate &&
            existedIncNum.prefix !== depData.prefix) {
            const incNumMess = await incomingNumber.editInternalIncomingNumber(null, {
              id: existedIncNum.id,
              internalIncomingNumber: {
                incNumber: depData.incNumber,
                incDate: depData.incDate,
                prefix: depData.prefix,
                DepartmentId,
                InternalId
              }
            })
            message.text += incNumMess.text + '\n'
            if (incNumMess.messageType === 'error') {
              message.messageType = incNumMess.messageType
              return message
            }
          } else {
            const incNumMess = await incomingNumber.addInternalIncomingNumber(null, {
              internalIncomingNumber: {
                incNumber: depData.incNumber,
                incDate: depData.incDate,
                prefix: depData.prefix,
                DepartmentId,
                InternalId
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
          const stateMess = await internalIncState1.addInternalIncStateToDocument(null, {
            InternalId,
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
              const mess = await prevState({ id: InternalId, depsId: [DepartmentId] })
              message.text += mess.text + '\n'
              if (mess.messageType === 'error') {
                message.messageType = mess.messageType
                return message
              }
            }
          } else if (n < 0) {
            // увеличивать индекс состояния
            for (let i = 0; i > n; i--) {
              const mess = await nextState({ id: InternalId, depsId: [DepartmentId] })
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
          const existedNotes = await doc.getInternalNotes() || []
          const existedNote = existedNotes.find(el => el.DepartmentId.toString() === DepartmentId)
          if (existedNote && existedNote.text !== depData.noteText) {
            const noteMess = await Note.editInternalNote(null, {
              id: existedNote.id,
              internalNote: {
                text: depData.noteText,
                InternalId,
                DepartmentId
              }
            })
            message.text += noteMess.text
            if (noteMess.messageType === 'error') {
              message.messageType = noteMess.messageType
              return message
            }
          } else {
            const noteMess = await Note.addInternalNote(null, {
              internalNote: {
                text: depData.noteText,
                InternalId,
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
      if (publicateData.Internal.filesId) {
        const fileMess = await internalFile1.attachFilesToInternal(null, {
          fileIds: publicateData.Internal.filesId,
          internalId: InternalId
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
      if (publicateData.Internal.resolutions) {
        const resolutions = JSON.parse(publicateData.Internal.resolutions)
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
                InternalId,
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
                InternalId,
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
          const sendMess = await send({ id: InternalId, execsId: execs })
          message.text += sendMess.text + '\n'
          if (sendMess.messageType === 'error') {
            message.messageType = sendMess.messageType
            return message
          }
        }
        const item = await formDocData(doc)
        pubsub.publish('INTERNAL_CHANGED', {
          internalChanged: {
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
        type: 'publicateInternal',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async sendInternalToExecs (root, request) {
    const output = await send(request)
    return output
  },

  async deleteInternal (root, { id }) {
    try {
      const candidate = await Docs.Internal.findByPk(id)
      if (!candidate) {
        const message = {
          type: 'deleteInternal',
          text: `Ошибка: внутренний документ с id = ${id} не найден`,
          messageType: 'error'
        }
        return message
      }
      const files = await candidate.getInternalFiles() || []
      if (files.length) {
        for (const file of files) {
          await internalFile1.deleteInternalFile(null, { id: file.id })
        }
      }
      const internalRes = await candidate.getResolutions() || []
      const incNums = await candidate.getInternalIncomingNumbers() || []
      const states = await candidate.getInternalIncStates() || []
      const notes = await candidate.getInternalNotes() || []
      for (const item of internalRes) {
        await item.destroy()
      }
      for (const item of incNums) {
        await item.destroy()
      }
      for (const item of states) {
        await item.destroy()
      }
      for (const item of notes) {
        await item.destroy()
      }
      await candidate.destroy()
      const message = {
        type: 'deleteInternal',
        text: 'Внутренний документ успешно удалён',
        messageType: 'success',
        id
      }
      pubsub.publish('INTERNAL_CHANGED', {
        internalChanged: {
          type: 'delete',
          id
        }
      })
      return message
    } catch (err) {
      const message = {
        type: 'deleteInternal',
        text: `Ошибка: ${err}`,
        messageType: 'error'
      }
      return message
    }
  },

  async getAllInternal () {
    try {
      return await Docs.Internal.findAll()
    } catch (err) {
      throw err
    }
  },
  async getAllInternalInDepartment (root, { id }) {
    try {
      const department = await Docs.Department.findByPk(id)
      return await department.getInternals() || []
    } catch (err) {
      throw err
    }
  },

  async getAllInternalInDepartmentByAuthor (root, { id }) {
    try {
      const department = await Docs.Department.findByPk(id)
      const authors = await department.getCurrentPositions()
      const docs = []
      for (const author of authors) {
        const items = await author.getInternals() || []
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

  async getInternal (root, { id }) {
    try {
      return await Docs.Internal.findByPk(id)
    } catch (err) {
      throw err
    }
  },

  async getInternalType (root, { id }) {
    try {
      const internal = await Docs.Internal.findByPk(id)
      return await internal.getType()
    } catch (err) {
      throw err
    }
  },

  async getInternalState (root, { id }) {
    try {
      const internal = await Docs.Internal.findByPk(id)
      return await internal.getState()
    } catch (err) {
      throw err
    }
  },

  async getInternalResolutions (root, { id }) {
    try {
      const internal = await Docs.Internal.findByPk(id)
      return await internal.getResolutions()
    } catch (err) {
      throw err
    }
  },

  async getInternalTemas (root, { id }) {
    try {
      const internal = await Docs.Internal.findByPk(id)
      return await internal.getTemas()
    } catch (err) {
      throw err
    }
  },

  async getInternalPodpisants (root, { id }) {
    try {
      const internal = await Docs.Internal.findByPk(id)
      return await internal.getPodpisant()
    } catch (err) {
      throw err
    }
  },

  async getInternalDepartments (root, { id }) {
    try {
      const internal = await Docs.Internal.findByPk(id)
      const employees = await internal.getPodpisant()
      return await employees.getDepartments()
    } catch (err) {
      throw err
    }
  },

  async getInternalAuthor (root, { id }) {
    try {
      if (id) {
        const internal = await Docs.Internal.findByPk(id)
        return await internal.getAuthor()
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getInternalAuthorDepartment (root, { id }) {
    try {
      const internal = await Docs.Internal.findByPk(id)
      const author = await internal.getAuthor()
      return await author.getDepartment()
    } catch (err) {
      throw err
    }
  },

  async getInternalToDepartments (root, { id }) {
    try {
      const internal = await Docs.Internal.findByPk(id)
      return await internal.getDepartments()
    } catch (err) {
      throw err
    }
  },

  async getInternalAttachedFiles (root, { id }) {
    try {
      const internal = await Docs.Internal.findByPk(id)
      return await internal.getInternalFiles()
    } catch (err) {
      throw err
    }
  },

  async setNextStateInternal (root, request) {
    const output = await nextState(request)
    return output
  },

  async setPreviousStateInternal (root, request) {
    const output = await editInt(request)
    return output
  },

  async getInternalRequest (root, { id }) {
    try {
      console.time('Fetching getInternalRequest')
      const InternalRequests = []
      const ids = await Docs.Internal.findAll({
        attributes: ['id'],
        where: {
          [Op.or]: {
            '$addressee.DepartmentId$': id,
            '$author.DepartmentId$': id
          }
        },
        include: [
          {
            model: Docs.CurrentPosition,
            as: 'addressee',
            attributes: ['DepartmentId'],
            through: {
              attributes: []
            }
          },
          {
            model: Docs.CurrentPosition,
            as: 'author',
            attributes: ['DepartmentId']
          }
        ]
      })
      const fetchedIds = Object.values(JSON.parse(JSON.stringify(ids, null, 2))).reduce((acc, item, index) => { acc[index] = item.id; return acc }, [])
      const output = await getInternalRequestData(fetchedIds)
      for (let i = 0; i < output.length; i++) {
        const item = output[i].dataValues
        InternalRequests[i] = formInternalRequest(item, id)
      }
      console.timeEnd('Fetching getInternalRequest')
      return InternalRequests
    } catch (err) {
      throw err
    }
  },
  async getInternalRequestById (root, { id, depId }) {
    try {
      console.time('Fetching getInternalRequestById')
      const output = await getInternalRequestData([id])
      const InternalRequest = formInternalRequest(output[0].dataValues, depId)
      console.timeEnd('Fetching getInternalRequestById')
      return InternalRequest
    } catch (err) {
      throw err
    }
  },

  async getInternalRequestByIds (root, { ids }) {
    try {
      console.time('Fetching getInternalRequestByIds')
      const output = await getInternalRequestData(ids)
      const InternalRequest = []
      for (let i = 0; i < output.length; i++) {
        InternalRequest[i] = formInternalRequest(output[0].dataValues)
      }
      console.timeEnd('Fetching getInternalRequestByIds')
      return InternalRequest
    } catch (err) {
      throw err
    }
  },

  async updateInternalRequest (root, { id, time }) {
    try {
      console.time('updateInternalRequest')
      const InternalRequest = []
      const lastUpdate = moment(+time).toISOString()
      const ids = await Docs.Internal.findAll({
        attributes: ['id', 'updatedAt'],
        where: {
          [Op.and]: [
            { updatedAt: { [Op.gte]: lastUpdate } },
            {
              [Op.or]: {
                '$addressee.DepartmentId$': id,
                '$author.DepartmentId$': id
              }
            }
          ]
        },
        include: [
          {
            model: Docs.CurrentPosition,
            as: 'addressee',
            attributes: ['DepartmentId'],
            through: {
              attributes: []
            }
          },
          {
            model: Docs.CurrentPosition,
            as: 'author',
            attributes: ['DepartmentId']
          }
        ]
      })
      const fetchedIds = Object.values(JSON.parse(JSON.stringify(ids, null, 2))).reduce((acc, item, index) => { acc[index] = item.id; return acc }, [])
      const output = await getInternalRequestData(fetchedIds)
      for (let i = 0; i < output.length; i++) {
        const item = output[i].dataValues
        InternalRequest[i] = formInternalRequest(item, id)
      }
      console.timeEnd('updateInternalRequest')
      return InternalRequest
    } catch (error) {
      throw error
    }
  }
}
