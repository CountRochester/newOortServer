export default `
  type ExtEmployee {
    id: ID!
    firstName: String!
    secondName: String!
    secondNameDat: String
    middleName: String
    phone1: String
    phone2: String
    fax: String
    email1: String
    email2: String
    extCurrentPositionIds: [ID]
    createdAt: String!
    updatedAt: String!
  }

  input ExtEmployeeInput {
    firstName: String!
    secondName: String!
    secondNameDat: String
    middleName: String
    phone1: String
    phone2: String
    fax: String
    email1: String
    email2: String
  }

  type extEmployeeSubs {
    type: String!
    id: ID
    ids: [ID]
    item: ExtEmployee
  }

  type Query {
    getAllExtEmployees: [ExtEmployee]
    getExtEmployee(id: ID!): ExtEmployee
  }

  type Mutation {
    addExtEmployee(extEmployee: ExtEmployeeInput!): Message!
    editExtEmployee(id: ID! extEmployee: ExtEmployeeInput!): Message!
    deleteExtEmployees(ids: [ID]!): MessageMult!
  }

  type Subscription {
    extEmployeeChanged: extEmployeeSubs!
  }
`
