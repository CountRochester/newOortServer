export default `
  type ExtIncoming {
    id: ID!
    subject: String
    extNumber: String!
    extDate: String!
    needAnswer: Boolean
    typeId: ID
    createdAt: String!
    updatedAt: String!
  }

  type ExtIncStateReq {
    extIncStateId: ID
    stateId: ID
    stateName: String
  }

  type ExtIncNumber {
    extIncNumberId: ID
    incNumberDigit: Int
    incDate: String!
    prefix: ID
  }

  type ExtIncDepData {
    departmentId: ID
    state: ExtIncStateReq
    incNumber: ExtIncNumber
  }

  type Note {
    id: ID!
    departmentId: ID
    text: String
  }

  type ExtIncomingRequest {
    id: ID
    subject: String
    extNumber: String
    extDate: String
    needAnswer: Boolean
    type: String
    typeId: ID
    state: String
    extIncStateId: ID
    notes: [Note]
    extIncDepData: [ExtIncDepData]
    incNumber: String
    incNumberDigit: Int
    incDate: String
    extIncNumberId: ID
    temas: String
    temaIds: [ID]
    authors: String
    authorIds: [ID]
    organisation: String
    organisationIds: [ID]
    executants: String
    executantIds: [ID]
    resolutionIds: [ID]
    answerIds: [ID]
    answers: [String]
    files: String
    fileIds: [ID]
    updatedAt: String
  }

  input ExtIncomingInput {
    subject: String
    extNumber: String!
    extDate: String!
    needAnswer: Boolean
    typeId: ID
  }

  input ExtIncomingEdit {
    subject: String
    extNumber: String
    extDate: String
    needAnswer: Boolean
    typeId: ID
  }

  input ExtIncInput {
    extNumber: String
    extDate: String
    subject: String
    needAnswer: Boolean
    typeId: ID
    temaIds: [ID]
    authorId: ID
    executantIds: [ID]
    fileIds: [ID]
    resolutions: String
  }

  input depDataInput {
    departmentId: ID
    incNumber: Int
    incDate: String
    prefix: String
    stateId: ID
    noteText: String
    changedState: Int
  }

  input PublicateExtIncoming {
    extIncoming: ExtIncInput
    depData: depDataInput
  }

  type Query {
    updateExtIncomingRequest(id: ID!, time: String!): [ExtIncomingRequest]
    getExtIncomingRequest(departmentId: ID!): [ExtIncomingRequest]
    getExtIncomingRequestById(id: ID!, depId: ID): ExtIncomingRequest
    getExtIncomingRequestByIds(ids: [ID]!): [ExtIncomingRequest]
    getAllExtIncoming: [ExtIncoming]
    getExtIncoming(id: ID!): ExtIncoming
  }

  type Mutation {
    addExtIncoming(
      extIncoming: ExtIncomingInput!
      resolutionIds: [ID]
      temaIds: [ID]
      authorIds: [ID]
      executantIds: [ID]
      fileIds: [ID]
      ): Message!
    editExtIncoming(
      id: ID!
      extIncoming: ExtIncomingEdit!
      resolutionIds: [ID]
      temaIds: [ID]
      authorIds: [ID]
      executantIds: [ID]
      stateIds: [ID]
      fileIds: [ID]
      ): Message!
    deleteExtIncomings(ids: [ID]!): MessageMult!
    setNextStateExtIncoming(id: ID!, departmentIds: [ID!]!): Message!
    setPreviousStateExtIncoming(id: ID!, departmentIds: [ID!]!): Message!
    sendExtIncomingToExecs(id: ID!, executantIds: [ID]): Message!
    publicateExtIncoming(id: ID, publicateData: PublicateExtIncoming): Message!
  }
`
