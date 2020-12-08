module.exports = `
  type ExtCurrentPosition {
    id: ID!
    startDate: Date
    endDate: Date
    ExtEmployeeId: ID!
    PositionId: ID!
    Position: String
    OrganisationId: ID!
    Organisation: String
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input ExtCurrentPositionInput {
    startDate: Date
    endDate: Date
    ExtEmployeeId: ID!
    PositionId: ID!
    OrganisationId: ID!
  }

  type Query {
    getAllExtCurrentPosition: [ExtCurrentPosition]
    getExtCurrentPosition(id: ID!): ExtCurrentPosition
  }

  type Mutation {
    addExtCurrentPosition(extCurrentPosition: ExtCurrentPositionInput!): Message!
    editExtCurrentPosition(id: ID! extCurrentPosition: ExtCurrentPositionInput!): Message!
    deleteExtCurrentPosition(id: ID!): Message!
  }
`
