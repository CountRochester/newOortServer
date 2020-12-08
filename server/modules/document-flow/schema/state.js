module.exports = `
  type State {
    id: ID!

    "Название состояния"
    name: String!

    "Тип состояния"
    type: String!

    "Ссылка на состояние-предшественник"
    parentStateId: ID

    "Дата создания"
    createdAt: TimeStamp!

    "Дата последнего изменения"
    updatedAt: TimeStamp!
  }

  type StateP {
    id: ID

    "Название состояния"
    name: String

    "Тип состояния"
    type: String

    "Ссылка на состояние-предшественник"
    parentState: StateP

    "Дата создания"
    createdAt: TimeStamp

    "Дата последнего изменения"
    updatedAt: TimeStamp
  }

  input StateInput {
    "Дата создания"
    name: String!

    "Тип состояния"
    type: String!

    "Ссылка на состояние-предшественник"
    parentStateId: ID
  }

  type Query {
    "Получить все состояния"
    getAllState: [State]

    "Получить конкретное состояние"
    getState(id: ID!): State

    "Получить внешние входящие документы по состоянию"
    getExtIncomingsByState(id: ID!): [ExtIncoming]

    "Получить внешние исходящие документы по состоянию"
    getExtOutgoingsByState(id: ID!): [ExtOutgoing]

    "Получить внутренние входящие документы по тисостояниюпу"
    getIntIncomingsByState(id: ID!): [IntIncoming]

    "Получить внутренние исходящие документы по состоянию"
    getIntOutgoingsByState(id: ID!): [IntOutgoing]

    "Получить внутренние документы по состоянию"
    getInternalsByState(id: ID!): [Internal]

    "Получить предшествующее состояние"
    getParentState(id: ID!): State

    "Получить следующее состояние"
    getNextState(id: ID!): State
  }

  type Mutation {
    addState(state: StateInput!): Message!
    editState(id: ID! state: StateInput!): Message!
    deleteState(id: ID!): Message!
  }
`
