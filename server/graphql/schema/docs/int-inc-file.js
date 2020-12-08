module.exports = `
  type IntIncFile {
    id: ID!
    file: String!
    IntIncomingId: ID
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input IntIncFileInput {
    file: String!
    IntIncomingId: ID
  }

  type Query {
    getAllIntIncFile: [IntIncFile]
    getIntIncFile(id: ID!): IntIncFile
    getIntIncFiles(ids: [ID]!): [IntIncFile]
  }

  type Mutation {
    addIntIncFile(intIncFile: IntIncFileInput!): Message!
    editIntIncFile(id: ID! intIncFile: IntIncFileInput!): Message!
    attachFilesToIntInc(fileIds: [ID], intIncId: ID): Message!
    deleteIntIncFile(id: ID!): Message!
    deleteIntIncFiles(id: [ID]): Message!
  }
`
