export default `
  type Tema {
    id: ID!
    name: String!
    contractId: ID
    createdAt: String!
    updatedAt: String!
  }

  input TemaInput {
    name: String!
    contractId: ID
  }

  type temaSubs {
    type: String!
    id: ID
    ids: [ID]
    item: Tema
  }

  type Query {
    getAllTemas: [Tema]
    getTema(id: ID!): Tema
  }

  type Mutation {
    addTema(tema: TemaInput!): Message!
    editTema(id: ID! tema: TemaInput!): Message!
    deleteTemas(ids: [ID]!): MessageMult!
  }

  type Subscription {
    temaChanged: temaSubs!
  }
`
