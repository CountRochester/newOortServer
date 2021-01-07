export default `
  type Resolution {
    id: ID!
    text: String!
    expirationDate: String
    extIncomingId: ID
    intIncomingId: ID
    internalId: ID
    authorId: ID!
    complete: Boolean
    createdAt: String!
    updatedAt: String!
  }

  type ResolutionWithExecutants {
    id: ID
    text: String
    expirationDate: String
    extIncomingId: ID
    intIncomingId: ID
    internalId: ID
    authorId: ID
    executantIds: [ID]
    complete: Boolean
    createdAt: String
    updatedAt: String
  }

  input ResolutionInput {
    text: String!
    expirationDate: String
    extIncomingId: ID
    intIncomingId: ID
    internalId: ID
    authorId: ID!
    complete: Boolean
  }

  type Query {
    getAllResolution: [Resolution]
    getResolution(id: ID!): Resolution
    getAllResolutionsInDep(departmentId: ID!): [Resolution]
    getAllResolutionsInDepE(departmentId: ID!): [ResolutionWithExecutants]
    getResolutionsByIds(ids: [ID]!): [ResolutionWithExecutants]
  }

  type Mutation {
    addResolution(
      resolution: ResolutionInput!
      executantIds: [ID]
    ): Message!
    editResolution(
      id: ID!
      resolution: ResolutionInput!
      executantIds: [ID]
    ): Message!
    comleteResolution(id: ID!): Message!
    deleteResolutions(ids: [ID]!): MessageMult!
  }
`
