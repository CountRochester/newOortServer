module.exports = `
  type InternalFile {
    id: ID!
    file: String!
    InternalId: ID
    createdAt: TimeStamp!
    updatedAt: TimeStamp!
  }

  input InternalFileInput {
    file: String!
    InternalId: ID
  }

  type Query {
    getAllInternalFile: [InternalFile]
    getInternalFile(id: ID!): InternalFile
    getInternalFiles(ids: [ID]!): [InternalFile]
  }

  type Mutation {
    addInternalFile(internalFile: InternalFileInput!): Message!
    editInternalFile(id: ID! internalFile: InternalFileInput!): Message!
    attachFilesToInternal(fileIds: [ID], internalId: ID): Message!
    deleteInternalFile(id: ID!): Message!
    deleteInternalFiles(id: [ID]): Message!
  }
`
