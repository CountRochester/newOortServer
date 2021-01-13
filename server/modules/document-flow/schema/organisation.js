export default `
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
    createdAt: String!
    updatedAt: String!
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

  type organisationSubs {
    type: String!
    id: ID
    ids: [ID]
    item: Organisation
  }

  type Query {
    getAllOrganisations: [Organisation]
    getOrganisation(id: ID!): Organisation
  }

  type Mutation {
    addOrganisation(organisation: OrganisationInput!): Message!
    editOrganisation(id: ID! organisation: OrganisationInput!): Message!
    deleteOrganisations(ids: [ID]!): MessageMult!
  }

  type Subscription {
    organisationChanged: organisationSubs!
  }
`
