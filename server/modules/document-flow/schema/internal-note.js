export default `
  type InternalNote {
    id: ID!
    text: String!
    internalId: ID!
    departmentId: ID!
    createdAt: String!
    updatedAt: String!
  }

  input InternalNoteInput {
    text: String!
    internalId: ID!
    departmentId: ID!
  }

  type Query {
    getInternalNote(id: ID!): InternalNote
  }

  type Mutation {
    addInternalNote(internalNote: InternalNoteInput!): Message!
    editInternalNote(id: ID! internalNote: InternalNoteInput!): Message!
    deleteInternalNotes(ids: [ID]!): MessageMult!
  }
`
