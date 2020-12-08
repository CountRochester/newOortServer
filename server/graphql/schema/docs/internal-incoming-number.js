module.exports = `
  type InternalIncomingNumber {
    id: ID!

    "Входящий номер для внешнего входящего документа"
    incNumber: Int!

    "Дата внешнего входящего документа"
    incDate: Date!

    prefix: String

    "Ссылка на отдел, где дан входящий номер"
    DepartmentId: ID

    "Ссылка на внешний входящий документ"
    InternalId: ID

    "Дата создания"
    createdAt: TimeStamp!

    "Дата последнего изменения"
    updatedAt: TimeStamp!
  }

  input InternalIncomingNumberInput {
    "Входящий номер для внешнего входящего документа"
    incNumber: Int!

    prefix: String

    "Дата внешнего входящего документа"
    incDate: Date!

    "Ссылка на отдел, где дан входящий номер"
    DepartmentId: ID

    "Ссылка на внешний входящий документ"
    InternalId: ID
  }

  type Query {
    "Получить все входящие номера"
    getAllInternalIncomingNumber: [InternalIncomingNumber]

    "Получить конкретный входящий номер"
    getInternalIncomingNumber(id: ID!): InternalIncomingNumber
    getInternalIncomingNumbers(ids: [ID]!): [InternalIncomingNumber]

  }

  type Mutation {
    addInternalIncomingNumber(internalIncomingNumber: InternalIncomingNumberInput!): Message!
    editInternalIncomingNumber(id: ID! internalIncomingNumber: InternalIncomingNumberInput!): Message!
    deleteInternalIncomingNumber(id: ID!): Message!
  }
`
