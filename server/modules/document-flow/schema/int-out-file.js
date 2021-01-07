export default `
  type IntOutFile {
    id: ID!
    file: String!
    intOutgoingId: ID
    createdAt: String!
    updatedAt: String!
  }

  input IntOutFileInput {
    file: String!
    intOutgoingId: ID
  }

  type Query {
    getAllIntOutFile: [IntOutFile]
    getIntOutFile(id: ID!): IntOutFile
    getIntOutFiles(ids: [ID]!): [IntOutFile]
  }

  type Mutation {
    addIntOutFile(intOutFile: IntOutFileInput!): Message!
    editIntOutFile(id: ID! intOutFile: IntOutFileInput!): Message!
    attachFilesToIntOut(fileIds: [ID], intOutId: ID): Message!
    deleteIntOutFiles(ids: [ID]): MessageMult!
  }
`
