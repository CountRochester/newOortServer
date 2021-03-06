export default `
  type ExtIncNote {
    id: ID!
    text: String!
    extIncomingId: ID!
    departmentId: ID!
    createdAt: String!
    updatedAt: String!
  }

  input ExtIncNoteInput {
    text: String!
    extIncomingId: ID!
    departmentId: ID!
  }

  type extIncNoteSubs {
    type: String!
    id: ID
    ids: [ID]
    item: ExtIncNote
  }

  type Query {
    getExtIncNote(id: ID!): ExtIncNote
  }

  type Mutation {
    addExtIncNote(extIncNote: ExtIncNoteInput!): Message!
    editExtIncNote(id: ID! extIncNote: ExtIncNoteInput!): Message!
    deleteExtIncNotes(ids: [ID]!): MessageMult!
  }

  type Subscription {
    extIncNoteChanged: extIncNoteSubs!
  }
`
