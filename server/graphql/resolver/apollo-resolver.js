const pubsub = require('../pubsub').getInstance()
// const entity = require('./fetch-time/entity')
const mutations = require('./mutations')
const rootResolver = require('./index')

module.exports = {
  Subscription: {
    extIncomingChanged: {
      subscribe: () => pubsub.asyncIterator('EXT_INCOMING_CHANGED')
    },
    extOutgoingChanged: {
      subscribe: () => pubsub.asyncIterator('EXT_OUTGOING_CHANGED')
    },
    intIncomingChanged: {
      subscribe: () => pubsub.asyncIterator('INT_INCOMING_CHANGED')
    },
    intOutgoingChanged: {
      subscribe: () => pubsub.asyncIterator('INT_OUTGOING_CHANGED')
    },
    internalChanged: {
      subscribe: () => pubsub.asyncIterator('INTERNAL_CHANGED')
    },
    contractChanged: {
      subscribe: () => pubsub.asyncIterator('CONTRACT_CHANGED')
    },
    currentPositionChanged: {
      subscribe: () => pubsub.asyncIterator('CURRENT_POSITION_CHANGED')
    },
    departmentChanged: {
      subscribe: () => pubsub.asyncIterator('DEPARTMENT_CHANGED')
    },
    employeeChanged: {
      subscribe: () => pubsub.asyncIterator('EMPLOYEE_CHANGED')
    },
    extCurrentPositionChanged: {
      subscribe: () => pubsub.asyncIterator('EXT_CURRENT_POSITION_CHANGED')
    },
    extEmployeeChanged: {
      subscribe: () => pubsub.asyncIterator('EXT_EMPLOYEE_CHANGED')
    },
    extIncFileChanged: {
      subscribe: () => pubsub.asyncIterator('EXT_INC_FILE_CHANGED')
    },
    extIncNoteChanged: {
      subscribe: () => pubsub.asyncIterator('EXT_INC_NOTE_CHANGED')
    },
    extIncStateChanged: {
      subscribe: () => pubsub.asyncIterator('EXT_INC_STATE_CHANGED')
    },
    extOutFileChanged: {
      subscribe: () => pubsub.asyncIterator('EXT_OUT_FILE_CHANGED')
    },
    incomingNumberChanged: {
      subscribe: () => pubsub.asyncIterator('INCOMING_NUMBER_CHANGED')
    },
    intIncFileChanged: {
      subscribe: () => pubsub.asyncIterator('INT_INC_FILE_CHANGED')
    },
    intIncNoteChanged: {
      subscribe: () => pubsub.asyncIterator('INT_INC_NOTE_CHANGED')
    },
    intIncStateChanged: {
      subscribe: () => pubsub.asyncIterator('INT_INC_STATE_CHANGED')
    },
    intIncomingNumberChanged: {
      subscribe: () => pubsub.asyncIterator('INT_INCOMING_NUMBER_CHANGED')
    },
    intOutFileChanged: {
      subscribe: () => pubsub.asyncIterator('INT_OUT_FILE_CHANGED')
    },
    internalFileChanged: {
      subscribe: () => pubsub.asyncIterator('INTERNAL_FILE_CHANGED')
    },
    internalIncStateChanged: {
      subscribe: () => pubsub.asyncIterator('INTERNAL_INC_STATE_CHANGED')
    },
    internalIncomingNumberChanged: {
      subscribe: () => pubsub.asyncIterator('INTERNAL_INCOMING_NUMBER_CHANGED')
    },
    internalNoteChanged: {
      subscribe: () => pubsub.asyncIterator('INTERNAL_NOTE_CHANGED')
    },
    organisationChanged: {
      subscribe: () => pubsub.asyncIterator('ORGANISATION_CHANGED')
    },
    positionChanged: {
      subscribe: () => pubsub.asyncIterator('POSITION_CHANGED')
    },
    resolutionChanged: {
      subscribe: () => pubsub.asyncIterator('RESOLUTION_CHANGED')
    },
    stateChanged: {
      subscribe: () => pubsub.asyncIterator('STATE_CHANGED')
    },
    subdivisionChanged: {
      subscribe: () => pubsub.asyncIterator('SUBDIVISION_CHANGED')
    },
    temaChanged: {
      subscribe: () => pubsub.asyncIterator('TEMA_CHANGED')
    },
    typeChanged: {
      subscribe: () => pubsub.asyncIterator('TYPE_CHANGED')
    },
    userChanged: {
      subscribe: () => pubsub.asyncIterator('USER_CHANGED')
    }
  },
  Query: {
    getAllUsers: rootResolver.getAllUsers,
    getUser: rootResolver.getUser,
    getAllGroups: rootResolver.getAllGroups,
    getGroup: rootResolver.getGroup,
    getUserGroups: rootResolver.getUserGroups,
    getUsersOfGroup: rootResolver.getUsersOfGroup,
    userCheckPermission: rootResolver.userCheckPermission,

    getAllContract: rootResolver.getAllContract,
    getContract: rootResolver.getContract,

    getAllCurrentPosition: rootResolver.getAllCurrentPosition,
    getCurrentPosition: rootResolver.getCurrentPosition,

    getAllDepartment: rootResolver.getAllDepartment,
    getDepartment: rootResolver.getDepartment,
    getAllChildDepartment: rootResolver.getAllChildDepartment,
    getParentDepartment: rootResolver.getParentDepartment,
    getAllDepartmentEmployees: rootResolver.getAllDepartmentEmployees,
    getAllDepartmentAndSubdivisionEmployees: rootResolver.getAllDepartmentAndSubdivisionEmployees,

    getAllEmployee: rootResolver.getAllEmployee,
    getEmployee: rootResolver.getEmployee,
    getEmployeeDepartments: rootResolver.getEmployeeDepartments,
    getEmployeeSubdivisions: rootResolver.getEmployeeSubdivisions,
    getEmployeeAllPosition: rootResolver.getEmployeeAllPosition,

    getAllExtCurrentPosition: rootResolver.getAllExtCurrentPosition,
    getExtCurrentPosition: rootResolver.getExtCurrentPosition,

    getAllExtEmployee: rootResolver.getAllExtEmployee,
    getExtEmployee: rootResolver.getExtEmployee,
    getExtEmployeeOrganisation: rootResolver.getExtEmployeeOrganisation,

    getAllExtIncFile: rootResolver.getAllExtIncFile,
    getExtIncFile: rootResolver.getExtIncFile,
    getExtIncFiles: rootResolver.getExtIncFiles,

    getExtIncNote: rootResolver.getExtIncNote,

    getAllExtIncState: rootResolver.getAllExtIncState,
    getExtIncState: rootResolver.getExtIncState,
    getExtIncStates: rootResolver.getExtIncStates,
    getAllExtIncStateByExtIncoming: rootResolver.getAllExtIncStateByExtIncoming,
    getExtIncStateInDepartments: rootResolver.getExtIncStateInDepartments,

    updateExtIncomingRequest: rootResolver.updateExtIncomingRequest,
    getExtIncomingRequest: rootResolver.getExtIncomingRequest,
    getExtIncomingRequestById: rootResolver.getExtIncomingRequestById,
    getExtIncomingRequestByIds: rootResolver.getExtIncomingRequestByIds,

    getAllExtIncoming: rootResolver.getAllExtIncoming,
    getAllExtIncomingInDepartment: rootResolver.getAllExtIncomingInDepartment,
    getExtIncoming: rootResolver.getExtIncoming,
    getExtIncomingType: rootResolver.getExtIncomingType,
    getExtIncomingResolutions: rootResolver.getExtIncomingResolutions,
    getExtIncomingTemas: rootResolver.getExtIncomingTemas,
    getExtIncomingAuthors: rootResolver.getExtIncomingAuthors,
    getExtIncomingOrganisations: rootResolver.getExtIncomingOrganisations,
    getExtIncomingDepartments: rootResolver.getExtIncomingDepartments,
    getExtIncomingFile: rootResolver.getExtIncomingFile,
    getExtIncomingAnswers: rootResolver.getExtIncomingAnswers,

    getAllExtOutFile: rootResolver.getAllExtOutFile,
    getExtOutFile: rootResolver.getExtOutFile,
    getExtOutFiles: rootResolver.getExtOutFiles,

    updateExtOutgoingRequest: rootResolver.updateExtOutgoingRequest,
    getExtOutgoingRequest: rootResolver.getExtOutgoingRequest,
    getExtOutgoingRequestById: rootResolver.getExtOutgoingRequestById,
    getExtOutgoingRequestByIds: rootResolver.getExtOutgoingRequestByIds,
    getAllExtOutgoing: rootResolver.getAllExtOutgoing,
    getAllExtOutgoingInDepartment: rootResolver.getAllExtOutgoingInDepartment,
    getExtOutgoing: rootResolver.getExtOutgoing,
    getExtOutgoingType: rootResolver.getExtOutgoingType,
    getExtOutgoingState: rootResolver.getExtOutgoingState,
    getExtOutgoingExtEmployees: rootResolver.getExtOutgoingExtEmployees,
    getExtOutgoingTemas: rootResolver.getExtOutgoingTemas,
    getExtOutgoingAuthor: rootResolver.getExtOutgoingAuthor,
    getExtOutgoingOrganisations: rootResolver.getExtOutgoingOrganisations,
    getExtOutgoingDepartment: rootResolver.getExtOutgoingDepartment,
    getExtOutgoingFiles: rootResolver.getExtOutgoingFiles,
    getExtOutgoingAnswers: rootResolver.getExtOutgoingAnswers,

    getAllIncomingNumber: rootResolver.getAllIncomingNumber,
    getIncomingNumber: rootResolver.getIncomingNumber,
    getIncomingNumbers: rootResolver.getIncomingNumbers,
    getIncomingNumberDepartment: rootResolver.getIncomingNumberDepartment,
    getIncomingNumberExtIncoming: rootResolver.getIncomingNumberExtIncoming,
    getIncomingNumberByDepartment: rootResolver.getIncomingNumberByDepartment,
    getIncomingNumberInDepartment: rootResolver.getIncomingNumberInDepartment,
    getIncomingNumberByExtIncoming: rootResolver.getIncomingNumberByExtIncoming,

    getAllIntIncFile: rootResolver.getAllIntIncFile,
    getIntIncFile: rootResolver.getIntIncFile,
    getIntIncFiles: rootResolver.getIntIncFiles,

    getIntIncNote: rootResolver.getIntIncNote,

    getAllIntIncState: rootResolver.getAllIntIncState,
    getIntIncState: rootResolver.getIntIncState,
    getIntIncStates: rootResolver.getIntIncStates,

    getAllIntIncomingNumber: rootResolver.getAllIntIncomingNumber,
    getIntIncomingNumber: rootResolver.getIntIncomingNumber,
    getIntIncomingNumbers: rootResolver.getIntIncomingNumbers,

    updateIntIncomingRequest: rootResolver.updateIntIncomingRequest,
    getIntIncomingRequest: rootResolver.getIntIncomingRequest,
    getIntIncomingRequestById: rootResolver.getIntIncomingRequestById,
    getIntIncomingRequestByIds: rootResolver.getIntIncomingRequestByIds,
    getAllIntIncoming: rootResolver.getAllIntIncoming,
    getAllIntIncomingInDepartment: rootResolver.getAllIntIncomingInDepartment,
    getIntIncoming: rootResolver.getIntIncoming,
    getIntIncomingType: rootResolver.getIntIncomingType,
    getIntIncomingState: rootResolver.getIntIncomingState,
    getIntIncomingResolutions: rootResolver.getIntIncomingResolutions,
    getIntIncomingTemas: rootResolver.getIntIncomingTemas,
    getIntIncomingPodpisants: rootResolver.getIntIncomingPodpisants,
    getIntIncomingDepartments: rootResolver.getIntIncomingDepartments,
    getIntIncomingToDepartments: rootResolver.getIntIncomingToDepartments,
    getIntIncomingFiles: rootResolver.getIntIncomingFiles,
    getIntIncomingAnswers: rootResolver.getIntIncomingAnswers,
    getIntIncomingSource: rootResolver.getIntIncomingSource,

    getAllIntOutFile: rootResolver.getAllIntOutFile,
    getIntOutFile: rootResolver.getIntOutFile,
    getIntOutFiles: rootResolver.getIntOutFiles,

    updateIntOutgoingRequest: rootResolver.updateIntOutgoingRequest,
    getIntOutgoingRequest: rootResolver.getIntOutgoingRequest,
    getIntOutgoingRequestById: rootResolver.getIntOutgoingRequestById,
    getIntOutgoingRequestByIds: rootResolver.getIntOutgoingRequestByIds,
    getAllIntOutgoing: rootResolver.getAllIntOutgoing,
    getAllIntOutgoingInDepartment: rootResolver.getAllIntOutgoingInDepartment,
    getIntOutgoing: rootResolver.getIntOutgoing,
    getIntOutgoingType: rootResolver.getIntOutgoingType,
    getIntOutgoingState: rootResolver.getIntOutgoingState,
    getIntOutgoingToDepartments: rootResolver.getIntOutgoingToDepartments,
    getIntOutgoingTemas: rootResolver.getIntOutgoingTemas,
    getIntOutgoingAuthor: rootResolver.getIntOutgoingAuthor,
    getIntOutgoingDepartment: rootResolver.getIntOutgoingDepartment,
    getIntOutgoingPodpisants: rootResolver.getIntOutgoingPodpisants,
    getIntOutgoingFiles: rootResolver.getIntOutgoingFiles,
    getIntOutgoingAnswers: rootResolver.getIntOutgoingAnswers,
    getIntOutgoingIncomings: rootResolver.getIntOutgoingIncomings,

    getAllInternalFile: rootResolver.getAllInternalFile,
    getInternalFile: rootResolver.getInternalFile,
    getInternalFiles: rootResolver.getInternalFiles,

    getAllInternalIncState: rootResolver.getAllInternalIncState,
    getInternalIncState: rootResolver.getInternalIncState,
    getInternalIncStates: rootResolver.getInternalIncStates,

    getAllInternalIncomingNumber: rootResolver.getAllInternalIncomingNumber,
    getInternalIncomingNumber: rootResolver.getInternalIncomingNumber,
    getInternalIncomingNumbers: rootResolver.getInternalIncomingNumbers,

    getInternalNote: rootResolver.getInternalNote,

    updateInternalRequest: rootResolver.updateInternalRequest,
    getInternalRequest: rootResolver.getInternalRequest,
    getInternalRequestById: rootResolver.getInternalRequestById,
    getInternalRequestByIds: rootResolver.getInternalRequestByIds,
    getAllInternal: rootResolver.getAllInternal,
    getAllInternalInDepartment: rootResolver.getAllInternalInDepartment,
    getAllInternalInDepartmentByAuthor: rootResolver.getAllInternalInDepartmentByAuthor,
    getInternal: rootResolver.getInternal,
    getInternalType: rootResolver.getInternalType,
    getInternalState: rootResolver.getInternalState,
    getInternalResolutions: rootResolver.getInternalResolutions,
    getInternalTemas: rootResolver.getInternalTemas,
    getInternalPodpisants: rootResolver.getInternalPodpisants,
    getInternalDepartments: rootResolver.getInternalDepartments,
    getInternalAuthor: rootResolver.getInternalAuthor,
    getInternalAuthorDepartment: rootResolver.getInternalAuthorDepartment,
    getInternalToDepartments: rootResolver.getInternalToDepartments,
    getInternalAttachedFiles: rootResolver.getInternalAttachedFiles,

    getAllOrganisation: rootResolver.getAllOrganisation,
    getOrganisation: rootResolver.getOrganisation,
    getOrganisationExtEmployees: rootResolver.getOrganisationExtEmployees,

    getAllPosition: rootResolver.getAllPosition,
    getPosition: rootResolver.getPosition,
    getPositionEmployees: rootResolver.getPositionEmployees,

    getAllResolution: rootResolver.getAllResolution,
    getAllResolutionsInDep: rootResolver.getAllResolutionsInDep,
    getAllResolutionsInDepE: rootResolver.getAllResolutionsInDepE,
    getResolution: rootResolver.getResolution,
    getResolutionAuthor: rootResolver.getResolutionAuthor,
    getResolutionEmployees: rootResolver.getResolutionEmployees,
    getAllDocumentsNotComplete: rootResolver.getAllDocumentsNotComplete,
    getAllDocumentsOutOfDate: rootResolver.getAllDocumentsOutOfDate,
    getAllDocumentsToDate: rootResolver.getAllDocumentsToDate,
    getAllDocumentsByResolutionAuthor: rootResolver.getAllDocumentsByResolutionAuthor,
    getResolutionsByIds: rootResolver.getResolutionsByIds,

    getAllState: rootResolver.getAllState,
    getState: rootResolver.getState,
    getExtIncomingsByState: rootResolver.getExtIncomingsByState,
    getExtOutgoingsByState: rootResolver.getExtOutgoingsByState,
    getIntIncomingsByState: rootResolver.getIntIncomingsByState,
    getIntOutgoingsByState: rootResolver.getIntOutgoingsByState,
    getInternalsByState: rootResolver.getInternalsByState,
    getParentState: rootResolver.getParentState,
    getNextState: rootResolver.getNextState,

    getAllSubdivision: rootResolver.getAllSubdivision,
    getSubdivision: rootResolver.getSubdivision,

    getAllTema: rootResolver.getAllTema,
    getTema: rootResolver.getTema,
    getTemaContract: rootResolver.getTemaContract,
    getExtIncomingsByTema: rootResolver.getExtIncomingsByTema,
    getExtOutgoingByTema: rootResolver.getExtOutgoingByTema,
    getIntOutgoingByTema: rootResolver.getIntOutgoingByTema,
    getIntIncomingByTema: rootResolver.getIntIncomingByTema,
    getInternalByTema: rootResolver.getInternalByTema,

    getAllType: rootResolver.getAllType,
    getType: rootResolver.getType,
    getExtIncomingsByType: rootResolver.getExtIncomingsByType,
    getExtOutgoingsByType: rootResolver.getExtOutgoingsByType,
    getIntIncomingsByType: rootResolver.getIntIncomingsByType,
    getIntOutgoingsByType: rootResolver.getIntOutgoingsByType,
    getInternalsByType: rootResolver.getInternalsByType,

    getFetchTime: rootResolver.getFetchTime
  },
  Mutation: mutations
}
