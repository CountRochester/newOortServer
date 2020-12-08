module.exports = `
  type ExtIncState {
    id: ID!
    ExtIncomingId: ID
    DepartmentId: ID
    StateId: ID
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  type ExtIncStateP {
    id: ID!
    Department: DepartmentP
    State: State
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input ExtIncStateInput {
    ExtIncomingId: ID
    DepartmentId: ID
    StateId: ID
  }

  type Query {
    getAllExtIncState: [ExtIncState]
    getExtIncState(id: ID!): ExtIncState
    getExtIncStates(ids: [ID]!): [ExtIncState]
    getAllExtIncStateByExtIncoming(id: ID!): [ExtIncState]
    getExtIncStateInDepartments(id: ID!, depsId: [ID!]!): [ExtIncState]
  }

  type Mutation {
    addExtIncState(extIncState: ExtIncStateInput!): Message!
    editExtIncState(id: ID! extIncState: ExtIncStateInput!): Message!
    deleteExtIncState(id: ID!): Message!
    addExtIncStateToDocument(ExtIncomingId: ID!, DepartmentId: ID!, StateId: ID!): Message!
  }
`
