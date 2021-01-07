export default `
  type State {
    id: ID!
    name: String!
    type: String!
    parentStateId: ID
    createdAt: String!
    updatedAt: String!
  }

  input StateInput {
    name: String!
    type: String!
    parentStateId: ID
  }

  type Query {
    getAllState: [State]
    getState(id: ID!): State
    getParentState(id: ID!): State
    getNextState(id: ID!): State
  }

  type Mutation {
    addState(state: StateInput!): Message!
    editState(id: ID! state: StateInput!): Message!
    deleteStates(ids: [ID]!): MessageMult!
  }
`
