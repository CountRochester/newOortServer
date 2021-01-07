export default `
  type ExtOutgoing {
    id: ID!
    outNumber: String!
    outDate: String!
    prefix: String
    subject: String
    authorId: ID
    typeId: ID
    stateId: ID
    createdAt: String!
    updatedAt: String!
  }

  type ExtOutgoingRequest {
    id: ID!
    outNumber: String!
    outDate: String!
    prefix: String
    subject: String
    author: String
    authorId: ID
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
    organisations: String
    organisationIds: [ID]
    department: String
    departmentId: ID
    files: String
    fileIds: [ID]
    isAnswerOn: String
    isAnswerOnIds: [ID]
    updatedAt: String
  }

  input ExtOutgoingInput {
    outNumber: String!
    outDate: String!
    prefix: String
    subject: String
    authorId: ID
    typeId: ID
    stateId: ID
  }

  input ExtOutInput {
    subject: String
    outNumber: String
    prefix: String
    outDate: String
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

  input PublicateExtOutgoing {
    extOutgoing: ExtOutInput
  }

  type Query {
    updateExtOutgoingRequest(id: ID!, time: String!): [ExtOutgoingRequest]
    getExtOutgoingRequest(departmentId: ID!): [ExtOutgoingRequest]
    getExtOutgoingRequestById(id: ID!): ExtOutgoingRequest
    getExtOutgoingRequestByIds(ids: [ID]!): [ExtOutgoingRequest]
    getAllExtOutgoing: [ExtOutgoing]
    getExtOutgoing(id: ID!): ExtOutgoing
  }

  type Mutation {
    addExtOutgoing(
      extOutgoing: ExtOutgoingInput!
      extCurrentPositionIds: [ID]
      temaIds: [ID]
      podpisantIds: [ID]
      answerIds: [ID]
      fileIds: [ID]
      ): Message!
    editExtOutgoing(
      id: ID!
      extOutgoing: ExtOutgoingInput!
      extCurrentPositionIds: [ID]
      temaIds: [ID]
      podpisantIds: [ID]
      answerIds: [ID]
      fileIds: [ID]
      ): Message!
    deleteExtOutgoings(ids: [ID]!): MessageMult!
    addNoteToExtOutgoing (id: ID!, note: String!): Message!
    setStateExtOutgoing(id: ID! stateId: ID): Message!
    setNextStateExtOutgoing(id: ID!): Message!
    setPreviousStateExtOutgoing(id: ID!): Message!
    publicateExtOutgoing(id: ID, publicateData: PublicateExtOutgoing): Message!
  }
`
