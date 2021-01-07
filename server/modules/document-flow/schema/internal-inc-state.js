export default `
  type InternalIncState {
    id: ID!
    internalId: ID
    departmentId: ID
    stateId: ID
    createdAt: String!
    updatedAt: String!
  }

  input InternalIncStateInput {
    internalId: ID
    departmentId: ID
    stateId: ID
  }

  type Query {
    getAllInternalIncState: [InternalIncState]
    getInternalIncState(id: ID!): InternalIncState
    getInternalIncStates(ids: [ID]!): [InternalIncState]
  }

  type Mutation {
    addInternalIncState(internalIncState: InternalIncStateInput!): Message!
    editInternalIncState(id: ID! internalIncState: InternalIncStateInput!): Message!
    deleteInternalIncStates(ids: [ID]!): MessageMult!
    addInternalIncStateToDocument(
      internalId: ID!
      departmentId: ID!
      stateId: ID!
    ): Message!
  }
`
