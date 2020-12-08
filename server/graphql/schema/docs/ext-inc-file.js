module.exports = `
  type ExtIncFile {
    id: ID!
    file: String!
    ExtIncomingId: ID
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input ExtIncFileInput {
    file: String!
    ExtIncomingId: ID
  }

  type Query {
    getAllExtIncFile: [ExtIncFile]
    getExtIncFile(id: ID!): ExtIncFile
    getExtIncFiles(ids: [ID]): [ExtIncFile]
  }

  type Mutation {
    addExtIncFile(extIncFile: ExtIncFileInput!): Message!
    editExtIncFile(id: ID! extIncFile: ExtIncFileInput!): Message!
    attachFilesToExtInc(fileIds: [ID], extIncId: ID): Message!
    deleteExtIncFile(id: ID!): Message!
    deleteExtIncFiles(id: [ID]): Message!
  }
`
