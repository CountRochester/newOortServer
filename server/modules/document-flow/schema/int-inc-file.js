export default `
  type IntIncFile {
    id: ID!
    file: String!
    intIncomingId: ID
    createdAt: String!
    updatedAt: String!
  }

  input IntIncFileInput {
    file: String!
    intIncomingId: ID
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
    deleteIntIncFiles(ids: [ID]!): MessageMult!
  }
`
