module.exports = `
  type Organisation {
    id: ID!
    orgName: String!
    postNumber: String
    city: String!
    region: String
    street: String
    building: String
    phone: String
    fax: String
    email: String
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input OrganisationInput {
    orgName: String!
    postNumber: String
    city: String!
    region: String
    street: String
    building: String
    phone: String
    fax: String
    email: String
  }

  type Query {
    getAllOrganisation: [Organisation]
    getOrganisation(id: ID!): Organisation
    getOrganisationExtEmployees(id: ID!): [ExtEmployee]
  }

  type Mutation {
    addOrganisation(organisation: OrganisationInput!): Message!
    editOrganisation(id: ID! organisation: OrganisationInput!): Message!
    deleteOrganisation(id: ID!): Message!
  }
`
