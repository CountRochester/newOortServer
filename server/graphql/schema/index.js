const { buildSchema } = require('graphql')
// const { mergeTypes } = require('merge-graphql-schemas')
const { mergeTypeDefs } = require('@graphql-tools/merge')
const { timeStamp, time, date } = require('../types')

const auth = require('./auth')
const position = require('./docs/position')
const contract = require('./docs/contract')
const organisation = require('./docs/organisation')
const state = require('./docs/state')
const type = require('./docs/type')
const department = require('./docs/department')
const employee = require('./docs/employee')
const extEmployee = require('./docs/ext-employee')
const tema = require('./docs/tema')
const resolution = require('./docs/resolution')
const extIncoming = require('./docs/ext-incoming')
const extIncFile = require('./docs/ext-inc-file')
const extOutFile = require('./docs/ext-out-file')
const intIncFile = require('./docs/int-inc-file')
const intOutFile = require('./docs/int-out-file')
const internalFile = require('./docs/internal-file')
const extOutgoing = require('./docs/ext-outgoing')
const intIncoming = require('./docs/int-incoming')
const intOutgoing = require('./docs/int-outgoing')
const internal = require('./docs/internal')
const incomingNumber = require('./docs/incoming-number')
const intIncomingNumber = require('./docs/int-incoming-number')
const internalIncomingNumber = require('./docs/internal-incoming-number')
const extIncState = require('./docs/ext-inc-state')
const intIncState = require('./docs/int-inc-state')
const internalIncState = require('./docs/internal-inc-state')
const subdivision = require('./docs/subdivision')
const currentPosition = require('./docs/current-position')
const extCurrentPosition = require('./docs/ext-current-position')
const extIncNote = require('./docs/ext-inc-note')
const intIncNote = require('./docs/int-inc-note')
const internalNote = require('./docs/internal-note')
const fetchTime = require('./fetch-time')

const core = `
  scalar TimeStamp
  scalar Time
  scalar Date

  type DeletedItem {
    id: ID!
  }

  type Message {
    type: String
    text: String!
    messageType: String!
    id: ID,
    item: String
  }

  type MessageMult {
    type: String
    text: String!
    messageType: String!
    id: [ID],
    item: String
  }

  type AuthMessage {
    type: String
    text: String!
    item: String
    messageType: String!
    token: String
    UserId: ID
  }
`
const subscription = `
  type contractSubs {
    type: String!
    id: ID!
    item: Contract
  }
  type currentPositionSubs {
    type: String!
    id: [ID]!
    item: [CurrentPosition]
  }
  type departmentSubs {
    type: String!
    id: ID!
    item: Department
  }
  type employeeSubs {
    type: String!
    id: ID!
    item: Employee
  }
  type extCurrentPositionSubs {
    type: String!
    id: ID!
    item: ExtCurrentPosition
  }
  type extEmployeeSubs {
    type: String!
    id: ID!
    item: ExtEmployee
  }
  type extIncFileSubs {
    type: String!
    id: [ID]!
    item: [ExtIncFile]
  }
  type extIncNoteSubs {
    type: String!
    id: ID!
    item: ExtIncNote
  }
  type extIncStateSubs {
    type: String!
    id: ID!
    item: ExtIncState
  }
  type extOutFileSubs {
    type: String!
    id: [ID]!
    item: [ExtOutFile]
  }
  type incomingNumberSubs {
    type: String!
    id: ID!
    item: IncomingNumber
  }
  type intIncFileSubs {
    type: String!
    id: [ID]!
    item: [IntIncFile]
  }
  type intIncNoteSubs {
    type: String!
    id: ID!
    item: IntIncNote
  }
  type intIncStateSubs {
    type: String!
    id: ID!
    item: IntIncState
  }
  type intIncomingNumberSubs {
    type: String!
    id: ID!
    item: IntIncomingNumber
  }
  type intOutFileSubs {
    type: String!
    id: [ID]!
    item: [IntOutFile]
  }
  type internalFileSubs {
    type: String!
    id: [ID]!
    item: [InternalFile]
  }
  type internalNoteSubs {
    type: String!
    id: ID!
    item: InternalNote
  }
  type internalIncStateSubs {
    type: String!
    id: ID!
    item: InternalIncState
  }
  type internalIncomingNumberSubs {
    type: String!
    id: ID!
    item: InternalIncomingNumber
  }
  type organisationSubs {
    type: String!
    id: ID!
    item: Organisation
  }
  type positionSubs {
    type: String!
    id: ID!
    item: Position
  }
  type resolutionSubs {
    type: String!
    id: ID!
    item: ResolutionWithExecutants
  }
  type stateSubs {
    type: String!
    id: ID!
    item: State
  }
  type subdivisionSubs {
    type: String!
    id: ID!
    item: Subdivision
  }
  type temaSubs {
    type: String!
    id: ID!
    item: Tema
  }
  type typeSubs {
    type: String!
    id: ID!
    item: Type
  }
  type userSubs {
    type: String!
    id: ID!
    item: User
  }
  type ExtIncomingUpdate {
    ExtIncoming: ExtIncomingRequest
    IncNumbers: [IncomingNumber]
    ExtIncStates: [ExtIncState]
    ExtIncFiles: [ExtIncFile]
    Resolutions: [ResolutionWithExecutants]
  }
  type IntIncomingUpdate {
    IntIncoming: IntIncomingRequest
    IncNumbers: [IntIncomingNumber]
    IntIncStates: [IntIncState]
    IntIncFiles: [IntIncFile]
    Resolutions: [ResolutionWithExecutants]
  }
  type extIncomingSubs {
    type: String!
    id: ID!
    item: ExtIncomingUpdate
  }
  type ExtOutgoingUpdate {
    ExtOutgoing: ExtOutgoingRequest
    ExtOutFiles: [ExtOutFile]
  }
  type IntOutgoingUpdate {
    IntOutgoing: IntOutgoingRequest
    IntOutFiles: [IntOutFile]
  }
  type InternalUpdate {
    Internal: InternalRequest
    IncNumbers: [InternalIncomingNumber]
    InternalStates: [InternalIncState]
    InternalFiles: [InternalFile]
    Resolutions: [ResolutionWithExecutants]
  }
  type extOutgoingSubs {
    type: String!
    id: ID!
    item: ExtOutgoingUpdate
  }
  type intIncomingSubs {
    type: String!
    id: ID!
    item: IntIncomingUpdate
  }
  type intOutgoingSubs {
    type: String!
    id: ID!
    item: IntOutgoingUpdate
  }
  type internalSubs {
    type: String!
    id: ID!
    item: InternalUpdate
  }

  type Subscription {
    extIncomingChanged: extIncomingSubs!
    extOutgoingChanged: extOutgoingSubs!
    intIncomingChanged: intIncomingSubs!
    intOutgoingChanged: intOutgoingSubs!
    internalChanged: internalSubs!
    contractChanged: contractSubs!
    currentPositionChanged: currentPositionSubs!
    departmentChanged: departmentSubs!
    employeeChanged: employeeSubs!
    extCurrentPositionChanged: extCurrentPositionSubs!
    extEmployeeChanged: extEmployeeSubs!
    extIncFileChanged: extIncFileSubs!
    extIncNoteChanged: extIncNoteSubs!
    extIncStateChanged: extIncStateSubs!
    extOutFileChanged: extOutFileSubs!
    incomingNumberChanged: incomingNumberSubs!
    intIncFileChanged: intIncFileSubs!
    intIncNoteChanged: intIncNoteSubs!
    intIncStateChanged: intIncStateSubs!
    intIncomingNumberChanged: intIncomingNumberSubs!
    intOutFileChanged: intOutFileSubs!
    internalFileChanged: internalFileSubs!
    internalIncStateChanged: internalIncStateSubs!
    internalIncomingNumberChanged: internalIncomingNumberSubs!
    internalNoteChanged: internalNoteSubs!
    organisationChanged: organisationSubs!
    positionChanged: positionSubs!
    resolutionChanged: resolutionSubs!
    stateChanged: stateSubs!
    subdivisionChanged: subdivisionSubs!
    temaChanged: temaSubs!
    typeChanged: typeSubs!
    userChanged: userSubs!
  }
`
const types = [
  core,
  auth,
  position,
  contract,
  organisation,
  state,
  type,
  department,
  employee,
  extEmployee,
  tema,
  resolution,
  extIncoming,
  extIncFile,
  extOutFile,
  intIncFile,
  intOutFile,
  internalFile,
  extOutgoing,
  intIncoming,
  intOutgoing,
  internal,
  incomingNumber,
  intIncomingNumber,
  extIncState,
  intIncState,
  subdivision,
  currentPosition,
  extCurrentPosition,
  internalIncomingNumber,
  internalIncState,
  extIncNote,
  intIncNote,
  internalNote,
  subscription,
  fetchTime
]

const schema = mergeTypeDefs(types)
module.exports = schema
