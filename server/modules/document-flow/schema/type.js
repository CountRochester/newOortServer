export default `
  type Type {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  input TypeInput {
    name: String!
  }

  type Query {
    getAllType: [Type]
    getType(id: ID!): Type
  }

  type Mutation {
    addType(type: TypeInput!): Message!
    editType(id: ID! type: TypeInput!): Message!
    deleteTypes(ids: [ID]!): MessageMult!
  }
`
