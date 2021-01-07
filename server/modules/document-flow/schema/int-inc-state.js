/* eslint-disable max-len */
export default `
  type IntIncState {
    id: ID!
    intIncomingId: ID
    departmentId: ID
    stateId: ID
    createdAt: String!
    updatedAt: String!
  }

  input IntIncStateInput {
    intIncomingId: ID
    departmentId: ID
    stateId: ID
  }

  type Query {
    getAllIntIncState: [IntIncState]
    getIntIncState(id: ID!): IntIncState
    getIntIncStates(ids: [ID]!): [IntIncState]
  }

  type Mutation {
    addIntIncState(intIncState: IntIncStateInput!): Message!
    editIntIncState(id: ID! intIncState: IntIncStateInput!): Message!
    deleteIntIncStates(ids: [ID]!): MessageMult!
    addIntIncStateToDocument(intIncomingId: ID!, departmentId: ID!, stateId: ID!): Message!
  }
`
