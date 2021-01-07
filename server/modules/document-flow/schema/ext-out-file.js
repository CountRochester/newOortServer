export default `
  type ExtOutFile {
    id: ID!
    file: String!
    extOutgoingId: ID
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input ExtOutFileInput {
    file: String!
    extOutgoingId: ID
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
    deleteExtOutFiles(ids: [ID]): MessageMult!
  }
`
