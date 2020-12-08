module.exports = `
  type IntOutFile {
    id: ID!
    file: String!
    IntOutgoingId: ID
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input IntOutFileInput {
    file: String!
    IntOutgoingId: ID
  }

  type Query {
    getAllIntOutFile: [IntOutFile]
    getIntOutFile(id: ID!): IntOutFile
    getIntOutFiles(ids: [ID]!): [IntOutFile]
  }

  type Mutation {
    addIntOutFile(intOutFile: IntOutFileInput!): Message!
    editIntOutFile(id: ID! intOutFile: IntOutFileInput!): Message!
    deleteIntOutFile(id: ID!): Message!
    attachFilesToIntOut(fileIds: [ID], intOutId: ID): Message!
    deleteIntOutFiles(id: [ID]): Message!
  }
`
