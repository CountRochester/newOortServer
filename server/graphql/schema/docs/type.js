module.exports = `
  type Type {
    id: ID!

    "Название типа документа"
    name: String!

    "Дата создания"
    createdAt: TimeStamp!

    "Дата последнего изменения"
    updatedAt: TimeStamp!
  }

  input TypeInput {
    "Название типа документа"
    name: String!
  }

  type Query {
    "Получить все типы документов"
    getAllType: [Type]

    "Получить конкретный тип документа"
    getType(id: ID!): Type

    "Получить внешние входящие документы по типу"
    getExtIncomingsByType(id: ID!): [ExtIncoming]

    "Получить внешние исходящие документы по типу"
    getExtOutgoingsByType(id: ID!): [ExtOutgoing]

    "Получить внутренние входящие документы по типу"
    getIntIncomingsByType(id: ID!): [IntIncoming]

    "Получить внутренние исходящие документы по типу"
    getIntOutgoingsByType(id: ID!): [IntOutgoing]

    "Получить внутренние документы по типу"
    getInternalsByType(id: ID!): [Internal]
  }

  type Mutation {
    addType(type: TypeInput!): Message!
    editType(id: ID! type: TypeInput!): Message!
    deleteType(id: ID!): Message!
  }
`
