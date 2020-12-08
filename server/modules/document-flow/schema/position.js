module.exports = `
  type Position {
    id: ID!
    posName: String!
    posNameDat: String
    canSignExtDocs: Boolean
    canSignIntDocs: Boolean
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input PositionInput {
    posName: String!
    posNameDat: String
    canSignExtDocs: Boolean
    canSignIntDocs: Boolean
  }

  type Query {
    getAllPosition: [Position]
    getPosition(id: ID!): Position
    getPositionEmployees(id: ID!): [Employee]
  }

  type Mutation {
    addPosition(position: PositionInput!): Message!
    editPosition(id: ID! position: PositionInput!): Message!
    deletePosition(id: ID!): Message!
  }
`
