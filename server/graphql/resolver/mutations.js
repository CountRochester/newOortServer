// const entity = require('./fetch-time/entity')
const fetchTime = require('./fetch-time/module')

const fetchTimeArray = fetchTime.getInstance()

const rootResolver = require('./index')

console.log(fetchTimeArray)

const resetMemo = (fun) => {
  const output = (...args) => {
    rootResolver.resetExtIncReqMemo()
    rootResolver.resetExtOutReqMemo()
    rootResolver.resetIntIncReqMemo()
    rootResolver.resetIntOutReqMemo()
    return fun(...args)
  }
  return output
}

// const entityMutations = {}

const allEtityMutations = {
  addContract: rootResolver.addContract,
  editContract: rootResolver.editContract,
  deleteContract: rootResolver.deleteContract,
  addTema: rootResolver.addTema,
  editTema: rootResolver.editTema,
  deleteTema: rootResolver.deleteTema,
  addOrganisation: rootResolver.addOrganisation,
  editOrganisation: rootResolver.editOrganisation,
  deleteOrganisation: rootResolver.deleteOrganisation,
  addState: rootResolver.addState,
  editState: rootResolver.editState,
  deleteState: rootResolver.deleteState,
  addType: rootResolver.addType,
  editType: rootResolver.editType,
  deleteType: rootResolver.deleteType,
  addPosition: rootResolver.addPosition,
  editPosition: rootResolver.editPosition,
  deletePosition: rootResolver.deletePosition,
  addDepartment: rootResolver.addDepartment,
  editDepartment: rootResolver.editDepartment,
  editDepartmentChilds: rootResolver.editDepartmentChilds,
  deleteDepartment: rootResolver.deleteDepartment,
  addSubdivision: rootResolver.addSubdivision,
  editSubdivision: rootResolver.editSubdivision,
  deleteSubdivision: rootResolver.deleteSubdivision,
  addCurrentPosition: rootResolver.addCurrentPosition,
  editCurrentPosition: rootResolver.editCurrentPosition,
  deleteCurrentPosition: rootResolver.deleteCurrentPosition,
  addExtCurrentPosition: rootResolver.addExtCurrentPosition,
  editExtCurrentPosition: rootResolver.editExtCurrentPosition,
  deleteExtCurrentPosition: rootResolver.deleteExtCurrentPosition,
  addEmployee: rootResolver.addEmployee,
  editEmployee: rootResolver.editEmployee,
  deleteEmployee: rootResolver.deleteEmployee,
  addExtEmployee: rootResolver.addExtEmployee,
  editExtEmployee: rootResolver.editExtEmployee,
  deleteExtEmployee: rootResolver.deleteExtEmployee,
  addExtIncoming: rootResolver.addExtIncoming,
  editExtIncoming: rootResolver.editExtIncoming,
  deleteExtIncoming: rootResolver.deleteExtIncoming,
  setNextStateExtIncoming: rootResolver.setNextStateExtIncoming,
  setPreviousStateExtIncoming: rootResolver.setPreviousStateExtIncoming,
  sendExtIncomingToExecs: rootResolver.sendExtIncomingToExecs,
  publicateExtIncoming: rootResolver.publicateExtIncoming,
  addExtOutgoing: rootResolver.addExtOutgoing,
  editExtOutgoing: rootResolver.editExtOutgoing,
  deleteExtOutgoing: rootResolver.deleteExtOutgoing,
  addNoteToExtOutgoing: rootResolver.addNoteToExtOutgoing,
  setStateExtOutgoing: rootResolver.setStateExtOutgoing,
  setNextStateExtOutgoing: rootResolver.setNextStateExtOutgoing,
  setPreviousStateExtOutgoing: rootResolver.setPreviousStateExtOutgoing,
  publicateExtOutgoing: rootResolver.publicateExtOutgoing,
  addIntIncoming: rootResolver.addIntIncoming,
  editIntIncoming: rootResolver.editIntIncoming,
  deleteIntIncoming: rootResolver.deleteIntIncoming,
  setNextStateIntIncoming: rootResolver.setNextStateIntIncoming,
  setPreviousStateIntIncoming: rootResolver.setPreviousStateIntIncoming,
  sendIntIncomingToExecs: rootResolver.sendIntIncomingToExecs,
  publicateIntIncoming: rootResolver.publicateIntIncoming,
  addIntOutgoing: rootResolver.addIntOutgoing,
  editIntOutgoing: rootResolver.editIntOutgoing,
  deleteIntOutgoing: rootResolver.deleteIntOutgoing,
  addNoteToIntOutgoing: rootResolver.addNoteToIntOutgoing,
  setNextStateIntOutgoing: rootResolver.setNextStateIntOutgoing,
  setPreviousStateIntOutgoing: rootResolver.setPreviousStateIntOutgoing,
  setStateIntOutgoing: rootResolver.setStateIntOutgoing,
  sendIntOutgoing: rootResolver.sendIntOutgoing,
  publicateIntOutgoing: rootResolver.publicateIntOutgoing,
  addInternal: rootResolver.addInternal,
  editInternal: rootResolver.editInternal,
  deleteInternal: rootResolver.deleteInternal,
  setNextStateInternal: rootResolver.setNextStateInternal,
  setPreviousStateInternal: rootResolver.setPreviousStateInternal,
  sendInternalToExecs: rootResolver.sendInternalToExecs,
  publicateInternal: rootResolver.publicateInternal,
  addIncomingNumber: rootResolver.addIncomingNumber,
  editIncomingNumber: rootResolver.editIncomingNumber,
  deleteIncomingNumber: rootResolver.deleteIncomingNumber,
  addIntIncomingNumber: rootResolver.addIntIncomingNumber,
  editIntIncomingNumber: rootResolver.editIntIncomingNumber,
  deleteIntIncomingNumber: rootResolver.deleteIntIncomingNumber,
  addInternalIncomingNumber: rootResolver.addInternalIncomingNumber,
  editInternalIncomingNumber: rootResolver.editInternalIncomingNumber,
  deleteInternalIncomingNumber: rootResolver.deleteInternalIncomingNumber,
  addExtIncFile: rootResolver.addExtIncFile,
  editExtIncFile: rootResolver.editExtIncFile,
  attachFilesToExtInc: rootResolver.attachFilesToExtInc,
  deleteExtIncFile: rootResolver.deleteExtIncFile,
  deleteExtIncFiles: rootResolver.deleteExtIncFiles,
  addExtOutFile: rootResolver.addExtOutFile,
  editExtOutFile: rootResolver.editExtOutFile,
  attachFilesToExtOut: rootResolver.attachFilesToExtOut,
  deleteExtOutFile: rootResolver.deleteExtOutFile,
  deleteExtOutFiles: rootResolver.deleteExtOutFiles,
  addIntIncFile: rootResolver.addIntIncFile,
  editIntIncFile: rootResolver.editIntIncFile,
  attachFilesToIntInc: rootResolver.attachFilesToIntInc,
  deleteIntIncFile: rootResolver.deleteIntIncFile,
  deleteIntIncFiles: rootResolver.deleteIntIncFiles,
  addIntOutFile: rootResolver.addIntOutFile,
  editIntOutFile: rootResolver.editIntOutFile,
  deleteIntOutFile: rootResolver.deleteIntOutFile,
  attachFilesToIntOut: rootResolver.attachFilesToIntOut,
  deleteIntOutFiles: rootResolver.deleteIntOutFiles,
  addInternalFile: rootResolver.addInternalFile,
  editInternalFile: rootResolver.editInternalFile,
  attachFilesToInternal: rootResolver.attachFilesToInternal,
  deleteInternalFile: rootResolver.deleteInternalFile,
  deleteInternalFiles: rootResolver.deleteInternalFiles,
  addExtIncState: rootResolver.addExtIncState,
  editExtIncState: rootResolver.editExtIncState,
  deleteExtIncState: rootResolver.deleteExtIncState,
  addExtIncStateToDocument: rootResolver.addExtIncStateToDocument,
  addIntIncState: rootResolver.addIntIncState,
  editIntIncState: rootResolver.editIntIncState,
  deleteIntIncState: rootResolver.deleteIntIncState,
  addIntIncStateToDocument: rootResolver.addIntIncStateToDocument,
  addInternalIncState: rootResolver.addInternalIncState,
  editInternalIncState: rootResolver.editInternalIncState,
  deleteInternalIncState: rootResolver.deleteInternalIncState,
  addInternalIncStateToDocument: rootResolver.addInternalIncStateToDocument,
  addResolution: rootResolver.addResolution,
  editResolution: rootResolver.editResolution,
  comleteResolution: rootResolver.comleteResolution,
  deleteResolution: rootResolver.deleteResolution
}

// entityMutations.contracts = {
//   addContract: rootResolver.addContract,
//   editContract: rootResolver.editContract,
//   deleteContract: rootResolver.deleteContract
// }

// entityMutations.temas = {
//   addTema: rootResolver.addTema,
//   editTema: rootResolver.editTema,
//   deleteTema: rootResolver.deleteTema
// }

// entityMutations.organisations = {
//   addOrganisation: rootResolver.addOrganisation,
//   editOrganisation: rootResolver.editOrganisation,
//   deleteOrganisation: rootResolver.deleteOrganisation
// }

// entityMutations.states = {
//   addState: rootResolver.addState,
//   editState: rootResolver.editState,
//   deleteState: rootResolver.deleteState
// }

// entityMutations.types = {
//   addType: rootResolver.addType,
//   editType: rootResolver.editType,
//   deleteType: rootResolver.deleteType
// }

// entityMutations.positions = {
//   addPosition: rootResolver.addPosition,
//   editPosition: rootResolver.editPosition,
//   deletePosition: rootResolver.deletePosition
// }

// entityMutations.departments = {
//   addDepartment: rootResolver.addDepartment,
//   editDepartment: rootResolver.editDepartment,
//   editDepartmentChilds: rootResolver.editDepartmentChilds,
//   deleteDepartment: rootResolver.deleteDepartment
// }

// entityMutations.subdivisions = {
//   addSubdivision: rootResolver.addSubdivision,
//   editSubdivision: rootResolver.editSubdivision,
//   deleteSubdivision: rootResolver.deleteSubdivision
// }

// entityMutations.currentPositions = {
//   addCurrentPosition: rootResolver.addCurrentPosition,
//   editCurrentPosition: rootResolver.editCurrentPosition,
//   deleteCurrentPosition: rootResolver.deleteCurrentPosition
// }

// entityMutations.extCurrentPositions = {
//   addExtCurrentPosition: rootResolver.addExtCurrentPosition,
//   editExtCurrentPosition: rootResolver.editExtCurrentPosition,
//   deleteExtCurrentPosition: rootResolver.deleteExtCurrentPosition
// }

// entityMutations.employees = {
//   addEmployee: rootResolver.addEmployee,
//   editEmployee: rootResolver.editEmployee,
//   deleteEmployee: rootResolver.deleteEmployee
// }

// entityMutations.extEmployees = {
//   addExtEmployee: rootResolver.addExtEmployee,
//   editExtEmployee: rootResolver.editExtEmployee,
//   deleteExtEmployee: rootResolver.deleteExtEmployee
// }

// entityMutations.extIncomings = {
//   addExtIncoming: rootResolver.addExtIncoming,
//   editExtIncoming: rootResolver.editExtIncoming,
//   deleteExtIncoming: rootResolver.deleteExtIncoming,
//   setNextStateExtIncoming: rootResolver.setNextStateExtIncoming,
//   setPreviousStateExtIncoming: rootResolver.setPreviousStateExtIncoming,
//   sendExtIncomingToExecs: rootResolver.sendExtIncomingToExecs,
//   publicateExtIncoming: rootResolver.publicateExtIncoming
// }

// entityMutations.extOutgoings = {
//   addExtOutgoing: rootResolver.addExtOutgoing,
//   editExtOutgoing: rootResolver.editExtOutgoing,
//   deleteExtOutgoing: rootResolver.deleteExtOutgoing,
//   addNoteToExtOutgoing: rootResolver.addNoteToExtOutgoing,
//   setStateExtOutgoing: rootResolver.setStateExtOutgoing,
//   setNextStateExtOutgoing: rootResolver.setNextStateExtOutgoing,
//   setPreviousStateExtOutgoing: rootResolver.setPreviousStateExtOutgoing,
//   publicateExtOutgoing: rootResolver.publicateExtOutgoing
// }

// entityMutations.intIncomings = {
//   addIntIncoming: rootResolver.addIntIncoming,
//   editIntIncoming: rootResolver.editIntIncoming,
//   deleteIntIncoming: rootResolver.deleteIntIncoming,
//   setNextStateIntIncoming: rootResolver.setNextStateIntIncoming,
//   setPreviousStateIntIncoming: rootResolver.setPreviousStateIntIncoming,
//   sendIntIncomingToExecs: rootResolver.sendIntIncomingToExecs,
//   publicateIntIncoming: rootResolver.publicateIntIncoming
// }

// entityMutations.intOutgoings = {
//   addIntOutgoing: rootResolver.addIntOutgoing,
//   editIntOutgoing: rootResolver.editIntOutgoing,
//   deleteIntOutgoing: rootResolver.deleteIntOutgoing,
//   addNoteToIntOutgoing: rootResolver.addNoteToIntOutgoing,
//   setNextStateIntOutgoing: rootResolver.setNextStateIntOutgoing,
//   setPreviousStateIntOutgoing: rootResolver.setPreviousStateIntOutgoing,
//   setStateIntOutgoing: rootResolver.setStateIntOutgoing,
//   sendIntOutgoing: rootResolver.sendIntOutgoing,
//   publicateIntOutgoing: rootResolver.publicateIntOutgoing
// }

// entityMutations.internals = {
//   addInternal: rootResolver.addInternal,
//   editInternal: rootResolver.editInternal,
//   deleteInternal: rootResolver.deleteInternal,
//   setNextStateInternal: rootResolver.setNextStateInternal,
//   setPreviousStateInternal: rootResolver.setPreviousStateInternal,
//   sendInternalToExecs: rootResolver.sendInternalToExecs,
//   publicateInternal: rootResolver.publicateInternal
// }

// entityMutations.incNumbers = {
//   addIncomingNumber: rootResolver.addIncomingNumber,
//   editIncomingNumber: rootResolver.editIncomingNumber,
//   deleteIncomingNumber: rootResolver.deleteIncomingNumber
// }

// entityMutations.intIncNumbers = {
//   addIntIncomingNumber: rootResolver.addIntIncomingNumber,
//   editIntIncomingNumber: rootResolver.editIntIncomingNumber,
//   deleteIntIncomingNumber: rootResolver.deleteIntIncomingNumber
// }

// entityMutations.internalIncNumbers = {
//   addInternalIncomingNumber: rootResolver.addInternalIncomingNumber,
//   editInternalIncomingNumber: rootResolver.editInternalIncomingNumber,
//   deleteInternalIncomingNumber: rootResolver.deleteInternalIncomingNumber
// }

// entityMutations.extIncFiles = {
//   addExtIncFile: rootResolver.addExtIncFile,
//   editExtIncFile: rootResolver.editExtIncFile,
//   attachFilesToExtInc: rootResolver.attachFilesToExtInc,
//   deleteExtIncFile: rootResolver.deleteExtIncFile,
//   deleteExtIncFiles: rootResolver.deleteExtIncFiles
// }

// entityMutations.extOutFiles = {
//   addExtOutFile: rootResolver.addExtOutFile,
//   editExtOutFile: rootResolver.editExtOutFile,
//   attachFilesToExtOut: rootResolver.attachFilesToExtOut,
//   deleteExtOutFile: rootResolver.deleteExtOutFile,
//   deleteExtOutFiles: rootResolver.deleteExtOutFiles
// }

// entityMutations.intIncFiles = {
//   addIntIncFile: rootResolver.addIntIncFile,
//   editIntIncFile: rootResolver.editIntIncFile,
//   attachFilesToIntInc: rootResolver.attachFilesToIntInc,
//   deleteIntIncFile: rootResolver.deleteIntIncFile,
//   deleteIntIncFiles: rootResolver.deleteIntIncFiles
// }

// entityMutations.intOutFiles = {
//   addIntOutFile: rootResolver.addIntOutFile,
//   editIntOutFile: rootResolver.editIntOutFile,
//   deleteIntOutFile: rootResolver.deleteIntOutFile,
//   attachFilesToIntOut: rootResolver.attachFilesToIntOut,
//   deleteIntOutFiles: rootResolver.deleteIntOutFiles
// }

// entityMutations.internalFiles = {
//   addInternalFile: rootResolver.addInternalFile,
//   editInternalFile: rootResolver.editInternalFile,
//   attachFilesToInternal: rootResolver.attachFilesToInternal,
//   deleteInternalFile: rootResolver.deleteInternalFile,
//   deleteInternalFiles: rootResolver.deleteInternalFiles
// }

// entityMutations.extIncStates = {
//   addExtIncState: rootResolver.addExtIncState,
//   editExtIncState: rootResolver.editExtIncState,
//   deleteExtIncState: rootResolver.deleteExtIncState,
//   addExtIncStateToDocument: rootResolver.addExtIncStateToDocument
// }

// entityMutations.intIncStates = {
//   addIntIncState: rootResolver.addIntIncState,
//   editIntIncState: rootResolver.editIntIncState,
//   deleteIntIncState: rootResolver.deleteIntIncState,
//   addIntIncStateToDocument: rootResolver.addIntIncStateToDocument
// }

// entityMutations.internalIncStates = {
//   addInternalIncState: rootResolver.addInternalIncState,
//   editInternalIncState: rootResolver.editInternalIncState,
//   deleteInternalIncState: rootResolver.deleteInternalIncState,
//   addInternalIncStateToDocument: rootResolver.addInternalIncStateToDocument
// }

// entityMutations.resolutions = {
//   addResolution: rootResolver.addResolution,
//   editResolution: rootResolver.editResolution,
//   comleteResolution: rootResolver.comleteResolution,
//   deleteResolution: rootResolver.deleteResolution
// }

const mutations = {
  editUser: rootResolver.editUser,
  login: rootResolver.login,
  addUser: rootResolver.addUser,
  deleteUser: rootResolver.deleteUser,
  addGroup: rootResolver.addGroup,
  editGroup: rootResolver.editGroup,
  assignUsersToGroup: rootResolver.assignUsersToGroup,
  assignUserToGroups: rootResolver.assignUserToGroups,
  removeUsersFromGroup: rootResolver.removeUsersFromGroup,
  removeUserFromAllGroups: rootResolver.removeUserFromAllGroups,
  deleteGroup: rootResolver.deleteGroup,

  addExtIncNote: rootResolver.addExtIncNote,
  editExtIncNote: rootResolver.editExtIncNote,
  deleteExtIncNote: rootResolver.deleteExtIncNote,

  addIntIncNote: rootResolver.addIntIncNote,
  editIntIncNote: rootResolver.editIntIncNote,
  deleteIntIncNote: rootResolver.deleteIntIncNote,

  addInternalNote: rootResolver.addInternalNote,
  editInternalNote: rootResolver.editInternalNote,
  deleteInternalNote: rootResolver.deleteInternalNote,
  deleteUploadedFiles: rootResolver.deleteUploadedFiles,

  ...allEtityMutations
}

const memoMutations = {}

for (const key in mutations) {
  memoMutations[key] = resetMemo(mutations[key])
}

module.exports = memoMutations
