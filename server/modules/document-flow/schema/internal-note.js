module.exports = `
  type InternalNote {
    id: ID!
    text: String!
    InternalId: ID!
    DepartmentId: ID!
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input InternalNoteInput {
    text: String!
    InternalId: ID!
    DepartmentId: ID!
  }

  type Query {
    getInternalNote(id: ID!): InternalNote
  }

  type Mutation {
    addInternalNote(internalNote: InternalNoteInput!): Message!
    editInternalNote(id: ID! internalNote: InternalNoteInput!): Message!
    deleteInternalNote(id: ID!): Message!
  }
`
