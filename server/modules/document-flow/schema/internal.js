export default `
  type Internal {
    id: ID!
    subject: String
    docNumber: String
    docNumberPrefix: String
    docDate: String
    typeId: ID
    stateId: ID
    authorId: ID
    createdAt: String!
    updatedAt: String!
  }

  type InternalStateReq {
    internalStateId: ID!
    stateId: ID!
    stateName: String
  }

  type InternalIncNumber {
    internalIncNumberId: ID!
    incNumberDigit: Int!
    incDate: String!
    prefix: String
  }

  type InternalDepData {
    departmentId: ID
    state: InternalStateReq
    incNumber: InternalIncNumber
  }

  type InternalRequest {
    id: ID!
    incNumber: String
    incNumberDigit: Int
    incDate: String
    incNumberId: ID
    subject: String
    docNumber: String
    docDate: String
    docNumberPrefix: String
    notes: [Note]
    internalDepData: [InternalDepData]
    type: String
    typeId: ID
    temas: String, 
    temaIds: [ID],
    state: String
    stateId: ID
    author: String
    authorId: ID
    podpisants: String,
    podpisantIds: [ID],
    addressee: String,
    addresseeIds: [ID],
    resolutionIds: [ID],
    files: [String],
    fileIds: [ID]
    updatedAt: String
  }

  input IntInput {
    subject: String
    docNumber: String
    docNumberPrefix: String
    docDate: String
    typeId: ID
    temaIds: [ID]
    authorId: ID
    podpisantIds: [ID]
    addresseeIds: [ID]
    fileIds: [ID]
    resolutions: String
  }

  input PublicateInternal {
    internal: IntInput
    depData: depDataInput
  }

  input InternalInput {
    subject: String
    docNumber: String
    docNumberPrefix: String
    docDate: String
    typeId: ID
    authorId: ID
  }

  type Query {
    updateInternalRequest(id: ID!, time: String!): [InternalRequest]
    getInternalRequest(departmentId: ID!): [InternalRequest]
    getInternalRequestById(id: ID! departmentId: ID): InternalRequest
    getInternalRequestByIds(ids: [ID]!): [InternalRequest]
    getAllInternal: [Internal]
    getInternal(id: ID!): Internal
  }

  type Mutation {
    addInternal(
      internal: InternalInput!
      resolutionIds: [ID]
      temaIds: [ID]
      podpisantIds: [ID]
      addresseeIds: [ID]
      fileIds: [ID]
      ): Message!

    editInternal(
      id: ID!
      internal: InternalInput!
      resolutionIds: [ID]
      temaIds: [ID]
      podpisantIds: [ID]
      addresseeIds: [ID]
      fileIds: [ID]
      ): Message!

    deleteInternals(ids: [ID]!): MessageMult!
    setNextStateInternal(id: ID! departmentIds: [ID]): Message!
    setPreviousStateInternal(id: ID! departmentIds: [ID]): Message!
    sendInternalToExecs (id: ID! executantIds: [ID]): Message!
    publicateInternal(id: ID publicateData: PublicateInternal): Message!
  }
`
