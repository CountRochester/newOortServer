export default `
  type CurrentPosition {
    id: ID!
    startDate: String
    endDate: String
    employeeId: ID!
    positionId: ID!
    departmentId: ID!
    subdivisionIds: [ID]
    subdivision: String
    extPrefix: String
    intPrefix: String
    createdAt: String!
    updatedAt: String!
  }

  input currentPositionInput {
    startDate: String
    endDate: String
    employeeId: ID!
    positionId: ID!
    departmentId: ID!
    subdivisionIds: [ID]
    extPrefix: String
    intPrefix: String
  }

  type currentPositionSubs {
    type: String!
    id: ID
    ids: [ID]
    item: CurrentPosition
  }

  type Query {
    getAllCurrentPositions: [CurrentPosition]
    getCurrentPosition(id: ID!): CurrentPosition
  }

  type Mutation {
    addCurrentPosition(currentPosition: currentPositionInput!): Message!
    editCurrentPosition(id: ID! currentPosition: currentPositionInput!): Message!
    deleteCurrentPositions(ids: [ID]!): MessageMult!
  }

  type Subscription {
    currentPositionChanged: currentPositionSubs!
  }
`
