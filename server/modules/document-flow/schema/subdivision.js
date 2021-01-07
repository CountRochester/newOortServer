export default `
  type Subdivision {
    id: ID!
    name: String!
    fullName: String
    departmentId: ID
    createdAt: String!
    updatedAt: String!
  }

  input SubdivisionInput {
    name: String!
    fullName: String
    departmentId: ID
  }

  type Query {
    getAllSubdivision: [Subdivision]
    getSubdivision(id: ID!): Subdivision
  }

  type Mutation {
    addSubdivision(subdivision: SubdivisionInput!): Message!
    editSubdivision(id: ID! subdivision: SubdivisionInput!): Message!
    deleteSubdivisions(ids: [ID]!): MessageMult!
  }
`
