export default `
  type Position {
    id: ID!
    posName: String!
    posNameDat: String
    canSignExtDocs: Boolean
    canSignIntDocs: Boolean
    createdAt: String!
    updatedAt: String!
  }

  input PositionInput {
    posName: String!
    posNameDat: String
    canSignExtDocs: Boolean
    canSignIntDocs: Boolean
  }

  type positionSubs {
    type: String!
    id: ID
    ids: [ID]
    item: Position
  }

  type Query {
    getAllPositions: [Position]
    getPosition(id: ID!): Position
  }

  type Mutation {
    addPosition(position: PositionInput!): Message!
    editPosition(id: ID! position: PositionInput!): Message!
    deletePositions(ids: [ID]!): MessageMult!
  }

  type Subscription {
    positionChanged: positionSubs!
  }
`
