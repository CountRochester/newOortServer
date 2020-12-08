module.exports = `
  type ExtOutFile {
    id: ID!
    file: String!
    ExtOutgoingId: ID
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input ExtOutFileInput {
    file: String!
    ExtOutgoingId: ID
  }

  type Query {
    getAllExtOutFile: [ExtOutFile]
    getExtOutFile(id: ID!): ExtOutFile
    getExtOutFiles(ids: [ID]!): [ExtOutFile]
  }

  type Mutation {
    addExtOutFile(extOutFile: ExtOutFileInput!): Message!
    editExtOutFile(id: ID! extOutFile: ExtOutFileInput!): Message!
    attachFilesToExtOut(fileIds: [ID], extOutId: ID): Message!
    deleteExtOutFile(id: ID!): Message!
    deleteExtOutFiles(id: [ID]): Message!
  }
`
