const Docs = require('../../../models/docs')
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
// const extOutFile1 = require('./docs/ext-out-file')
// const intIncFile1 = require('./docs/int-inc-file')
// const intOutFile1 = require('./docs/int-out-file')
// const internalFile1 = require('./docs/internal-file')
const extOutgoing1 = require('./ext-outgoing')
const intIncoming1 = require('./int-incoming')
const intOutgoing1 = require('./int-outgoing')
const internal1 = require('./internal')
const incomingNumber1 = require('./incoming-number')
const extIncState1 = require('./ext-inc-state')

module.exports = {
// -------------------------------------------------------------------------------------------------------
// Функции по формированию популяризированных объектов
  async formEmployeeP (employee) {
    return employee ? {
      id: employee.id,
      firstName: employee.firstName,
      secondName: employee.secondName,
      middleName: employee.middleName,
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

  async getExtIncomingRequest ({ id }) {
    try {
      const extIncomings = await extIncoming1.getAllExtIncomingInDepartment({ id })
      const ExtIncomingRequests = []
      const department = await department1.getDepartment({ id })
      for (const item of extIncomings) {
        const currentType = item.TypeId ? await type1.getType({ id: item.TypeId }) : null
        const currentExtIncState = await extIncState1.getExtIncStateInDepartments({ id: item.id, depsId: id })
        const currentState = await state1.getState({ id: currentExtIncState[0].StateId })
        const currentIncNumber = await incomingNumber1.getIncomingNumberInDepartment({ id: item.id, depId: id })
        const currentTemas = await extIncoming1.getExtIncomingTemas({ id: item.id })
        const temasNames = []
        const temasIds = []
        for (const tema of currentTemas) {
          temasNames.push(tema.name)
          temasIds.push(tema.id)
        }
        const currentAuthors = await extIncoming1.getExtIncomingAuthors({ id: item.id })
        const authorsNames = []
        const authorsIds = []
        for (const name of currentAuthors) {
          authorsNames.push(name.secondName + name.firstName[0] + name.middleName[0])
          authorsIds.push(name.id)
        }
        const currentOrganisations = await extIncoming1.getExtIncomingOrganisations({ id: item.id })
        const orgNames = []
        const OrganisationIds = []
        for (const org of currentOrganisations) {
          orgNames.push(org.orgName)
          OrganisationIds.push(org.id)
        }
        const extIncFiles = []
        const extIncFilesId = []
        const files = await extIncoming1.getExtIncomingFile({ id: item.id })
        for (const file of files) {
          extIncFiles.push(file.file)
          extIncFilesId.push(file.id)
        }
        ExtIncomingRequests.push({
          id: item.id,
          subject: item.subject,
          extNumber: item.extNumber,
          extDate: item.extDate,
          needAnswer: item.needAnswer,
          type: currentType ? currentType.name : null,
          TypeId: item.TypeId,
          state: currentState ? currentState.name : null,
          extIncStateId: currentState ? currentState.id : null,
          incNumber: currentIncNumber ? department.depPrefix + '/' + currentIncNumber.incNumber : null,
          incDate: currentIncNumber ? currentIncNumber.incDate : null,
          extIncNumberId: currentIncNumber ? currentIncNumber.id : null,
          temas: temasNames.join('\n'),
          temasId: temasIds,
          authors: authorsNames.join('\n'),
          authorsId: authorsIds,
          Organisation: orgNames.join('\n'),
          OrganisationId: OrganisationIds,
          Files: extIncFiles.join('\n'),
          FilesId: extIncFilesId
        })
      }
      return ExtIncomingRequests
    } catch (err) {
      throw err
    }
  },

  async getExtOutgoingRequest ({ id }) {
    try {
      const ExtOutgoingRequests = []
      const extOutgoings = await extOutgoing1.getAllExtOutgoingInDepartment({ id }) || {}
      for (const item of extOutgoings) {
        const currentAuthor = item.authorId
          ? await Docs.Employee.findByPk(item.authorId)
          : null
        const currentType = item.typeId
          ? await Docs.Type.findByPk(item.typeId)
          : null
        const currentState = item.stateId
          ? await Docs.State.findByPk(item.stateId)
          : null
        const currentAddressees = await extOutgoing1.getExtOutgoingExtEmployees({ id: item.id }) || {}
        let curAdsress = []
        const curAdsressId = []
        for (const el of currentAddressees) {
          curAdsressId.push(el.id)
          curAdsress.push(el.secondName + el.firstName[0] + el.middleName[0])
        }
        const currentTemas = await extOutgoing1.getExtOutgoingTemas({ id: item.id }) || {}
        let curTemas = []
        const curTemasId = []
        for (const el of currentTemas) {
          curTemas.push(el.id)
          curTemasId.push(el.name)
        }
        ExtOutgoingRequests.push({
          id: item.id,
          outNumber: item.outNumber,
          outDate: item.outDate,
          subject: item.subject,
          author: currentAuthor ? currentAuthor.secondName + currentAuthor.firstName[0] + currentAuthor.middleName[0] : null,
          authorId: item.authorId,
          type: currentType ? currentType.name : null,
          typeId: item.typeId,
          state: currentState ? currentState.name : null,
          stateId: item.stateId,
          addressees: curAdsress.length ? curAdsress.join('\n') : null,
          addresseesId: curAdsressId,
          temas: curTemas.length ? curTemas.join('\n') : null,
          temasId: curTemasId,
          organisations: '',
          organisationsId: item.,
          department: '',
          departmentId: item.,
          files: '',
          filesId: item.,
          isAnswerOn: '',
          isAnswerOnId: item.
        })
      }
    } catch (err) {
      throw err
    }
  },
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
