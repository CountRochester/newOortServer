module.exports = `
  type IntIncState {
    id: ID!
    IntIncomingId: ID
    DepartmentId: ID
    StateId: ID
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input IntIncStateInput {
    IntIncomingId: ID
    DepartmentId: ID
    StateId: ID
  }

  type Query {
    getAllIntIncState: [IntIncState]
    getIntIncState(id: ID!): IntIncState
    getIntIncStates(ids: [ID]!): [IntIncState]
  }

  type Mutation {
    addIntIncState(intIncState: IntIncStateInput!): Message!
    editIntIncState(id: ID! intIncState: IntIncStateInput!): Message!
    deleteIntIncState(id: ID!): Message!
    addIntIncStateToDocument(IntIncomingId: ID!, DepartmentId: ID!, StateId: ID!): Message!
  }
`
