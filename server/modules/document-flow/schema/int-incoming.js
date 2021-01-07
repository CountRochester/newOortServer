export default `
  type IntIncoming {
    id: ID!
    subject: String
    extNumber: Int
    extNumberPrefix: String
    extDate: String!
    needAnswer: Boolean
    typeId: ID
    createdAt: String!
    updatedAt: String!
  }

  type IntIncStateReq {
    intIncStateId: ID
    stateId: ID
    stateName: String
  }

  type IntIncNumber {
    intIncNumberId: ID
    incNumberDigit: Int
    incDate: String
    prefix: ID
  }

  type IntIncDepData {
    departmentId: ID
    state: IntIncStateReq
    incNumber: IntIncNumber
  }

  type IntIncomingRequest {
    id: ID
    subject: String
    extNumber: Int
    extNumberPrefix: String
    extDate: String
    needAnswer: Boolean
    type: String
    typeId: ID
    state: String
    stateId: ID
    notes: [Note]
    intIncDepData: [IntIncDepData]
    incNumber: String
    incNumberDigit: Int
    incNumberId: ID
    incDate: String
    temas: String
    temaIds: [ID]
    author: String
    authorId: ID
    podpisants: String
    podpisantIds: [ID]
    addressee: String
    addresseeIds: [ID]
    answers: [String]
    answerIds: [ID]
    sourceOutgoing: String
    sourceOutgoingId: ID
    resolutionIds: [ID]
    files: String
    fileIds: [ID]
    updatedAt: String
  }

  input IntIncInput {
    subject: String
    extNumber: Int
    extNumberPrefix: String
    extDate: String
    needAnswer: Boolean
    typeId: ID
    temaIds: [ID]
    authorId: ID
    podpisantIds: [ID]
    addresseeIds: [ID]
    fileIds: [ID]
    resolutions: String
  }

  input PublicateIntIncoming {
    intIncoming: IntIncInput
    depData: depDataInput
  }

  input IntIncomingInput {
    subject: String
    extNumber: Int
    extNumberPrefix: String
    extDate: String
    needAnswer: Boolean
    typeId: ID
  }

  type Query {
    updateIntIncomingRequest(id: ID!, time: String!): [IntIncomingRequest]
    getIntIncomingRequest(departmentId: ID!): [IntIncomingRequest]
    getIntIncomingRequestById(id: ID!, departmentId: ID): IntIncomingRequest
    getIntIncomingRequestByIds(ids: [ID]!): [IntIncomingRequest]
    getAllIntIncoming: [IntIncoming]
    getIntIncoming(id: ID!): IntIncoming
  }

  type Mutation {
    addIntIncoming(
      intIncoming: IntIncomingInput!
      resolutionIds: [ID]
      temaIds: [ID]
      podpisantIds: [ID]
      authorId: ID
      addresseeIds: [ID]
      fileIds: [ID]
      ): Message!

    editIntIncoming(
      id: ID!
      intIncoming: IntIncomingInput!
      resolutionIds: [ID]
      temaIds: [ID]
      podpisantIds: [ID]
      authorId: ID
      addresseeIds: [ID]
      fileIds: [ID]
      ): Message!

    deleteIntIncomings(ids: [ID]!): MessageMult!
    setNextStateIntIncoming(id: ID!, departmentIds: [ID]): Message!
    setPreviousStateIntIncoming(id: ID!, departmentIds: [ID]): Message!
    sendIntIncomingToExecs(id: ID!, executantIds: [ID]): Message!
    publicateIntIncoming(id: ID, publicateData: PublicateIntIncoming): Message!
  }
`
