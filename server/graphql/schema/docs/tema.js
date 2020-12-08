module.exports = `
  type Tema {
    id: ID!

    "Название темы"
    name: String!

    "Ссылка на контракт"
    ContractId: ID

    "Дата создания"
    createdAt: TimeStamp!

    "Дата последнего изменения"
    updatedAt: TimeStamp!
  }

  type TemaP {
    id: ID

    "Название темы"
    name: String

    "Ссылка на контракт"
    Contract: Contract

    "Дата создания"
    createdAt: TimeStamp

    "Дата последнего изменения"
    updatedAt: TimeStamp
  }

  input TemaInput {
    "Название темы"
    name: String!

    "Ссылка на контракт"
    ContractId: ID
  }

  type Query {
    "Получить все темы"
    getAllTema: [Tema]

    "Получить конкретную тему"
    getTema(id: ID!): Tema

    "Получить контракт темы"
    getTemaContract(id: ID!): Contract

    "Получить все внешние входящие документы по конкретной теме"
    getExtIncomingsByTema(id: ID!): [ExtIncoming]

    "Получить все внешние исходящие документы по конкретной теме"
    getExtOutgoingByTema(id: ID!): [ExtOutgoing]

    "Получить все внутренние исходящие документы по конкретной теме"
    getIntOutgoingByTema(id: ID!): [IntOutgoing]

    "Получить все внутренние входящие документы по конкретной теме"
    getIntIncomingByTema(id: ID!): [IntIncoming]

    "Получить все внутренние документы по конкретной теме"
    getInternalByTema(id: ID!): [Internal]
  }

  type Mutation {
    addTema(tema: TemaInput!): Message!
    editTema(id: ID! tema: TemaInput!): Message!
    deleteTema(id: ID!): Message!
  }
`
