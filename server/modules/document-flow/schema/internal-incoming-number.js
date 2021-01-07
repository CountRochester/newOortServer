export default `
  type InternalIncomingNumber {
    id: ID!
    incNumber: Int!
    incDate: String!
    prefix: String
    departmentId: ID
    internalId: ID
    createdAt: String!
    updatedAt: String!
  }

  input InternalIncomingNumberInput {
    incNumber: Int!
    prefix: String
    incDate: String!
    departmentId: ID
    internalId: ID
  }

  type Query {
    getAllInternalIncomingNumber: [InternalIncomingNumber]
    getInternalIncomingNumber(id: ID!): InternalIncomingNumber
    getInternalIncomingNumbers(ids: [ID]!): [InternalIncomingNumber]
  }

  type Mutation {
    addInternalIncomingNumber(
      internalIncomingNumber: InternalIncomingNumberInput!
    ): Message!
    editInternalIncomingNumber(
      id: ID!
      internalIncomingNumber: InternalIncomingNumberInput!
    ): Message!
    deleteInternalIncomingNumbers(ids: [ID]!): MessageMult!
  }
`
