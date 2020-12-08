export default `
  type Department {
    id: ID!
    fullName: String!
    number: String!
    shortName: String
    prefix: String!
    parentDepartmentId: ID
    createdAt: String!
    updatedAt: String!
  }

  input DepartmentInput {
    fullName: String!
    number: String!
    shortName: String
    prefix: String!
    parentDepartmentId: ID
  }

  type Query {
    getAllDepartments: [Department]
    getDepartment(id: ID!): Department
  }

  type Mutation {
    addDepartment(department: DepartmentInput!): Message!
    editDepartment(id: ID! department: DepartmentInput!): Message!
    editDepartmentChilds(id: ID! parentId: ID childId: [ID]): Message!
    deleteDepartments(id: [ID]!): MessageMult!
  }
`
