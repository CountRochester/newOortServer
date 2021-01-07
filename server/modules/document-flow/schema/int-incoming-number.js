export default `
  type IntIncomingNumber {
    id: ID!
    incNumber: Int!
    incDate: String!
    prefix: String
    departmentId: ID
    intIncomingId: ID
    createdAt: String!
    updatedAt: String!
  }

  input IntIncomingNumberInput {
    incNumber: Int!
    incDate: String!
    prefix: String
    departmentId: ID
    intIncomingId: ID
  }

  type Query {
    getAllIntIncomingNumber: [IntIncomingNumber]
    getIntIncomingNumber(id: ID!): IntIncomingNumber
    getIntIncomingNumbers(ids: [ID]!): [IntIncomingNumber]

  }

  type Mutation {
    addIntIncomingNumber(intIncomingNumber: IntIncomingNumberInput!): Message!
    editIntIncomingNumber(
      id: ID! 
      intIncomingNumber: IntIncomingNumberInput!
    ): Message!
    deleteIntIncomingNumbers(ids: [ID]!): MessageMult!
  }
`
