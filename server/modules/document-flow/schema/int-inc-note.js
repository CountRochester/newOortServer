export default `
  type IntIncNote {
    id: ID!
    text: String!
    intIncomingId: ID!
    departmentId: ID!
    createdAt: String!
    updatedAt: String!
  }

  input IntIncNoteInput {
    text: String!
    intIncomingId: ID!
    departmentId: ID!
  }

  type Query {
    getIntIncNote(id: ID!): IntIncNote
  }

  type Mutation {
    addIntIncNote(intIncNote: IntIncNoteInput!): Message!
    editIntIncNote(id: ID! intIncNote: IntIncNoteInput!): Message!
    deleteIntIncNotes(ids: [ID]!): MessageMult!
  }
`
