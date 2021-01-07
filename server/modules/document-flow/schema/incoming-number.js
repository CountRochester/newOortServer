export default `
  type IncomingNumber {
    id: ID!
    incNumber: Int!
    incDate: String!
    prefix: String
    departmentId: ID
    extIncomingId: ID
    createdAt: String!
    updatedAt: String!
  }

  input IncomingNumberInput {
    incNumber: Int!
    incDate: String!
    prefix: String
    departmentId: ID
    extIncomingId: ID
  }

  type Query {
    getAllIncomingNumber: [IncomingNumber]
    getIncomingNumber(id: ID!): IncomingNumber
    getIncomingNumbers(ids: [ID]!): [IncomingNumber]
  }

  type Mutation {
    addIncomingNumber(incomingNumber: IncomingNumberInput!): Message!
    editIncomingNumber(id: ID! incomingNumber: IncomingNumberInput!): Message!
    deleteIncomingNumbers(ids: [ID]!): MessageMult!
  }
`
