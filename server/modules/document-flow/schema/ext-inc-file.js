export default `
  type ExtIncFile {
    id: ID!
    file: String!
    extIncomingId: ID
    createdAt: String!
    updatedAt: String!
  }

  input ExtIncFileInput {
    file: String!
    extIncomingId: ID
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
    deleteExtIncFiles(ids: [ID]): MessageMult!
  }
`
