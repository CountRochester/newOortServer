export default `
  type Employee {
    id: ID!
    firstName: String!
    secondName: String!
    secondNameDat: String
    middleName: String!
    tabelNumber: String
    phone1: String
    phone2: String
    phone3: String
    email1: String
    email2: String
    positionIds: [ID]
    subdivisionIds: [ID]
    createdAt: String!
    updatedAt: String!
  }

  input EmployeeInput {
    firstName: String!
    secondName: String!
    secondNameDat: String
    middleName: String!
    tabelNumber: String
    phone1: String
    phone2: String
    phone3: String
    email1: String
    email2: String
    positionIds: [ID]
    subdivisionIds: [ID]
  }

  type Query {
    getAllEmployee: [Employee]
    getEmployee(id: ID!): Employee
  }

  type Mutation {
    addEmployee(employee: EmployeeInput!): Message!
    editEmployee(id: ID! employee: EmployeeInput!): Message!
    deleteEmployees(ids: [ID]!): MessageMult!
  }
`
