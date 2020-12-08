module.exports = `
  type ExtIncNote {
    id: ID!
    text: String!
    ExtIncomingId: ID!
    DepartmentId: ID!
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input ExtIncNoteInput {
    text: String!
    ExtIncomingId: ID!
    DepartmentId: ID!
  }

  type Query {
    getExtIncNote(id: ID!): ExtIncNote
  }

  type Mutation {
    addExtIncNote(extIncNote: ExtIncNoteInput!): Message!
    editExtIncNote(id: ID! extIncNote: ExtIncNoteInput!): Message!
    deleteExtIncNote(id: ID!): Message!
  }
`
