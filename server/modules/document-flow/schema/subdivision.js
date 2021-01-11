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

  type subdivisionSubs {
    type: String!
    id: ID!
    item: Subdivision
  }

  type Query {
    getAllSubdivisions: [Subdivision]
    getSubdivision(id: ID!): Subdivision
  }

  type Mutation {
    addSubdivision(subdivision: SubdivisionInput!): Message!
    editSubdivision(id: ID! subdivision: SubdivisionInput!): Message!
    deleteSubdivisions(ids: [ID]!): MessageMult!
  }

  type Subscription {
    subdivisionChanged: subdivisionSubs!
  }
`
