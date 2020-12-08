module.exports = `
  type IntIncNote {
    id: ID!
    text: String!
    IntIncomingId: ID!
    DepartmentId: ID!
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input IntIncNoteInput {
    text: String!
    IntIncomingId: ID!
    DepartmentId: ID!
  }

  type Query {
    getIntIncNote(id: ID!): IntIncNote
  }

  type Mutation {
    addIntIncNote(intIncNote: IntIncNoteInput!): Message!
    editIntIncNote(id: ID! intIncNote: IntIncNoteInput!): Message!
    deleteIntIncNote(id: ID!): Message!
  }
`
