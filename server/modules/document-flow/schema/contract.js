export default `
  type Contract {
    id: ID!
    number: String!
    date: String!
    createdAt: String!
    updatedAt: String!
  }

  input contractInput {
    number: String!
    date: String!
  }

  type contractSubs {
    type: String!
    id: ID
    ids: [ID]
    item: Contract
  }

  type Query {
    getAllContracts: [Contract]
    getContract(id: ID!): Contract
  }

  type Mutation {
    addContract(contract: contractInput!): Message!
    editContract(id: ID! contract: contractInput!): Message!
    deleteContracts(ids: [ID]!): MessageMult!
  }

  type Subscription {
    contractChanged: contractSubs!
  }
`
