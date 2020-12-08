module.exports = `
  type IntOutgoing {
    id: ID!

    "Исходящий номер документа"
    outNumber: Int!

    "Дата исходящего номера документа"
    outDate: Date!

    prefix: String

    "Краткое содержание"
    subject: String

    "Ссылка на исполнителя"
    author: ID

    note: String

    "Ссылка на тип документа"
    TypeId: ID

    "Ссылка на текущее состояние"
    StateId: ID

    "Дата создания"
    createdAt: TimeStamp!

    "Дата последнего изменения"
    updatedAt: TimeStamp!
  }

  type IntOutgoingP {
    id: ID!

    "Исходящий номер документа"
    outNumber: Int!

    "Дата исходящего номера документа"
    outDate: Date!

    "Краткое содержание"
    subject: String

    "Ссылка на исполнителя"
    Author: CurrentPosition

    "Ссылка на тип документа"
    Type: Type

    "Ссылка на текущее состояние"
    State: State

    Podpisants: [CurrentPosition]
    AddresseeDeps: [DepartmentP]
    Temas: [TemaP]
    Files: [IntOutFile]
    IsAnswerOn: [IntIncoming]
    IsIncomings: [IntIncoming]

    "Дата создания"
    createdAt: TimeStamp!

    "Дата последнего изменения"
    updatedAt: TimeStamp!
  }

  type IntOutgoingRequest {
    id: ID!

    "Исходящий номер документа"
    outNumber: String!
    outNumberDigit: Int
    prefix: String
    "Дата исходящего номера документа"
    outDate: Date!

    "Краткое содержание"
    subject: String

    "Ссылка на исполнителя"
    author: String
    authorId: ID
    department: String
    departmentId: ID

    "Ссылка на тип документа"
    type: String
    typeId: ID

    "Ссылка на текущее состояние"
    state: String
    stateId: ID
    note: String

    addressees: String
    addresseesId: [ID]
    podpisants: String
    podpisantsId: [ID]
    temas: String
    temasId: [ID]
    files: [String]
    filesId: [ID]
    isAnswerOn: [String]
    isAnswerOnId: [ID]
    updatedAt: Date
  }

  input IntOutInput {
    prefix: String
    outNumber: Int
    outDate: Date
    subject: String
    authorId: ID
    TypeId: ID
    StateId: ID
    temaId: [ID]
    addresseeId: [ID]
    podpisantId: [ID]
    answerId: [ID]
    note: String
    filesId: [ID]
    stateChanged: Int
  }

  input PublicateIntOutgoing {
    IntOutgoing: IntOutInput
  }

  input IntOutgoingInput {
    "Исходящий номер документа"
    outNumber: Int!

    "Дата исходящего номера документа"
    outDate: Date!

    prefix: String

    "Краткое содержание"
    subject: String

    note: String

    "Ссылка на исполнителя"
    author: ID

    "Ссылка на тип документа"
    TypeId: ID

    "Ссылка на текущее состояние"
    StateId: ID
  }

  type Query {
    updateIntOutgoingRequest(id: ID!, time: String!): [IntOutgoingRequest]
    getIntOutgoingRequest(id: ID! ): [IntOutgoingRequest]
    getIntOutgoingRequestById(id: ID!): IntOutgoingRequest
    getIntOutgoingRequestByIds(ids: [ID]!): [IntOutgoingRequest]

    "Получить все внутренние исходящие документы"
    getAllIntOutgoing: [IntOutgoing]

    "Получить все внутренние исходящие документы для конкретного отдела"
    getAllIntOutgoingInDepartment(id: ID!): [IntOutgoing]

    "Получить конкретный внутренний исходящий документ"
    getIntOutgoing(id: ID!): IntOutgoing

    "Получить тип конкретного внутреннего исходящего документа"
    getIntOutgoingType(id: ID!): Type

    "Получить текущее состояние конкретного внутреннего исходящего документа"
    getIntOutgoingState(id: ID!): State

    "Получить всех адресатов конкретного внутреннего исходящего документа"
    getIntOutgoingToDepartments(id: ID!): [Department]

    "Получить все темы конкретного внутреннего исходящего документа"
    getIntOutgoingTemas(id: ID!): [Tema]

    "Получить автора конкретного внутреннего исходящего документа"
    getIntOutgoingAuthor(id: ID!): CurrentPosition

    "Получить отдел автора конкретного внутреннего исходящего документа"
    getIntOutgoingDepartment(id: ID!): Department

    "Получить всех подписантов конкретного внутреннего исходящего документа"
    getIntOutgoingPodpisants(id: ID!): [CurrentPosition]

    "Получить прикреплённые файлы конкретного внутреннего исходящего документа"
    getIntOutgoingFiles(id: ID!): [IntOutFile]

    "Получить внутренние входящие документы, ответом на которые является конкретный внутренний исходящий документ"
    getIntOutgoingAnswers(id: ID!): [IntIncoming]

    "Получить внутренние входящие документы, от конкретного внутреннего исходящего документа"
    getIntOutgoingIncomings(id: ID!): [IntIncoming]
  }

  type Mutation {
    addIntOutgoing(
      intOutgoing: IntOutgoingInput!

      "Ссылки на адресатов"
      addresseeId: [ID]

      "Ссылки на темы"
      temaId: [ID]

      "Ссылки на подписантов"
      podpisantId: [ID]

      "Ссылки на входящие документы, на которые отвечает данный документ"
      answerId: [ID]

      "Ссылки на файлы, прикреплённые к данному документу"
      fileId: [ID]
      ): Message!

    editIntOutgoing(
      id: ID!
      intOutgoing: IntOutgoingInput!

      "Ссылки на адресатов"
      addresseeId: [ID]

      "Ссылки на темы"
      temaId: [ID]

      "Ссылки на подписантов"
      podpisantId: [ID]

      "Ссылки на входящие документы, на которые отвечает данный документ"
      answerId: [ID]

      "Ссылки на файлы, прикреплённые к данному документу"
      fileId: [ID]
      ): Message!

    deleteIntOutgoing(id: ID!): Message!
    addNoteToIntOutgoing (id: ID!, note: String!): Message!
    setNextStateIntOutgoing(id: ID!): Message!
    setPreviousStateIntOutgoing(id: ID!): Message!
    setStateIntOutgoing(id: ID!, stateId: ID!): Message!
    sendIntOutgoing(id: ID!): Message!
    publicateIntOutgoing(id: ID, publicateData: PublicateIntOutgoing): Message!
  }
`
