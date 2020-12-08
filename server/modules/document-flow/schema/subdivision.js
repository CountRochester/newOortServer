module.exports = `
  type Subdivision {
    id: ID!
    name: String!
    fullName: String
    DepartmentId: ID
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input SubdivisionInput {
    name: String!
    fullName: String
    DepartmentId: ID
  }

  type Query {
    getAllSubdivision: [Subdivision]
    getSubdivision(id: ID!): Subdivision
  }

  type Mutation {
    addSubdivision(subdivision: SubdivisionInput!): Message!
    editSubdivision(id: ID! subdivision: SubdivisionInput!): Message!
    deleteSubdivision(id: ID!): Message!
  }
`
