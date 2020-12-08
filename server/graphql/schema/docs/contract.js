module.exports = `
  type Contract {
    id: ID!
    number: String!
    date: Date!
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input ContractInput {
    number: String!
    date: Date
  }

  type Query {
    getAllContract: [Contract]
    getContract(id: ID!): Contract
  }

  type Mutation {
    addContract(contract: ContractInput!): Message!
    editContract(id: ID! contract: ContractInput!): Message!
    deleteContract(id: ID!): Message!
  }
`
