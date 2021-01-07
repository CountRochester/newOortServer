export default `
  type IntOutgoing {
    id: ID!
    outNumber: Int!
    outDate: String!
    prefix: String
    subject: String
    authorId: ID
    note: String
    typeId: ID
    stateId: ID
    createdAt: String!
    updatedAt: String!
  }

  type IntOutgoingRequest {
    id: ID!
    outNumber: String!
    outNumberDigit: Int
    prefix: String
    outDate: String!
    subject: String
    author: String
    authorId: ID
    department: String
    departmentId: ID
    type: String
    typeId: ID
    state: String
    stateId: ID
    note: String
    addressees: String
    addresseeIds: [ID]
    podpisants: String
    podpisantIds: [ID]
    temas: String
    temaIds: [ID]
    files: [String]
    fileIds: [ID]
    isAnswerOn: [String]
    isAnswerOnIds: [ID]
    updatedAt: String
  }

  input IntOutInput {
    prefix: String
    outNumber: Int
    outDate: String
    subject: String
    authorId: ID
    typeId: ID
    stateId: ID
    temaIds: [ID]
    addresseeIds: [ID]
    podpisantIds: [ID]
    answerIds: [ID]
    note: String
    fileIds: [ID]
    stateChanged: Int
  }

  input PublicateIntOutgoing {
    intOutgoing: IntOutInput
  }

  input IntOutgoingInput {
    outNumber: Int!
    outDate: String!
    prefix: String
    subject: String
    note: String
    author: ID
    typeId: ID
    stateId: ID
  }

  type Query {
    updateIntOutgoingRequest(id: ID!, time: String!): [IntOutgoingRequest]
    getIntOutgoingRequest(departmentId: ID! ): [IntOutgoingRequest]
    getIntOutgoingRequestById(id: ID!): IntOutgoingRequest
    getIntOutgoingRequestByIds(ids: [ID]!): [IntOutgoingRequest]
    getAllIntOutgoing: [IntOutgoing]
    getIntOutgoing(id: ID!): IntOutgoing
  }

  type Mutation {
    addIntOutgoing(
      intOutgoing: IntOutgoingInput!
      addresseeIds: [ID]
      temaIds: [ID]
      podpisantIds: [ID]
      answerIds: [ID]
      fileIds: [ID]
      ): Message!

    editIntOutgoing(
      id: ID!
      intOutgoing: IntOutgoingInput!
      addresseeIds: [ID]
      temaIds: [ID]
      podpisantIds: [ID]
      answerIds: [ID]
      fileIds: [ID]
      ): Message!

    deleteIntOutgoings(ids: [ID]!): MessageMult!
    addNoteToIntOutgoing (id: ID!, note: String!): Message!
    setNextStateIntOutgoing(id: ID!): Message!
    setPreviousStateIntOutgoing(id: ID!): Message!
    setStateIntOutgoing(id: ID!, stateId: ID!): Message!
    sendIntOutgoing(id: ID!): Message!
    publicateIntOutgoing(id: ID, publicateData: PublicateIntOutgoing): Message!
  }
`
