module.exports = `
  type IntIncomingNumber {
    id: ID!

    "Входящий номер для внешнего входящего документа"
    incNumber: Int!

    "Дата внешнего входящего документа"
    incDate: Date!

    prefix: String

    "Ссылка на отдел, где дан входящий номер"
    DepartmentId: ID

    "Ссылка на внешний входящий документ"
    IntIncomingId: ID

    "Дата создания"
    createdAt: TimeStamp!

    "Дата последнего изменения"
    updatedAt: TimeStamp!
  }

  input IntIncomingNumberInput {
    "Входящий номер для внешнего входящего документа"
    incNumber: Int!

    "Дата внешнего входящего документа"
    incDate: Date!

    prefix: String

    "Ссылка на отдел, где дан входящий номер"
    DepartmentId: ID

    "Ссылка на внешний входящий документ"
    IntIncomingId: ID
  }

  type Query {
    "Получить все входящие номера"
    getAllIntIncomingNumber: [IntIncomingNumber]

    "Получить конкретный входящий номер"
    getIntIncomingNumber(id: ID!): IntIncomingNumber
    getIntIncomingNumbers(ids: [ID]!): [IntIncomingNumber]

  }

  type Mutation {
    addIntIncomingNumber(intIncomingNumber: IntIncomingNumberInput!): Message!
    editIntIncomingNumber(id: ID! intIncomingNumber: IntIncomingNumberInput!): Message!
    deleteIntIncomingNumber(id: ID!): Message!
  }
`
