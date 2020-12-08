module.exports = `
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
    Positions: [ID]
    Subdivisions: [ID]
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  type EmployeeP {
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
    Positions: [CurrentPosition]
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
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
    Positions: [ID]
    Subdivisions: [ID]
  }

  type Query {
    getAllEmployee: [Employee]
    getEmployee(id: ID!): Employee
    getEmployeeDepartments(id: ID!): [Department]
    getEmployeeSubdivisions(id: ID!): [Subdivision]
    getEmployeeAllPosition(id: ID!): [CurrentPosition]
  }

  type Mutation {
    addEmployee(employee: EmployeeInput!): Message!
    editEmployee(id: ID! employee: EmployeeInput!): Message!
    deleteEmployee(id: ID!): Message!
  }
`
