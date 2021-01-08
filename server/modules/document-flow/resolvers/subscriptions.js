import pubsub from '../../pub-sub.js'

export default {
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
}
