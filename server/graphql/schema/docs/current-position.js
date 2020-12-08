module.exports = `
  type CurrentPosition {
    id: ID!
    startDate: Date
    endDate: Date
    EmployeeId: ID!
    PositionId: ID!
    DepartmentId: ID!
    SubdivisionId: [ID]
    Subdivision: String
    extPrefix: String
    intPrefix: String
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input CurrentPositionInput {
    startDate: Date
    endDate: Date
    EmployeeId: ID!
    PositionId: ID!
    DepartmentId: ID!
    SubdivisionId: [ID]
    extPrefix: String
    intPrefix: String
  }

  type Query {
    getAllCurrentPosition: [CurrentPosition]
    getCurrentPosition(id: ID!): CurrentPosition
  }

  type Mutation {
    addCurrentPosition(currentPosition: CurrentPositionInput!): Message!
    editCurrentPosition(id: ID! currentPosition: CurrentPositionInput!): Message!
    deleteCurrentPosition(ids: [ID]!): MessageMult!
  }
`
