export default `
  type InternalFile {
    id: ID!
    file: String!
    internalId: ID
    createdAt: String!
    updatedAt: String!
  }

  input InternalFileInput {
    file: String!
    internalId: ID
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
    deleteInternalFiles(ids: [ID]): MessageMult!
  }
`
