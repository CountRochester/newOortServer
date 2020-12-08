module.exports = `
  type InternalIncState {
    id: ID!
    InternalId: ID
    DepartmentId: ID
    StateId: ID
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input InternalIncStateInput {
    InternalId: ID
    DepartmentId: ID
    StateId: ID
  }

  type Query {
    getAllInternalIncState: [InternalIncState]
    getInternalIncState(id: ID!): InternalIncState
    getInternalIncStates(ids: [ID]!): [InternalIncState]
  }

  type Mutation {
    addInternalIncState(internalIncState: InternalIncStateInput!): Message!
    editInternalIncState(id: ID! internalIncState: InternalIncStateInput!): Message!
    deleteInternalIncState(id: ID!): Message!
    addInternalIncStateToDocument(InternalId: ID!, DepartmentId: ID!, StateId: ID!): Message!
  }
`
