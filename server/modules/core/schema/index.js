export default `
  type DeletedItem {
    id: ID!
  }

  type Message {
    type: String
    text: String!
    messageType: String!
    id: ID,
    item: String
  }

  type MessageMult {
    type: String
    text: String!
    messageType: String!
    ids: [ID],
    item: String
  }

  type AuthMessage {
    type: String
    text: String!
    item: String
    messageType: String!
    token: String
    userId: ID
  }
`
