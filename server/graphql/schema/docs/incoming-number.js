module.exports = `
  type IncomingNumber {
    id: ID!

    "Входящий номер для внешнего входящего документа"
    incNumber: Int!

    "Дата внешнего входящего документа"
    incDate: Date!

    prefix: String

    "Ссылка на отдел, где дан входящий номер"
    DepartmentId: ID

    "Ссылка на внешний входящий документ"
    ExtIncomingId: ID

    "Дата создания"
    createdAt: TimeStamp!

    "Дата последнего изменения"
    updatedAt: TimeStamp!
  }

  type IncomingNumberP {
    id: ID

    "Входящий номер для внешнего входящего документа"
    incNumber: Int

    "Дата внешнего входящего документа"
    incDate: Date

    "Ссылка на отдел, где дан входящий номер"
    Department: DepartmentP

    "Дата создания"
    createdAt: TimeStamp

    "Дата последнего изменения"
    updatedAt: TimeStamp
  }

  input IncomingNumberInput {
    "Входящий номер для внешнего входящего документа"
    incNumber: Int!

    "Дата внешнего входящего документа"
    incDate: Date!

    prefix: String


    "Ссылка на отдел, где дан входящий номер"
    DepartmentId: ID

    "Ссылка на внешний входящий документ"
    ExtIncomingId: ID
  }

  type Query {
    "Получить все входящие номера"
    getAllIncomingNumber: [IncomingNumber]

    "Получить конкретный входящий номер"
    getIncomingNumber(id: ID!): IncomingNumber
    getIncomingNumbers(ids: [ID]!): [IncomingNumber]

    "Получить отдел для конкретного входящего номера"
    getIncomingNumberDepartment(id: ID!): Department

    "Получить внешний входящий документ для конкретного входящего номера"
    getIncomingNumberExtIncoming(id: ID!): ExtIncoming

    "Получить все входящие номера для конкретного отдела"
    getIncomingNumberByDepartment(id: ID!): [IncomingNumber]

    getIncomingNumberInDepartment(id: ID! depId: ID!): [IncomingNumber]

    "Получить все входящие номера для конкретного внешнего входящего документа"
    getIncomingNumberByExtIncoming(id: ID!): [IncomingNumber]

  }

  type Mutation {
    addIncomingNumber(incomingNumber: IncomingNumberInput!): Message!
    editIncomingNumber(id: ID! incomingNumber: IncomingNumberInput!): Message!
    deleteIncomingNumber(id: ID!): Message!
  }
`
