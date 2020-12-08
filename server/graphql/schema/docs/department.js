module.exports = `
  type Department {
    id: ID!
    depName: String!
    depNumber: String!
    shortName: String
    depPrefix: String!
    parentDepartmentId: ID
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  type DepartmentP {
    id: ID
    depName: String
    depNumber: String
    shortName: String
    depPrefix: String
    parentDepartment: Department
    childDepartments: [Department]
    createdAt: TimeStamp
    updatedAt: TimeStamp
  }

  input DepartmentInput {
    depName: String!
    depNumber: String!
    shortName: String
    depPrefix: String!
    parentDepartmentId: ID
  }

  type Query {
    getAllDepartment: [Department]
    getDepartment(id: ID!): Department
    getAllChildDepartment(id: ID!): [Department]
    getParentDepartment(id: ID!): Department
    getAllDepartmentEmployees(id: ID! date: Date): [Employee]
    getAllDepartmentAndSubdivisionEmployees(id: ID!): [Employee]
  }

  type Mutation {
    addDepartment(department: DepartmentInput!): Message!
    editDepartment(id: ID! department: DepartmentInput!): Message!
    editDepartmentChilds(id: ID! parentId: ID childId: [ID]): Message!
    deleteDepartment(id: ID!): Message!
  }
`
