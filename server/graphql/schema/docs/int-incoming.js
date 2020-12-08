module.exports = `
  type IntIncoming {
    id: ID!

    "Краткое содержание"
    subject: String

    "Исходящий номер документа, полученный в отделе-отправителе"
    extNumber: Int
    extNumberPrefix: String

    "Дата исходящего номера"
    extDate: Date!

    "Требуется ли ответ"
    needAnswer: Boolean

    "Тип документа"
    TypeId: ID

    "Дата создания"
    createdAt: TimeStamp!

    "Дата изменения"
    updatedAt: TimeStamp!
  }

  type IntIncomingP {
    id: ID

    "Краткое содержание"
    subject: String

    "Исходящий номер документа, полученный в отделе-отправителе"
    extNumber: Int
    extNumberPrefix: String

    "Дата исходящего номера"
    extDate: Date

    "Требуется ли ответ"
    needAnswer: Boolean

    "Тип документа"
    Type: Type

    Resolutions: [ResolutionP]
    Temas: [TemaP]
    Podpisants: [EmployeeP]
    AddresseeDeps: [DepartmentP]
    Files: [IntIncFile]
    Answers: [IntOutgoing]
    SourceOutgoing: IntOutgoing

    "Дата создания"
    createdAt: TimeStamp

    "Дата изменения"
    updatedAt: TimeStamp
  }

  type IntIncStateReq {
    IntIncStateId: ID
    StateId: ID
    StateName: String
  }

  type IntIncNumber {
    IntIncNumberId: ID
    incNumberDigit: Int
    incDate: Date
    prefix: ID
  }

  type IntIncDepData {
    DepartmentId: ID
    state: IntIncStateReq
    incNumber: IntIncNumber
  }

  type IntIncomingRequest {
    id: ID,
    subject: String,
    extNumber: Int,
    extNumberPrefix: String,
    extDate: Date,
    needAnswer: Boolean,
    type: String,
    typeId: ID,
    state: String,
    stateId: ID,

    notes: [Note]

    IntIncDepData: [IntIncDepData]

    incNumber: String,
    incNumberDigit: Int,
    incNumberId: ID
    incDate: Date,
    temas: String, 
    temasId: [ID],
    author: String,
    authorId: ID,
    podpisants: String,
    podpisantsId: [ID],
    addressee: String,
    addresseeId: [ID],
    answers: [String],
    answersId: [ID],
    sourceOutgoing: String,
    sourceOutgoingId: ID,
    resolutions: [ID],
    Files: String,
    FilesId: [ID]
    updatedAt: Date
  }

  input IntIncInput {
    subject: String
    extNumber: Int
    extNumberPrefix: String
    extDate: Date
    needAnswer: Boolean
    TypeId: ID
    temaId: [ID]
    authorId: ID
    podpisantId: [ID]
    addresseeId: [ID]
    filesId: [ID]
    resolutions: String
  }

  input PublicateIntIncoming {
    IntIncoming: IntIncInput
    DepData: depDataInput
  }

  input IntIncomingInput {

    "Краткое содержание"
    subject: String

    "Исходящий номер документа, полученный в отделе-отправителе"
    extNumber: Int
    extNumberPrefix: String

    "Дата исходящего номера"
    extDate: Date

    "Требуется ли ответ"
    needAnswer: Boolean

    "Тип документа"
    TypeId: ID

  }

  type Query {
    updateIntIncomingRequest(id: ID!, time: String!): [IntIncomingRequest]
    getIntIncomingRequest(id: ID!): [IntIncomingRequest]
    getIntIncomingRequestById(id: ID!, depId: ID): IntIncomingRequest
    getIntIncomingRequestByIds(ids: [ID]!): [IntIncomingRequest]

    "Получить все внутренние входящие документы"
    getAllIntIncoming: [IntIncoming]

    "Получить все внутренние входящие документы для конкретного отдела"
    getAllIntIncomingInDepartment(id: ID!): [IntIncoming]

    "Получить конкретный внутренний входящий документ"
    getIntIncoming(id: ID!): IntIncoming

    "Получить тип конкретного внутреннего входящего документа"
    getIntIncomingType(id: ID!): Type

    "Получить текущее состояние конкретного внутреннего входящего документа"
    getIntIncomingState(id: ID!): State

    "Получить все резолюции конкретного внутреннего входящего документа"
    getIntIncomingResolutions(id: ID!): [Resolution]

    "Получить все темы конкретного внутреннего входящего документа"
    getIntIncomingTemas(id: ID!): [Tema]

    "Получить подписантов конкретного внутреннего входящего документа"
    getIntIncomingPodpisants(id: ID!): [Employee]

    "Получить отделы подписантов конкретного внутреннего входящего документа"
    getIntIncomingDepartments(id: ID!): [Department]

    "Получить отделы-получатели конкретного внутреннего входящего документа"
    getIntIncomingToDepartments(id: ID!): [Department]

    "Получить файлы, прикреплённые к конкретному внутреннему входящему документу"
    getIntIncomingFiles(id: ID!): [IntIncFile]

    "Получить ответы на конкретный внутренний входящий документ"
    getIntIncomingAnswers(id: ID!): [IntOutgoing]

    "Получить исходящий документ, являющийся исходным для конкретного внутреннего входящего документа"
    getIntIncomingSource(id: ID!): IntOutgoing
  }

  type Mutation {
    addIntIncoming(
      intIncoming: IntIncomingInput!

      "Резолюции"
      resId: [ID]

      "Темы"
      temaId: [ID]

      "Подписанты"
      podpisantId: [ID]

      "Исполнитель"
      authorId: ID

      "Кому направляется документ"
      addresseeId: [ID]

      "Файлы, прикреплённые к документу"
      fileId: [ID]
      ): Message!

    editIntIncoming(
      id: ID!
      intIncoming: IntIncomingInput!

      "Резолюции"
      resId: [ID]

      "Темы"
      temaId: [ID]

      "Подписанты"
      podpisantId: [ID]

      "Исполнитель"
      authorId: ID

      "Кому направляется документ"
      addresseeId: [ID]

      "Файлы, прикреплённые к документу"
      fileId: [ID]
      ): Message!

    deleteIntIncoming(id: ID!): Message!
    setNextStateIntIncoming(id: ID!, depsId: [ID]): Message!
    setPreviousStateIntIncoming(id: ID!, depsId: [ID]): Message!
    sendIntIncomingToExecs(id: ID!, execsId: [ID]): Message!
    publicateIntIncoming(id: ID, publicateData: PublicateIntIncoming): Message!
  }
`
