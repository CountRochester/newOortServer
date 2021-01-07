/* eslint-disable max-len */
export default `
  type ExtIncState {
    id: ID!
    extIncomingId: ID
    departmentId: ID
    stateId: ID
    createdAt: String!
    updatedAt: String!
  }

  input ExtIncStateInput {
    extIncomingId: ID
    departmentId: ID
    stateId: ID
  }

  type Query {
    getAllExtIncState: [ExtIncState]
    getExtIncState(id: ID!): ExtIncState
    getExtIncStates(ids: [ID]!): [ExtIncState]
  }

  type Mutation {
    addExtIncState(extIncState: ExtIncStateInput!): Message!
    editExtIncState(id: ID! extIncState: ExtIncStateInput!): Message!
    deleteExtIncStates(ids: [ID]!): MessageMult!
    addExtIncStateToDocument(extIncomingId: ID!, departmentId: ID!, stateId: ID!): Message!
  }
`
