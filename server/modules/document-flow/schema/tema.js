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

  type Query {
    getAllTema: [Tema]
    getTema(id: ID!): Tema
  }

  type Mutation {
    addTema(tema: TemaInput!): Message!
    editTema(id: ID! tema: TemaInput!): Message!
    deleteTemas(ids: [ID]!): MessageMult!
  }
`
