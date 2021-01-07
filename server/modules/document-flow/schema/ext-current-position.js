/* eslint-disable max-len */
export default `
  type ExtCurrentPosition {
    id: ID!
    startDate: Date
    endDate: Date
    extEmployeeId: ID!
    positionId: ID!
    position: String
    organisationId: ID!
    organisation: String
    createdAt: String!
    updatedAt: String!
  }

  input ExtCurrentPositionInput {
    startDate: Date
    endDate: Date
    extEmployeeId: ID!
    positionId: ID!
    organisationId: ID!
  }

  type Query {
    getAllExtCurrentPosition: [ExtCurrentPosition]
    getExtCurrentPosition(id: ID!): ExtCurrentPosition
  }

  type Mutation {
    addExtCurrentPosition(extCurrentPosition: ExtCurrentPositionInput!): Message!
    editExtCurrentPosition(id: ID! extCurrentPosition: ExtCurrentPositionInput!): Message!
    deleteExtCurrentPositions(ids: [ID]!): MessageMult!
  }
`
