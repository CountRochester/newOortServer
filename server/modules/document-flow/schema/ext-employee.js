module.exports = `
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
    extCurrentPositionsId: [ID]
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  type ExtEmployeeP {
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
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
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

  type Query {
    getAllExtEmployee: [ExtEmployee]
    getExtEmployee(id: ID!): ExtEmployee
    getExtEmployeeOrganisation(id: ID!): Organisation
  }

  type Mutation {
    addExtEmployee(extEmployee: ExtEmployeeInput!): Message!
    editExtEmployee(id: ID! extEmployee: ExtEmployeeInput!): Message!
    deleteExtEmployee(id: ID!): Message!
  }
`
