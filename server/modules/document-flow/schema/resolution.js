module.exports = `
  type Resolution {
    id: ID!

    "Текст резолюции"
    text: String!

    "Срок исполнения"
    expirationDate: String

    "Ссылка на внешний входящий документ"
    ExtIncomingId: ID

    "Ссылка на внутренний входящий документ"
    IntIncomingId: ID

    "Ссылка на внутренний документ"
    InternalId: ID

    "Ссылка на автора резолюции"
    authorId: ID!

    "Исполнена ли резолюция"
    complete: Boolean

    "Дата создания"
    createdAt: TimeStamp!

    "Дата последнего изменения"
    updatedAt: TimeStamp!
  }

  type ResolutionP {
    id: ID

    "Текст резолюции"
    text: String

    "Срок исполнения"
    expirationDate: String

    "Ссылка на внешний входящий документ"
    ExtIncoming: ExtIncoming

    "Ссылка на внутренний входящий документ"
    IntIncoming: IntIncoming

    "Ссылка на внутренний документ"
    Internal: Internal

    "Ссылка на автора резолюции"
    author: EmployeeP

    Executants: [EmployeeP]

    "Исполнена ли резолюция"
    complete: Boolean

    "Дата создания"
    createdAt: TimeStamp

    "Дата последнего изменения"
    updatedAt: TimeStamp
  }

  type ResolutionWithExecutants {
    id: ID

    "Текст резолюции"
    text: String

    "Срок исполнения"
    expirationDate: Date

    "Ссылка на внешний входящий документ"
    extIncoming: ID

    "Ссылка на внутренний входящий документ"
    intIncoming: ID

    "Ссылка на внутренний документ"
    internal: ID

    "Ссылка на автора резолюции"
    author: ID

    executants: [ID]

    "Исполнена ли резолюция"
    complete: Boolean

    "Дата создания"
    createdAt: TimeStamp

    "Дата последнего изменения"
    updatedAt: TimeStamp
  }

  input ResolutionInput {
    "Текст резолюции"
    text: String!

    "Срок исполнения"
    expirationDate: Date

    "Ссылка на внешний входящий документ"
    ExtIncomingId: ID

    "Ссылка на внутренний входящий документ"
    IntIncomingId: ID

    "Ссылка на внутренний документ"
    InternalId: ID

    "Ссылка на автора резолюции"
    authorId: ID!

    "Исполнена ли резолюция"
    complete: Boolean
  }

  type Documents {
    ExtIncomings: [ExtIncoming]
    IntIncomings: [IntIncoming]
    Internals: [Internal]
  }

  type DocumentsP {
    ExtIncomings: [ExtIncomingP]
    IntIncomings: [IntIncomingP]
    Internals: [InternalP]
  }

  type Query {
    "Получить все резолюции"
    getAllResolution: [Resolution]


    getAllResolutionsInDep(id: ID!): [Resolution]
    getAllResolutionsInDepE(id: ID!): [ResolutionWithExecutants]
    getResolutionsByIds(ids: [ID]!): [ResolutionWithExecutants]

    "Получить конкретную резолюцию"
    getResolution(id: ID!): Resolution


    "Получить автора конкретной резолюции"
    getResolutionAuthor(id: ID!): Employee!

    "Получить всех исполнителей конкретной резолюции"
    getResolutionEmployees(id: ID!): [Employee]

    "Получить все документы с неисполненными резолючиями"
    getAllDocumentsNotComplete: Documents

    "Получить все документы с просроченными резолюциями"
    getAllDocumentsOutOfDate: Documents

    "Получить все документы со сроком исполнения до указанной даты"
    getAllDocumentsToDate(date: Date!): Documents

    "Получить все документы с резолюцией конкретного работника"
    getAllDocumentsByResolutionAuthor(id: ID!): Documents
  }

  type Mutation {
    addResolution(
      resolution: ResolutionInput!
      executantsId: [ID]
      ): Message!
    editResolution(
      id: ID!
      resolution: ResolutionInput!
      executantsId: [ID]
      ): Message!
    comleteResolution(id: ID!): Message!
    deleteResolution(id: ID!): Message!
  }
`
