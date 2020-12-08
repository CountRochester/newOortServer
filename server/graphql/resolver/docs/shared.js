const moment = require('moment')
// const { Op } = require('sequelize')
// const Docs = require('../../../models/docs')
// const position1 = require('./position')
const contract1 = require('./contract')
// const organisation1 = require('./docs/organisation')
const state1 = require('./state')
const type1 = require('./type')
const department1 = require('./department')
const employee1 = require('./employee')
const extEmployee1 = require('./ext-employee')
const tema1 = require('./tema')
const resolution1 = require('./resolution')
const extIncoming1 = require('./ext-incoming')
// const extIncFile1 = require('./docs/ext-inc-file')
// const extOutFile1 = require('./ext-out-file')
// const intIncFile1 = require('./docs/int-inc-file')
// const intOutFile1 = require('./docs/int-out-file')
// const internalFile1 = require('./docs/internal-file')
const extOutgoing1 = require('./ext-outgoing')
const intIncoming1 = require('./int-incoming')
const intOutgoing1 = require('./int-outgoing')
const internal1 = require('./internal')
const incomingNumber1 = require('./incoming-number')
const extIncState1 = require('./ext-inc-state')

moment.locale('ru')

module.exports = {
// -------------------------------------------------------------------------------------------------------
// Функции по формированию популяризированных объектов
  async formEmployeeP (employee) {
    return employee ? {
      id: employee.id,
      firstName: employee.firstName,
      secondName: employee.secondName,
      middleName: employee.middleName,
      tabelNumber: employee.tabelNumber,
      phone1: employee.phone1,
      phone2: employee.phone2,
      phone3: employee.phone3,
      email1: employee.email1,
      email2: employee.email2,
      Department: employee.DepartmentId ? await department1.getDepartment({ id: employee.DepartmentId }) : null,
      Positions: await employee1.getEmployeeAllPosition({ id: employee.id }),
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt
    } : null
  },

  async formArrayEmployeeP (employees) {
    const arr = []
    for (const item of employees) {
      arr.push(await this.formEmployeeP(item))
    }
    return arr
  },

  async formDepartmentP (department) {
    return department ? {
      id: department.id,
      depName: department.depName,
      depNumber: department.depNumber,
      shortName: department.shortName,
      depPrefix: department.depPrefix,
      parentDepartment: await department1.getParentDepartment({ id: department.id }),
      childDepartments: await department1.getAllChildDepartment({ id: department.id }),
      createdAt: department.createdAt,
      updatedAt: department.updatedAt
    } : null
  },

  async formArrayDepartmentP (deps) {
    const arr = []
    for (const item of deps) {
      arr.push(await this.formDepartmentP(item))
    }
    return arr
  },

  async formResolutionP (resolution) {
    return resolution ? {
      id: resolution.id,
      text: resolution.text,
      expirationDate: resolution.expirationDate,
      ExtIncoming: resolution.ExtIncomingId ? await extIncoming1.getExtIncoming({ id: resolution.ExtIncomingId }) : null,
      IntIncoming: resolution.IntIncomingId ? await intIncoming1.getIntIncoming({ id: resolution.IntIncomingId }) : null,
      Internal: resolution.InternalId ? await internal1.getInternal({ id: resolution.InternalId }) : null,
      author: resolution.authorId ? await this.formEmployeeP(await employee1.getEmployee({ id: resolution.authorId })) : null,
      Executants: await this.formArrayEmployeeP(await resolution1.getResolutionEmployees({ id: resolution.id })),
      complete: resolution.complete,
      createdAt: resolution.createdAt,
      updatedAt: resolution.updatedAt
    } : null
  },

  async formArrayResolutionP (resArray) {
    const resPArray = []
    for (const item of resArray) {
      resPArray.push(await this.formResolutionP(item))
    }
    return resPArray
  },

  async formTemaP (tema) {
    return tema ? {
      id: tema.id,
      name: tema.name,
      Contract: tema.ContractId ? await contract1.getContract({ id: tema.ContractId }) : null,
      createdAt: tema.createdAt,
      updatedAt: tema.updatedAt
    } : null
  },

  async formArrayTemaP (temas) {
    const arr = []
    for (const item of temas) {
      arr.push(await this.formTemaP(item))
    }
    return arr
  },

  async formStateP (state) {
    return state ? {
      id: state.id,
      name: state.name,
      parentState: state.parentStateId ? await this.getStateP({ id: state.parentStateId }) : null,
      createdAt: state.createdAt,
      updatedAt: state.updatedAt
    } : null
  },

  async formArrayStateP (states) {
    const arr = []
    for (const item of states) {
      arr.push(await this.formStateP(item))
    }
    return arr
  },

  async formExtEmployeeP (extEmployee) {
    return extEmployee ? {
      id: extEmployee.id,
      firstName: extEmployee.firstName,
      middleName: extEmployee.middleName,
      secondName: extEmployee.secondName,
      position: extEmployee.position,
      Organisation: extEmployee.OrganisationId ? await extEmployee1.getExtEmployeeOrganisation({ id: extEmployee.OrganisationId }) : null,
      createdAt: extEmployee.createdAt,
      updatedAt: extEmployee.updatedAt
    } : null
  },

  async formArrayExtEmployeeP (extEmployees) {
    const Arr = []
    for (const item of extEmployees) {
      Arr.push(await this.formExtEmployeeP(item))
    }
    return Arr
  },

  async formIncomingNumberP (incomingNumber) {
    return incomingNumber ? {
      id: incomingNumber.id,
      incNumber: incomingNumber.incNumber,
      incDate: incomingNumber.incDate,
      Department: incomingNumber.DepartmentId ? await this.getDepartmentP({ id: incomingNumber.DepartmentId }) : null,
      createdAt: incomingNumber.createdAt,
      updatedAt: incomingNumber.updatedAt
    } : null
  },

  async formArrayIncomingNumberP (incomingNumbers) {
    const Arr = []
    for (const item of incomingNumbers) {
      Arr.push(await this.formIncomingNumberP(item))
    }
    return Arr
  },

  async formExtIncomingP (extIncoming) {
    return extIncoming ? {
      id: extIncoming.id,
      subject: extIncoming.subject,
      extNumber: extIncoming.extNumber,
      extDate: extIncoming.extDate,
      needAnswer: extIncoming.needAnswer,
      Type: extIncoming.TypeId ? await type1.getType({ id: extIncoming.TypeId }) : null,
      State: await this.getAllExtIncStateByExtIncomingP({ id: extIncoming.id }),
      Temas: await this.formArrayTemaP(await extIncoming1.getExtIncomingTemas({ id: extIncoming.id })),
      IncomingNumbers: await this.getIncomingNumberByExtIncomingP({ id: extIncoming.id }),
      Resolutions: await this.formArrayResolutionP(await extIncoming1.getExtIncomingResolutions({ id: extIncoming.id })),
      Authors: await this.formArrayExtEmployeeP(await extIncoming1.getExtIncomingAuthors({ id: extIncoming.id })),
      Organisation: await extIncoming1.getExtIncomingOrganisations({ id: extIncoming.id }),
      Departments: await this.formArrayDepartmentP(await extIncoming1.getExtIncomingDepartments({ id: extIncoming.id })),
      Files: await extIncoming1.getExtIncomingFile({ id: extIncoming.id }),
      Answers: await extIncoming1.getExtIncomingAnswers({ id: extIncoming.id }),
      createdAt: extIncoming.createdAt,
      updatedAt: extIncoming.updatedAt
    } : null
  },

  async formArrayExtIncomingP (extIncomings) {
    const Arr = []
    for (const item of extIncomings) {
      Arr.push(await this.formExtIncomingP(item))
    }
    return Arr
  },

  async formExtIncStateP (extIncState) {
    return extIncState ? {
      id: extIncState.id,
      Department: extIncState.DepartmentId ? await this.getDepartmentP({ id: extIncState.DepartmentId }) : null,
      State: extIncState.StateId ? await state1.getState({ id: extIncState.StateId }) : null,
      createdAt: extIncState.createdAt,
      updatedAt: extIncState.updatedAt
    } : null
  },

  async formArrayExtIncStateP (extIncStates) {
    const Arr = []
    for (const item of extIncStates) {
      Arr.push(await this.formExtIncStateP(item))
    }
    return Arr
  },

  async formExtOutgoingP (extOutgoing) {
    return extOutgoing ? {
      id: extOutgoing.id,
      subject: extOutgoing.subject,
      outNumber: extOutgoing.outNumber,
      outDate: extOutgoing.outDate,
      Author: await this.formEmployeeP(await extOutgoing1.getExtOutgoingAuthor({ id: extOutgoing.id })),
      Type: extOutgoing.TypeId ? await type1.getType({ id: extOutgoing.TypeId }) : null,
      State: extOutgoing.StateId ? await this.formStateP(await state1.getState({ id: extOutgoing.StateId })) : null,
      Addressees: await this.formArrayExtEmployeeP(await extOutgoing1.getExtOutgoingExtEmployees({ id: extOutgoing.id })),
      Temas: await this.formArrayTemaP(await extOutgoing1.getExtOutgoingTemas({ id: extOutgoing.id })),
      Organisations: await extOutgoing1.getExtOutgoingOrganisations({ id: extOutgoing.id }),
      Department: await this.formDepartmentP(await extOutgoing1.getExtOutgoingDepartment({ id: extOutgoing.id })),
      Files: await extOutgoing1.getExtOutgoingFiles({ id: extOutgoing.id }),
      IsAnswerOn: await this.formArrayExtIncomingP(await extOutgoing1.getExtOutgoingAnswers({ id: extOutgoing.id })),
      createdAt: extOutgoing.createdAt,
      updatedAt: extOutgoing.updatedAt
    } : null
  },

  async formArrayExtOutgoingP (extOutgoings) {
    const Arr = []
    for (const item of extOutgoings) {
      Arr.push(await this.formExtOutgoingP(item))
    }
    return Arr
  },

  async formIntIncomingP (intIncoming) {
    return intIncoming ? {
      id: intIncoming.id,
      extNumber: intIncoming.extNumber,
      extDate: intIncoming.extDate,
      subject: intIncoming.subject,
      incNumber: intIncoming.incNumber,
      incDate: intIncoming.incDate,
      needAnswer: intIncoming.needAnswer,
      Type: intIncoming.TypeId ? await type1.getType({ id: intIncoming.TypeId }) : null,
      State: intIncoming.StateId ? await this.formStateP(await state1.getState({ id: intIncoming.StateId })) : null,
      Temas: await this.formArrayTemaP(await intIncoming1.getIntIncomingTemas({ id: intIncoming.id })),
      Resolutions: await this.formArrayResolutionP(await intIncoming1.getIntIncomingResolutions({ id: intIncoming.id })),
      Podpisants: await this.formArrayEmployeeP(await intIncoming1.getIntIncomingPodpisants({ id: intIncoming.id })),
      AddresseeDeps: await this.formArrayDepartmentP(await intIncoming1.getIntIncomingToDepartments({ id: intIncoming.id })),
      Files: await intIncoming1.getIntIncomingFiles({ id: intIncoming.id }),
      Answers: await intIncoming1.getIntIncomingAnswers({ id: intIncoming.id }),
      SourceOutgoing: await intIncoming1.getIntIncomingSource({ id: intIncoming.id }),
      createdAt: intIncoming.createdAt,
      updatedAt: intIncoming.updatedAt
    } : null
  },

  async formArrayIntIncomingP (intIncomings) {
    const Arr = []
    for (const item of intIncomings) {
      Arr.push(await this.formIntIncomingP(item))
    }
    return Arr
  },

  async formIntOutgoingP (intOutgoing) {
    return intOutgoing ? {
      id: intOutgoing.id,
      subject: intOutgoing.subject,
      outNumber: intOutgoing.outNumber,
      outDate: intOutgoing.outDate,
      Author: await this.formEmployeeP(await intOutgoing1.getIntOutgoingAuthor({ id: intOutgoing.id })),
      Podpisants: await this.formArrayEmployeeP(await intOutgoing1.getIntOutgoingPodpisants({ id: intOutgoing.id })),
      Type: intOutgoing.TypeId ? await type1.getType({ id: intOutgoing.TypeId }) : null,
      State: intOutgoing.StateId ? await this.formStateP(await state1.getState({ id: intOutgoing.StateId })) : null,
      AddresseeDeps: await this.formArrayDepartmentP(await intOutgoing1.getIntOutgoingToDepartments({ id: intOutgoing.id })),
      Temas: await this.formArrayTemaP(await intOutgoing1.getIntOutgoingTemas({ id: intOutgoing.id })),
      Files: await intOutgoing1.getIntOutgoingFiles({ id: intOutgoing.id }),
      IsAnswerOn: await intOutgoing1.getIntOutgoingAnswers({ id: intOutgoing.id }),
      IsIncomings: await intOutgoing1.getIntOutgoingIncomings({ id: intOutgoing.id }),
      createdAt: intOutgoing.createdAt,
      updatedAt: intOutgoing.updatedAt
    } : null
  },

  async formArrayIntOutgoingP (intOutgoings) {
    const Arr = []
    for (const item of intOutgoings) {
      Arr.push(await this.formIntOutgoingP(item))
    }
    return Arr
  },

  async formInternalP (internal) {
    return internal ? {
      id: internal.id,
      incNumber: internal.incNumber,
      incDate: internal.incDate,
      subject: internal.subject,
      docNumber: internal.docNumber,
      docDate: internal.docDate,
      Type: await type1.getType({ id: internal.TypeId }),
      State: internal.StateId ? await this.formStateP(await state1.getState({ id: internal.StateId })) : null,
      Author: await this.formEmployeeP(await internal1.getInternalAuthor({ id: internal.id })),
      Resolutions: await this.formArrayResolutionP(await internal1.getInternalResolutions({ id: internal.id })),
      Temas: await this.formArrayTemaP(await internal1.getInternalTemas({ id: internal.id })),
      Podpisants: await this.formArrayEmployeeP(await internal1.getInternalPodpisants({ id: internal.id })),
      AddresseeDeps: await this.formArrayDepartmentP(await internal1.getInternalToDepartments({ id: internal.id })),
      Files: await internal1.getInternalFiles({ id: internal.id }),
      createdAt: internal.createdAt,
      updatedAt: internal.updatedAt
    } : null
  },

  async formArrayInternalP (internals) {
    const Arr = []
    for (const item of internals) {
      Arr.push(await this.formInternalP(item))
    }
    return Arr
  },

  // -------------------------------------------------------------------------------------------------------
  // Служебные функции
  async formArray (items, fun) {
    const array = []
    for (const item of items) {
      array.push(await fun(item))
    }
    return array
  },

  // -------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------
  // Состояние
  async getStateP ({ id }) {
    try {
      if (id) {
        const state = await state1.getState({ id })
        if (state) {
          return await this.formStateP(state)
        } else {
          return {}
        }
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  },

  async getAllStateP () {
    try {
      return await this.formArrayStateP(await state1.getAllState())
    } catch (err) {
      throw err
    }
  },
  // -------------------------------------------------------------------------------------------------------
  // Работники
  async getEmployeeP ({ id }) {
    try {
      return await this.formEmployeeP(await employee1.getEmployee({ id }))
    } catch (err) {
      throw err
    }
  },

  async getAllEmployeeP () {
    try {
      return await this.formArrayEmployeeP(await employee1.getAllEmployee())
    } catch (err) {
      throw err
    }
  },
  // -------------------------------------------------------------------------------------------------------
  // Резолюции
  async getResolutionP ({ id }) {
    try {
      return await this.formResolutionP(await resolution1.getResolution({ id }))
    } catch (err) {
      throw err
    }
  },

  async getAllResolutionP () {
    try {
      return await this.formArrayResolutionP(await resolution1.getAllResolution())
    } catch (err) {
      throw err
    }
  },

  async getAllDocumentsNotCompleteP () {
    try {
      const documents = await resolution1.getAllDocumentsNotComplete()
      return {
        ExtIncomings: await this.formArrayExtIncomingP(documents.ExtIncomings),
        IntIncomings: await this.formArrayIntIncomingP(documents.IntIncomings),
        Internals: await this.formArrayInternalP(documents.Internals)
      }
    } catch (err) {
      throw err
    }
  },

  async getAllDocumentsOutOfDateP () {
    try {
      const documents = await resolution1.getAllDocumentsOutOfDate()
      return {
        ExtIncomings: await this.formArrayExtIncomingP(documents.ExtIncomings),
        IntIncomings: await this.formArrayIntIncomingP(documents.IntIncomings),
        Internals: await this.formArrayInternalP(documents.Internals)
      }
    } catch (err) {
      throw err
    }
  },

  async getAllDocumentsToDateP ({ date }) {
    try {
      const documents = await resolution1.getAllDocumentsToDate({ date })
      return {
        ExtIncomings: await this.formArrayExtIncomingP(documents.ExtIncomings),
        IntIncomings: await this.formArrayIntIncomingP(documents.IntIncomings),
        Internals: await this.formArrayInternalP(documents.Internals)
      }
    } catch (err) {
      throw err
    }
  },

  async getAllDocumentsByResolutionAuthorP ({ id }) {
    try {
      const documents = await resolution1.getAllDocumentsByResolutionAuthor({ id })
      return {
        ExtIncomings: await this.formArrayExtIncomingP(documents.ExtIncomings),
        IntIncomings: await this.formArrayIntIncomingP(documents.IntIncomings),
        Internals: await this.formArrayInternalP(documents.Internals)
      }
    } catch (err) {
      throw err
    }
  },
  // -------------------------------------------------------------------------------------------------------
  // Отделы
  async getDepartmentP ({ id }) {
    try {
      const department = await department1.getDepartment({ id })
      if (department) {
        return await this.formDepartmentP(department)
      } else {
        return {}
      }
    } catch (err) {
      throw err
    }
  },

  async getAllDepartmentP () {
    try {
      return await this.formArrayDepartmentP(await department1.getAllDepartment())
    } catch (err) {
      throw err
    }
  },

  async getAllDepartmentEmployeesP ({ id }) {
    try {
      return await this.formArrayEmployeeP(await department1.getAllDepartmentEmployees({ id }))
    } catch (err) {
      throw err
    }
  },

  async getAllDepartmentAndSubdivisionEmployeesP ({ id }) {
    try {
      return await this.formArrayEmployeeP(await department1.getAllDepartmentAndSubdivisionEmployees({ id }))
    } catch (err) {
      throw err
    }
  },
  // -------------------------------------------------------------------------------------------------------
  // Темы
  async getTemaP ({ id }) {
    try {
      return await this.formTemaP(await tema1.getTema({ id }))
    } catch (err) {
      throw err
    }
  },

  async getAllTemaP () {
    try {
      return await this.formArrayTemaP(await tema1.getAllTema())
    } catch (err) {
      throw err
    }
  },

  async getExtIncomingsByTemaP ({ id }) {
    try {
      return await this.formArrayExtIncomingP(await tema1.getExtIncomingsByTema({ id }))
    } catch (err) {
      throw err
    }
  },
  // -------------------------------------------------------------------------------------------------------
  // Внешний служащий

  async getExtEmployeeP ({ id }) {
    try {
      return await this.formExtEmployeeP(await extEmployee1.getExtEmployee({ id }))
    } catch (err) {
      throw err
    }
  },

  async getAllExtEmployeeP () {
    try {
      return await this.formArrayExtEmployeeP(await extEmployee1.getAllExtEmployee())
    } catch (err) {
      throw err
    }
  },
  // -------------------------------------------------------------------------------------------------------
  // Внешний входящий номер
  async getIncomingNumberP ({ id }) {
    try {
      return await this.formIncomingNumberP(await incomingNumber1.getIncomingNumber({ id }))
    } catch (err) {
      throw err
    }
  },

  async getAllIncomingNumberP () {
    try {
      return await this.formArrayIncomingNumberP(await incomingNumber1.getAllIncomingNumber())
    } catch (err) {
      throw err
    }
  },

  async getIncomingNumberByDepartmentP ({ id }) {
    try {
      return await this.formArrayIncomingNumberP(await incomingNumber1.getIncomingNumberByDepartment({ id }))
    } catch (err) {
      throw err
    }
  },

  async getIncomingNumberByExtIncomingP ({ id }) {
    try {
      return await this.formArrayIncomingNumberP(await incomingNumber1.getIncomingNumberByExtIncoming({ id }))
    } catch (err) {
      throw err
    }
  },
  // -------------------------------------------------------------------------------------------------------
  // Внешний входящий документ
  async getExtIncomingP ({ id }) {
    try {
      return await this.formExtIncomingP(await extIncoming1.getExtIncoming({ id }))
    } catch (err) {
      throw err
    }
  },

  async getAllExtIncomingP () {
    try {
      return await this.formArrayExtIncomingP(await extIncoming1.getAllExtIncoming())
    } catch (err) {
      throw err
    }
  },

  async getAllExtIncomingInDepartmentP ({ id }) {
    try {
      return await this.formArrayExtIncomingP(await extIncoming1.getAllExtIncomingInDepartment({ id }))
    } catch (err) {
      throw err
    }
  },

  // async getExtIncomingRequest ({ id }) {
  //   try {
  //     console.time('Fetching ExtIncomings')
  //     const ExtIncomingRequests = []
  //     // Определение всех id внутренних входящих документов в отделе
  //     const ids = await Docs.ExtIncoming.findAll({
  //       attributes: ['id'],
  //       include: [
  //         {
  //           model: Docs.CurrentPosition,
  //           as: 'executant',
  //           attributes: [],
  //           through: {
  //             attributes: []
  //           },
  //           where: {
  //             DepartmentId: id
  //           }
  //         }
  //       ]
  //     })
  //     // преобразование результата в массив
  //     const fetchedIds = Object.values(JSON.parse(JSON.stringify(ids, null, 2))).reduce((acc, item, index) => { acc[index] = item.id; return acc }, [])
  //     // console.log(fetchedIds)
  //     const output = await Docs.ExtIncoming.findAll({
  //       attributes: [
  //         'id',
  //         'subject',
  //         'extNumber',
  //         'extDate',
  //         'needAnswer'
  //       ],
  //       where: {
  //         id: { [Op.in]: fetchedIds }
  //       },
  //       include: [
  //       // Служащие кому направлено
  //         {
  //           model: Docs.CurrentPosition,
  //           as: 'executant',
  //           attributes: [
  //             'id',
  //             'extPrefix'
  //           ],
  //           through: {
  //             attributes: []
  //           },
  //           include: [
  //           // Служащий
  //             {
  //               model: Docs.Employee,
  //               attributes: [
  //                 'id',
  //                 'firstName',
  //                 'secondNameDat',
  //                 'secondName',
  //                 'middleName'
  //               ]
  //             },
  //             // Отдел
  //             {
  //               model: Docs.Department,
  //               attributes: [
  //                 'id',
  //                 'shortName',
  //                 'depPrefix'
  //               ]
  //             },
  //             // Должность
  //             {
  //               model: Docs.Position,
  //               attributes: [
  //                 'id',
  //                 'posName',
  //                 'posNameDat'
  //               ]
  //             }
  //           ]
  //         },
  //         // Тип документа
  //         {
  //           model: Docs.Type,
  //           attributes: [
  //             'id',
  //             'name'
  //           ]
  //         },
  //         // Состояние документа в отделах
  //         {
  //           model: Docs.ExtIncState,
  //           attributes: [
  //             'id',
  //             'DepartmentId'
  //           ],
  //           include: [
  //             {
  //               model: Docs.State,
  //               attributes: [
  //                 'id',
  //                 'name'
  //               ]
  //             }
  //           ]
  //         },
  //         // Тема
  //         {
  //           model: Docs.Tema,
  //           attributes: [
  //             'id',
  //             'name'
  //           ],
  //           through: {
  //             attributes: []
  //           }
  //         },
  //         // Кто подписал
  //         {
  //           model: Docs.ExtEmployee,
  //           attributes: [
  //             'id',
  //             'firstName',
  //             'secondName',
  //             'middleName'
  //           ],
  //           through: {
  //             attributes: []
  //           },
  //           include: [
  //             {
  //               model: Docs.Organisation,
  //               attributes: [
  //                 'id',
  //                 'orgName'
  //               ]
  //             }
  //           ]
  //         },
  //         // Файлы
  //         {
  //           model: Docs.ExtIncFile,
  //           attributes: [
  //             'id',
  //             'file'
  //           ]
  //         },
  //         // Входящие номера отделов
  //         {
  //           model: Docs.IncomingNumber,
  //           attributes: [
  //             'id',
  //             'incNumber',
  //             'incDate',
  //             'DepartmentId'
  //           ]
  //         }
  //       ]
  //     })
  //     const fetchedData = JSON.parse(JSON.stringify(output, null, 2))
  //     // console.log(JSON.stringify(output, null, 2))
  //     for (let i = 0; i < fetchedData.length; i++) {
  //       const item = fetchedData[i]
  //       const temasNames = []
  //       const temasIds = []
  //       const authorsNames = []
  //       const authorsIds = []
  //       const orgNames = []
  //       const OrganisationIds = []
  //       const extIncFiles = []
  //       const extIncFilesId = []
  //       const execs = []
  //       const ExecutantsId = []
  //       item.executant.forEach((exec) => {
  //         ExecutantsId.push(exec.id)
  //         const name = `${exec.Employee ? exec.Employee.secondName : ''} ${exec.Employee ? exec.Employee.firstName[0] : ''}.${exec.Employee ? exec.Employee.middleName[0] : ''}.`
  //         execs.push(`${name} ${exec.Position ? exec.Position.posName : ''} (${exec.Department ? exec.Department.shortName : ''})`)
  //       })
  //       item.Temas.forEach((tema) => {
  //         temasNames.push(tema.name)
  //         temasIds.push(tema.id)
  //       })
  //       item.ExtEmployees.forEach((name) => {
  //         authorsNames.push(name.secondName + ' ' + name.firstName[0] + '.' + name.middleName[0] + '.')
  //         authorsIds.push(name.id)
  //         if (name.Organisation) {
  //           orgNames.push(name.Organisation.orgName)
  //           OrganisationIds.push(name.Organisation.id)
  //         }
  //       })
  //       item.ExtIncFiles.forEach((file) => {
  //         extIncFiles.push(file.file)
  //         extIncFilesId.push(file.id)
  //       })
  //       const incNumber = (item.IncomingNumbers.length && item.executant.length)
  //         ? item.IncomingNumbers.find(el => el.DepartmentId.toString() === id) || {}
  //         : {}
  //       const state = item.ExtIncStates.length
  //         ? item.ExtIncStates.find(el => el.DepartmentId.toString() === id) || {}
  //         : {}
  //       ExtIncomingRequests[i] = {
  //         id: item.id,
  //         subject: item.subject,
  //         extNumber: item.extNumber,
  //         extDate: moment(item.extDate),
  //         needAnswer: item.needAnswer,
  //         type: item.Type ? item.Type.name : null,
  //         TypeId: item.Type ? item.Type.id : null,
  //         state: state.State ? state.State.name : null,
  //         extIncStateId: state.State ? state.State.id : null,
  //         incNumber: (item.executant.length && incNumber.incNumber)
  //           ? item.executant.find(el => el.Department.id.toString() === id).Department.depPrefix + '/' + incNumber.incNumber
  //           : null,
  //         incDate: incNumber.incDate ? moment(incNumber.incDate) : null,
  //         extIncNumberId: incNumber.id || null,
  //         temas: temasNames.join('\n'),
  //         temasId: temasIds,
  //         authors: authorsNames.join('\n'),
  //         authorsId: authorsIds,
  //         Organisation: orgNames.join('\n'),
  //         OrganisationId: OrganisationIds,
  //         Executants: execs.join('\n'),
  //         ExecutantsId,
  //         Files: extIncFiles.join('\n'),
  //         FilesId: extIncFilesId
  //       }
  //     }
  //     console.timeEnd('Fetching ExtIncomings')
  //     // console.log(ExtIncomingRequests)
  //     return ExtIncomingRequests
  //   } catch (err) {
  //     throw err
  //   }
  // },
  // -------------------------------------------------------------------------------------------------------------------------------------------------------
  // async getExtOutgoingRequest ({ id }) {
  //   try {
  //     console.time('Fetching ExtOutgoings')
  //     const ExtOutgoingRequests = []
  //     const output = await Docs.ExtOutgoing.findAll({
  //       attributes: [
  //         'id',
  //         'outNumber',
  //         'outDate',
  //         'subject'
  //       ],
  //       include: [
  //         // Автор
  //         {
  //           model: Docs.CurrentPosition,
  //           as: 'author',
  //           where: {
  //             DepartmentId: id
  //           },
  //           attributes: [
  //             'id',
  //             'extPrefix',
  //             'intPrefix'
  //           ],
  //           include: [
  //             // Служащий
  //             {
  //               model: Docs.Employee,
  //               attributes: [
  //                 'id',
  //                 'firstName',
  //                 'secondName',
  //                 'middleName'
  //               ]
  //             },
  //             // Отдел
  //             {
  //               model: Docs.Department,
  //               attributes: [
  //                 'id',
  //                 'shortName',
  //                 'depPrefix'
  //               ]
  //             }
  //           ]
  //         },
  //         // Состояние
  //         {
  //           model: Docs.State,
  //           attributes: [
  //             'id',
  //             'name'
  //           ]
  //         },
  //         // Адрессат
  //         {
  //           model: Docs.ExtEmployee,
  //           attributes: [
  //             'id',
  //             'firstName',
  //             'secondName',
  //             'middleName'
  //           ],
  //           through: {
  //             attributes: []
  //           },
  //           include: [{
  //             model: Docs.Organisation,
  //             attributes: [
  //               'id',
  //               'orgName'
  //             ]
  //           }]
  //         },
  //         // Тип документа
  //         {
  //           model: Docs.Type,
  //           attributes: [
  //             'id',
  //             'name'
  //           ]
  //         },
  //         // Тема
  //         {
  //           model: Docs.Tema,
  //           attributes: [
  //             'id',
  //             'name'
  //           ],
  //           through: {
  //             attributes: []
  //           }
  //         },
  //         // Подписанты
  //         {
  //           model: Docs.CurrentPosition,
  //           as: 'podpisant',
  //           attributes: [
  //             'id',
  //             'extPrefix',
  //             'intPrefix'
  //           ],
  //           through: {
  //             attributes: []
  //           },
  //           include: [
  //             // Служащий
  //             {
  //               model: Docs.Employee,
  //               attributes: [
  //                 'id',
  //                 'firstName',
  //                 'secondName',
  //                 'middleName'
  //               ]
  //             },
  //             // Отдел
  //             {
  //               model: Docs.Department,
  //               attributes: [
  //                 'id',
  //                 'shortName'
  //               ]
  //             },
  //             // Должность
  //             {
  //               model: Docs.Position,
  //               attributes: [
  //                 'id',
  //                 'posName'
  //               ]
  //             }
  //           ]
  //         },
  //         // Файлы
  //         {
  //           model: Docs.ExtOutFile,
  //           attributes: [
  //             'id',
  //             'file'
  //           ]
  //         },
  //         // Ответ на
  //         {
  //           model: Docs.ExtIncoming,
  //           as: 'answer',
  //           attributes: [
  //             'id',
  //             'extNumber',
  //             'extDate'
  //           ],
  //           through: {
  //             attributes: []
  //           }
  //         }
  //       ]
  //     })
  //     const fetchedData = JSON.parse(JSON.stringify(output, null, 2))
  //     for (let i = 0; i < fetchedData.length; i++) {
  //       const item = fetchedData[i]
  //       const curAdsress = []
  //       const curAdsressId = []
  //       const curTemas = []
  //       const curTemasId = []
  //       const curOrgs = []
  //       const curOrgsId = []
  //       const curFiles = []
  //       const curFilesId = []
  //       const curAnswers = []
  //       const curAnswersId = []
  //       const curPodp = []
  //       const curPodpId = []
  //       item.ExtEmployees.forEach((addr) => {
  //         curAdsressId.push(addr.id)
  //         curAdsress.push(addr.secondName + ' ' + addr.firstName[0] + '.' + addr.middleName[0] + '.')
  //         curOrgsId.push(addr.Organisation.id)
  //         curOrgs.push(addr.Organisation.orgName)
  //       })
  //       item.Temas.forEach((tema) => {
  //         curTemas.push(tema.name)
  //         curTemasId.push(tema.id)
  //       })
  //       item.podpisant.forEach((podp) => {
  //         curPodp.push(podp.Employee.secondName + ' ' + podp.Employee.firstName[0] + '.' + podp.Employee.middleName[0] + '.')
  //         curPodpId.push(podp.id)
  //       })
  //       item.ExtOutFiles.forEach((file) => {
  //         curFilesId.push(file.id)
  //         curFiles.push(file.file)
  //       })
  //       item.answer.forEach((el) => {
  //         curAnswersId.push(el.id)
  //         const date = moment(el.extDate).format('L')
  //         curAnswers.push(`№${el.extNumber} от ${date}`)
  //       })
  //       ExtOutgoingRequests[i] = {
  //         id: item.id,
  //         outNumber: item.outNumber,
  //         outDate: moment(item.outDate),
  //         subject: item.subject,
  //         author: item.author ? item.author.Employee.secondName + ' ' + item.author.Employee.firstName[0] + '.' + item.author.Employee.middleName[0] + '.' : null,
  //         authorId: item.author ? item.author.id : null,
  //         type: item.Type ? item.Type.name : null,
  //         typeId: item.Type ? item.Type.id : null,
  //         state: item.State ? item.State.name : null,
  //         stateId: item.State ? item.State.id : null,
  //         podpisants: curPodp.join(`\n`),
  //         podpisantsId: curPodpId,
  //         addressees: curAdsress.length ? curAdsress.join(`\n`) : null,
  //         addresseesId: curAdsressId,
  //         temas: curTemas.length ? curTemas.join(`\n`) : null,
  //         temasId: curTemasId,
  //         organisations: curOrgs.length ? curOrgs.join(`\n`) : null,
  //         organisationsId: curOrgsId,
  //         department: item.author ? item.author.Department.shortName : '',
  //         departmentId: item.author ? item.author.Department.id : null,
  //         files: curFiles,
  //         filesId: curFilesId,
  //         isAnswerOn: curAnswers.length ? curAnswers.join(`\n`) : null,
  //         isAnswerOnId: curAnswersId
  //       }
  //     }
  //     console.timeEnd('Fetching ExtOutgoings')
  //     return ExtOutgoingRequests
  //   } catch (err) {
  //     throw err
  //   }
  // },
  // -------------------------------------------------------------------------------------------------------
  // async getIntIncomingRequest ({ id }) {
  //   try {
  //     console.time('Fetching IntIncoming')
  //     const IntIncomingRequests = []
  //     // console.time('First fetch id')
  //     // Определение всех id внутренних входящих документов в отделе
  //     const ids = await Docs.IntIncoming.findAll({
  //       attributes: ['id'],
  //       include: [
  //         {
  //           model: Docs.CurrentPosition,
  //           as: 'addressee',
  //           attributes: [],
  //           through: {
  //             attributes: []
  //           },
  //           where: {
  //             DepartmentId: id
  //           }
  //         }
  //       ]
  //     })
  //     // преобразование результата в массив
  //     const fetchedIds = Object.values(JSON.parse(JSON.stringify(ids, null, 2))).reduce((acc, item, index) => { acc[index] = item.id; return acc }, [])
  //     // console.timeEnd('First fetch id')
  //     // console.log(fetchedIds)
  //     // Поиск всех внутренних входящих с необходимыми данными
  //     const output = await Docs.IntIncoming.findAll({
  //       attributes: [
  //         'id',
  //         'incNumber',
  //         'incDate',
  //         'subject',
  //         'extNumber',
  //         'extDate',
  //         'needAnswer'
  //       ],
  //       where: {
  //         id: { [Op.in]: fetchedIds }
  //         // [Op.or]: [
  //         //   { '$addressee.DepartmentId$': id },
  //         //   { '$addressee.IntDoc.IntIncomingId$': { [Op.in]: fetchedIds } }
  //         // ]
  //       },
  //       include: [
  //         // Служащие кому направлено
  //         {
  //           model: Docs.CurrentPosition,
  //           as: 'addressee',
  //           attributes: [
  //             'id',
  //             'intPrefix'
  //           ],
  //           required: true,
  //           through: {
  //             attributes: []
  //           },
  //           include: [
  //             // Служащий
  //             {
  //               model: Docs.Employee,
  //               attributes: [
  //                 'id',
  //                 'firstName',
  //                 'secondNameDat',
  //                 'secondName',
  //                 'middleName'
  //               ]
  //             },
  //             // Отдел
  //             {
  //               model: Docs.Department,
  //               attributes: [
  //                 'id',
  //                 'shortName',
  //                 'depPrefix'
  //               ]
  //             },
  //             // Должность
  //             {
  //               model: Docs.Position,
  //               attributes: [
  //                 'id',
  //                 'posName',
  //                 'posNameDat'
  //               ]
  //             }
  //           ]
  //         },
  //         // Резолюции
  //         {
  //           model: Docs.Resolution,
  //           required: false,
  //           attributes: [
  //             'id'
  //           ]
  //         },
  //         // Тип документа
  //         {
  //           model: Docs.Type,
  //           attributes: [
  //             'id',
  //             'name'
  //           ]
  //         },
  //         // Состояние
  //         {
  //           model: Docs.State,
  //           attributes: [
  //             'id',
  //             'name'
  //           ]
  //         },
  //         // Темы
  //         {
  //           model: Docs.Tema,
  //           attributes: [
  //             'id',
  //             'name'
  //           ],
  //           through: {
  //             attributes: []
  //           }
  //         },
  //         // Автор
  //         {
  //           model: Docs.CurrentPosition,
  //           as: 'author',
  //           attributes: [
  //             'id',
  //             'extPrefix',
  //             'intPrefix'
  //           ],
  //           include: [
  //             // Служащий
  //             {
  //               model: Docs.Employee,
  //               attributes: [
  //                 'id',
  //                 'firstName',
  //                 'secondName',
  //                 'middleName'
  //               ]
  //             }
  //           ],
  //           through: {
  //             attributes: []
  //           }
  //         },
  //         // Подписанты
  //         {
  //           model: Docs.CurrentPosition,
  //           as: 'podpisant',
  //           attributes: [
  //             'id',
  //             'extPrefix',
  //             'intPrefix'
  //           ],
  //           through: {
  //             attributes: []
  //           },
  //           include: [
  //             // Служащий
  //             {
  //               model: Docs.Employee,
  //               attributes: [
  //                 'id',
  //                 'firstName',
  //                 'secondName',
  //                 'middleName'
  //               ]
  //             },
  //             // Отдел
  //             {
  //               model: Docs.Department,
  //               attributes: [
  //                 'id',
  //                 'shortName',
  //                 'depPrefix'
  //               ]
  //             },
  //             // Должность
  //             {
  //               model: Docs.Position,
  //               attributes: [
  //                 'id',
  //                 'posName'
  //               ]
  //             }
  //           ]
  //         },
  //         // Является ответом на
  //         {
  //           model: Docs.IntOutgoing,
  //           attributes: [
  //             'id',
  //             'outNumber',
  //             'outDate'
  //           ],
  //           through: {
  //             attributes: []
  //           },
  //           include: [
  //             {
  //               model: Docs.CurrentPosition,
  //               as: 'podpisant',
  //               attributes: [
  //                 'id'
  //               ],
  //               include: [
  //                 {
  //                   model: Docs.Department,
  //                   attributes: [
  //                     'id',
  //                     'depPrefix'
  //                   ]
  //                 }
  //               ]
  //             }
  //           ]
  //         },
  //         // Исходник
  //         {
  //           model: Docs.IntOutgoing,
  //           as: 'source',
  //           attributes: [
  //             'id',
  //             'outNumber',
  //             'outDate'
  //           ],
  //           include: [
  //             {
  //               model: Docs.CurrentPosition,
  //               as: 'podpisant',
  //               attributes: [
  //                 'id'
  //               ],
  //               include: [
  //                 {
  //                   model: Docs.Department,
  //                   attributes: [
  //                     'id',
  //                     'depPrefix'
  //                   ]
  //                 }
  //               ]
  //             }
  //           ]
  //         },
  //         // Файлы
  //         {
  //           model: Docs.IntIncFile,
  //           attributes: [
  //             'id',
  //             'file'
  //           ]
  //         }
  //       ]
  //     })
  //     // console.log(JSON.stringify(output, null, 2))
  //     // console.time('JSON parse')
  //     const fetchedData = JSON.parse(JSON.stringify(output, null, 2))
  //     // console.timeEnd('JSON parse')
  //     // console.log(fetchedData)
  //     const currentDep = fetchedData.length ? fetchedData[0].addressee.find(el => el.Department.id.toString() === id).Department : {}
  //     // const currentDep = {}
  //     // console.log(currentDep)
  //     for (let i = 0; i < fetchedData.length; i++) {
  //       const item = fetchedData[i]
  //       const curTemas = []
  //       const curTemasId = []
  //       const podpisantsId = []
  //       const podpisantsName = []
  //       const addresseeNames = []
  //       const addresseeId = []
  //       const answersId = []
  //       const answers = []
  //       const intIncFiles = []
  //       const intIncFilesId = []
  //       item.Temas.forEach((tema) => {
  //         curTemas.push(tema.name)
  //         curTemasId.push(tema.id)
  //       })
  //       item.podpisant.forEach((podp) => {
  //         podpisantsId.push(podp.id)
  //         const name = `${podp.Employee ? podp.Employee.secondName : ''} ${podp.Employee ? podp.Employee.firstName[0] : ''}.${podp.Employee ? podp.Employee.middleName[0] : ''}.`
  //         podpisantsName.push(`${name} ${podp.Position ? podp.Position.posName : ''} (${podp.Department ? podp.Department.shortName : ''})`)
  //       })
  //       item.addressee.forEach((addr) => {
  //         const name = addr.Employee.secondName + ' ' + addr.Employee.firstName[0] + '.' + addr.Employee.middleName[0] + '.'
  //         addresseeNames.push(`${name} ${addr.Position.posName} (${addr.Department.shortName})`)
  //         addresseeId.push(addr.id)
  //       })
  //       item.IntOutgoings.forEach((ans) => {
  //         answersId.push(ans.id)
  //         const podp = ans.podpisant.length ? ans.podpisant[0] : {}
  //         const podpDep = podp.Department || {}
  //         const prefix = podp.intPrefix ? `${podpDep.depPrefix}-${podp.intPrefix}` : `${podpDep.depPrefix}`
  //         const date = moment(ans.outDate).format('L')
  //         answers.push(`Исх. от ${date} №${prefix}/${ans.outNumber}`)
  //       })
  //       let sourceOutgoing = ''
  //       let sourceOutgoingId = null
  //       if (item.source) {
  //         const podp = item.source.podpisant.length ? item.source.podpisant[0] : {}
  //         const podpDep = podp.Department || {}
  //         const prefix = podp.intPrefix ? `${podpDep.depPrefix}-${podp.intPrefix}` : `${podpDep.depPrefix}`
  //         const sourceDate = moment(item.source.outDate).format('L')
  //         sourceOutgoing = `Исх. от ${sourceDate} №${prefix}/${item.source.outNumber}`
  //         sourceOutgoingId = item.source.id
  //       }
  //       item.IntIncFiles.forEach((file) => {
  //         intIncFilesId.push(file.id)
  //         intIncFiles.push(file.file)
  //       })
  //       const resIds = item.Resolutions.reduce((acc, item, index) => { acc[index] = item.id; return acc }, [])
  //       // const resIds = []
  //       IntIncomingRequests[i] = {
  //         id: item.id,
  //         subject: item.subject,
  //         extNumber: item.extNumber,
  //         extDate: moment(item.extDate).format('L'),
  //         needAnswer: item.needAnswer,
  //         type: item.Type ? item.Type.name : null,
  //         typeId: item.Type ? item.Type.id : null,
  //         state: item.State ? item.State.name : null,
  //         stateId: item.State ? item.State.id : null,
  //         incNumber: currentDep ? currentDep.depPrefix + '/' + item.incNumber : item.incNumber,
  //         incNumberDigit: item.incNumber || null,
  //         incDate: moment(item.incDate).format('L'),
  //         temas: curTemas.join('\n'),
  //         temasId: curTemasId,
  //         author: item.author.length ? item.author[0].Employee.secondName + ' ' + item.author[0].Employee.firstName[0] + '.' + item.author[0].Employee.middleName[0] + '.' : '',
  //         authorId: item.author.length ? item.author[0].id : null,
  //         podpisants: podpisantsName.length ? podpisantsName.join('\n') : '',
  //         podpisantsId,
  //         addressee: addresseeNames.join('\n'),
  //         addresseeId,
  //         answers: answers.join('\n'),
  //         answersId,
  //         sourceOutgoing,
  //         sourceOutgoingId,
  //         resolutions: resIds,
  //         Files: intIncFiles.join('\n'),
  //         FilesId: intIncFilesId
  //       }
  //     }
  //     console.timeEnd('Fetching IntIncoming')
  //     // console.log(IntIncomingRequests)
  //     return IntIncomingRequests
  //   } catch (err) {
  //     throw err
  //   }
  // },
  // -------------------------------------------------------------------------------------------------------------------------------------------------------
  // async getIntOutgoingRequest ({ id }) {
  //   try {
  //     console.time('Fetching IntOutgoings')
  //     const IntOutgoingRequests = []
  //     const output = await Docs.IntOutgoing.findAll({
  //       attributes: [
  //         'id',
  //         'outNumber',
  //         'outDate',
  //         'subject'
  //       ],
  //       include: [
  //         // Исполнитель
  //         {
  //           model: Docs.CurrentPosition,
  //           as: 'author',
  //           where: {
  //             DepartmentId: id
  //           },
  //           attributes: [
  //             'id'
  //           ],
  //           include: [
  //             // Служащий
  //             {
  //               model: Docs.Employee,
  //               attributes: [
  //                 'id',
  //                 'firstName',
  //                 'secondName',
  //                 'middleName'
  //               ]
  //             },
  //             // Отдел
  //             {
  //               model: Docs.Department,
  //               attributes: [
  //                 'id',
  //                 'shortName',
  //                 'depPrefix'
  //               ]
  //             }
  //           ]
  //         },
  //         // Состояние
  //         {
  //           model: Docs.State,
  //           attributes: [
  //             'id',
  //             'name'
  //           ]
  //         },
  //         // Адресаты
  //         {
  //           model: Docs.CurrentPosition,
  //           as: 'addressee',
  //           attributes: [
  //             'id'
  //           ],
  //           include: [
  //             // Служащий
  //             {
  //               model: Docs.Employee,
  //               attributes: [
  //                 'id',
  //                 'firstName',
  //                 'secondNameDat',
  //                 'secondName',
  //                 'middleName'
  //               ]
  //             },
  //             // Отдел
  //             {
  //               model: Docs.Department,
  //               attributes: [
  //                 'id',
  //                 'shortName',
  //                 'depPrefix'
  //               ]
  //             },
  //             // Должность
  //             {
  //               model: Docs.Position,
  //               attributes: [
  //                 'id',
  //                 'posName',
  //                 'posNameDat'
  //               ]
  //             }
  //           ]
  //         },
  //         // Тип документа
  //         {
  //           model: Docs.Type,
  //           attributes: [
  //             'id',
  //             'name'
  //           ]
  //         },
  //         // Тема
  //         {
  //           model: Docs.Tema,
  //           attributes: [
  //             'id',
  //             'name'
  //           ],
  //           through: {
  //             attributes: []
  //           }
  //         },
  //         // Подписанты
  //         {
  //           model: Docs.CurrentPosition,
  //           as: 'podpisant',
  //           attributes: [
  //             'id',
  //             'intPrefix'
  //           ],
  //           through: {
  //             attributes: []
  //           },
  //           include: [
  //             // Служащий
  //             {
  //               model: Docs.Employee,
  //               attributes: [
  //                 'id',
  //                 'firstName',
  //                 'secondName',
  //                 'middleName'
  //               ]
  //             },
  //             // Отдел
  //             {
  //               model: Docs.Department,
  //               attributes: [
  //                 'id',
  //                 'shortName'
  //               ]
  //             },
  //             // Должность
  //             {
  //               model: Docs.Position,
  //               attributes: [
  //                 'id',
  //                 'posName'
  //               ]
  //             }
  //           ]
  //         },
  //         // Файлы
  //         {
  //           model: Docs.IntOutFile,
  //           attributes: [
  //             'id',
  //             'file'
  //           ]
  //         },
  //         // Ответ на
  //         {
  //           model: Docs.IntIncoming,
  //           as: 'answer',
  //           attributes: [
  //             'id',
  //             'extNumber',
  //             'extDate'
  //           ],
  //           through: {
  //             attributes: []
  //           }
  //         }
  //       ]
  //     })
  //     // console.log(JSON.stringify(output, null, 2))
  //     const fetchedData = JSON.parse(JSON.stringify(output, null, 2))
  //     for (let i = 0; i < fetchedData.length; i++) {
  //       const item = fetchedData[i]
  //       const curAdsress = []
  //       const curAdsressId = []
  //       const curTemas = []
  //       const curTemasId = []
  //       const curFiles = []
  //       const curFilesId = []
  //       const curAnswers = []
  //       const curAnswersId = []
  //       const curPodp = []
  //       const curPodpId = []
  //       item.addressee.forEach((addr) => {
  //         curAdsressId.push(addr.id)
  //         const name = addr.Employee.secondName + ' ' + addr.Employee.firstName[0] + '.' + addr.Employee.middleName[0] + '.'
  //         curAdsress.push(`${name} ${addr.Position.posName} (${addr.Department.shortName})`)
  //       })
  //       item.Temas.forEach((tema) => {
  //         curTemas.push(tema.name)
  //         curTemasId.push(tema.id)
  //       })
  //       item.podpisant.forEach((podp) => {
  //         const name = `${podp.Employee ? podp.Employee.secondName : ''} ${podp.Employee ? podp.Employee.firstName[0] : ''}.${podp.Employee ? podp.Employee.middleName[0] : ''}.`
  //         curPodp.push(`${name} ${podp.Position ? podp.Position.posName : ''} (${podp.Department ? podp.Department.shortName : ''})`)
  //         curPodpId.push(podp.id)
  //       })
  //       item.IntOutFiles.forEach((file) => {
  //         curFilesId.push(file.id)
  //         curFiles.push(file.file)
  //       })
  //       item.answer.forEach((el) => {
  //         curAnswersId.push(el.id)
  //         const date = moment(el.extDate).format('L')
  //         curAnswers.push(`№${el.extNumber} от ${date}`)
  //       })
  //       IntOutgoingRequests[i] = {
  //         id: item.id,
  //         outNumber: item.author ? item.author.Department.depPrefix + '/' + item.outNumber : item.outNumber,
  //         outNumberDigit: item.outNumber || null,
  //         outDate: moment(item.outDate),
  //         subject: item.subject,
  //         author: item.author ? item.author.Employee.secondName + ' ' + item.author.Employee.firstName[0] + '.' + item.author.Employee.middleName[0] + '.' : null,
  //         authorId: item.author ? item.author.id : null,
  //         type: item.Type ? item.Type.name : null,
  //         typeId: item.Type ? item.Type.id : null,
  //         state: item.State ? item.State.name : null,
  //         stateId: item.State ? item.State.id : null,
  //         podpisants: curPodp.join(`\n`),
  //         podpisantsId: curPodpId,
  //         addressees: curAdsress.length ? curAdsress.join(`\n`) : null,
  //         addresseesId: curAdsressId,
  //         temas: curTemas.length ? curTemas.join(`\n`) : null,
  //         temasId: curTemasId,
  //         department: item.author ? item.author.Department.shortName : '',
  //         departmentId: item.author ? item.author.Department.id : null,
  //         files: curFiles,
  //         filesId: curFilesId,
  //         isAnswerOn: curAnswers.length ? curAnswers.join(`\n`) : null,
  //         isAnswerOnId: curAnswersId
  //       }
  //     }
  //     console.timeEnd('Fetching IntOutgoings')
  //     return IntOutgoingRequests
  //   } catch (err) {
  //     throw err
  //   }
  // },
  // -------------------------------------------------------------------------------------------------------
  // Состояние документа в отделе
  async getExtIncStateP ({ id }) {
    try {
      return await this.formExtIncStateP(await extIncState1.getExtIncState({ id }))
    } catch (err) {
      throw err
    }
  },

  async getAllExtIncStateP () {
    try {
      return await this.formArrayExtIncStateP(await extIncState1.getAllExtIncState())
    } catch (err) {
      throw err
    }
  },

  async getAllExtIncStateByExtIncomingP ({ id }) {
    try {
      return await this.formArrayExtIncStateP(await extIncState1.getAllExtIncStateByExtIncoming({ id }))
    } catch (err) {
      throw err
    }
  },

  async getExtIncStateInDepartmentsP ({ id, depsId }) {
    try {
      return await this.formArrayExtIncStateP(await extIncState1.getExtIncStateInDepartments({ id, depsId }))
    } catch (err) {
      throw err
    }
  },
  // -------------------------------------------------------------------------------------------------------
  // Внешний исходящий документ
  async getExtOutgoingP ({ id }) {
    try {
      return await this.formExtOutgoingP(await extOutgoing1.getAllExtOutgoing({ id }))
    } catch (err) {
      throw err
    }
  },

  async getAllExtOutgoingP () {
    try {
      return await this.formArrayExtOutgoingP(await extOutgoing1.getAllExtOutgoing())
    } catch (err) {
      throw err
    }
  },

  async getAllExtOutgoingInDepartmentP ({ id }) {
    try {
      return await this.formArrayExtOutgoingP(await extOutgoing1.getAllExtOutgoingInDepartment({ id }))
    } catch (err) {
      throw err
    }
  },

  async getExtOutgoingByTemaP ({ id }) {
    try {
      return await this.formArrayExtOutgoingP(await tema1.getExtOutgoingByTema({ id }))
    } catch (err) {
      throw err
    }
  },

  // -------------------------------------------------------------------------------------------------------
  // Внутренний входящий документ
  async getIntIncomingP ({ id }) {
    try {
      return await this.formIntIncomingP(await intIncoming1.getIntIncoming({ id }))
    } catch (err) {
      throw err
    }
  },

  async getAllIntIncomingP () {
    try {
      return await this.formArrayIntIncomingP(await intIncoming1.getAllIntIncoming())
    } catch (err) {
      throw err
    }
  },

  async getAllIntIncomingInDepartmentP ({ id }) {
    try {
      return await this.formArrayIntIncomingP(await intIncoming1.getAllIntIncomingInDepartment({ id }))
    } catch (err) {
      throw err
    }
  },

  async getIntIncomingByTemaP ({ id }) {
    try {
      return await this.formArrayIntIncomingP(await tema1.getIntIncomingByTema({ id }))
    } catch (err) {
      throw err
    }
  },

  // -------------------------------------------------------------------------------------------------------
  // Внутренний Исходящий документ
  async getIntOutgoingP ({ id }) {
    try {
      return await this.formIntOutgoingP(await intOutgoing1.getIntOutgoing({ id }))
    } catch (err) {
      throw err
    }
  },

  async getAllIntOutgoingP () {
    try {
      return await this.formArrayIntOutgoingP(await intOutgoing1.getAllIntOutgoing())
    } catch (err) {
      throw err
    }
  },

  async getAllIntOutgoingInDepartmentP ({ id }) {
    try {
      return await this.formArrayIntOutgoingP(await intOutgoing1.getAllIntOutgoingInDepartment({ id }))
    } catch (err) {
      throw err
    }
  },

  async getIntOutgoingByTemaP ({ id }) {
    try {
      return await this.formArrayIntOutgoingP(await tema1.getIntOutgoingByTema({ id }))
    } catch (err) {
      throw err
    }
  },

  // -------------------------------------------------------------------------------------------------------
  // Внутренний документ
  async getInternalP ({ id }) {
    try {
      return await this.formInternalP(await internal1.getInternal({ id }))
    } catch (err) {
      throw err
    }
  },

  async getAllInternalP () {
    try {
      return await this.formArrayInternalP(await internal1.getAllInternal())
    } catch (err) {
      throw err
    }
  },

  async getAllInternalInDepartmentP ({ id }) {
    try {
      return await this.formArrayInternalP(await internal1.getAllInternalInDepartment({ id }))
    } catch (err) {
      throw err
    }
  },

  async getAllInternalInDepartmentByAuthorP ({ id }) {
    try {
      return await this.formArrayInternalP(await internal1.getAllInternalInDepartmentByAuthor({ id }))
    } catch (err) {
      throw err
    }
  },

  async getInternalByTemaP ({ id }) {
    try {
      return await this.formArrayInternalP(await tema1.getInternalByTema({ id }))
    } catch (err) {
      throw err
    }
  }

}
