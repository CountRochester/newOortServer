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

  type departmentSubs {
    type: String!
    id: ID
    ids: [ID]
    item: Department
    items: [Department]
  }

  type Query {
    getAllDepartments: [Department]
    getDepartment(id: ID!): Department
  }

  type Mutation {
    addDepartment(department: DepartmentInput!): Message!
    editDepartment(id: ID! department: DepartmentInput!): Message!
    editDepartmentChilds(id: ID! parentId: ID childIds: [ID]): MessageMult!
    deleteDepartments(ids: [ID]!): MessageMult!
  }

  type Subscription {
    departmentChanged: departmentSubs!
  }
`
