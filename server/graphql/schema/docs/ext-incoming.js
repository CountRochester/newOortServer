module.exports = `
  type ExtIncoming {
    id: ID!

    "Краткое содержание"
    subject: String

    "Исходящий номер документа, полученный в организации-отправителе"
    extNumber: String!

    "Дата исходящего номера"
    extDate: Date!

    "Требуется ли ответ"
    needAnswer: Boolean

    "Ссылка на тип документа"
    TypeId: ID

    "Дата создания"
    createdAt: TimeStamp!

    "Дата последнего изменения"
    updatedAt: TimeStamp!
  }

  type ExtIncomingP {
    id: ID

    "Краткое содержание"
    subject: String

    "Исходящий номер документа, полученный в организации-отправителе"
    extNumber: String

    "Дата исходящего номера"
    extDate: Date

    "Требуется ли ответ"
    needAnswer: Boolean

    "nип документа"
    Type: Type

    "Cостояние документа"
    State: [ExtIncStateP]

    IncomingNumbers: [IncomingNumberP]
    Resolutions: [ResolutionP]
    Temas: [TemaP]
    Authors: [ExtEmployeeP]
    Organisation: [Organisation]
    Departments: [DepartmentP]
    Files: [ExtIncFile]
    Answers: [ExtOutgoing]

    "Дата создания"
    createdAt: TimeStamp

    "Дата последнего изменения"
    updatedAt: TimeStamp
  }

  type ExtIncStateReq {
    ExtIncStateId: ID
    StateId: ID
    StateName: String
  }

  type ExtIncNumber {
    ExtIncNumberId: ID
    incNumberDigit: Int
    incDate: Date!
    prefix: ID
  }

  type ExtIncDepData {
    DepartmentId: ID
    state: ExtIncStateReq
    incNumber: ExtIncNumber
  }

  type Note {
    id: ID!
    DepartmentId: ID
    text: String
  }

  type ExtIncomingRequest {
    id: ID

    "Краткое содержание"
    subject: String

    "Исходящий номер документа, полученный в организации-отправителе"
    extNumber: String

    "Дата исходящего номера"
    extDate: Date

    "Требуется ли ответ"
    needAnswer: Boolean

    "nип документа"
    type: String
    TypeId: ID

    "Cостояние документа"
    state: String
    extIncStateId: ID

    notes: [Note]
    
    ExtIncDepData: [ExtIncDepData]

    incNumber: String
    incNumberDigit: Int
    incDate: Date
    extIncNumberId: ID
    temas: String
    temasId: [ID]
    authors: String
    authorsId: [ID]
    Organisation: String
    OrganisationId: [ID]
    Executants: String
    ExecutantsId: [ID]
    resolutions: [ID]
    AnswersId: [ID]
    Answers: [String]
    Files: String
    FilesId: [ID]
    updatedAt: Date
  }

  input ExtIncomingInput {
    "Краткое содержание"
    subject: String

    "Исходящий номер документа, полученный в организации-отправителе"
    extNumber: String!

    "Дата исходящего номера"
    extDate: Date!

    "Требуется ли ответ"
    needAnswer: Boolean

    "Ссылка на тип документа"
    TypeId: ID
  }

  input ExtIncomingEdit {
    subject: String
    extNumber: String
    extDate: Date
    needAnswer: Boolean
    TypeId: ID
  }

  input ExtIncInput {
    extNumber: String
    extDate: Date
    subject: String
    needAnswer: Boolean
    TypeId: ID
    temaId: [ID]
    authorId: ID
    execId: [ID]
    filesId: [ID]
    resolutions: String
  }

  input depDataInput {
    DepartmentId: ID
    incNumber: Int
    incDate: Date
    prefix: String
    state: ID
    noteText: String
    changedState: Int
  }

  input PublicateExtIncoming {
    ExtIncoming: ExtIncInput
    DepData: depDataInput
  }

  type Query {
    updateExtIncomingRequest(id: ID!, time: String!): [ExtIncomingRequest]
    getExtIncomingRequest(id: ID!): [ExtIncomingRequest]
    getExtIncomingRequestById(id: ID!, depId: ID): ExtIncomingRequest
    getExtIncomingRequestByIds(ids: [ID]!): [ExtIncomingRequest]

    "Получить все внешние входящие документы"
    getAllExtIncoming: [ExtIncoming]

    "Получить все внешние входящие документы в конкретном отделе"
    getAllExtIncomingInDepartment(id: ID!): [ExtIncoming]

    "Получить конкретный внешний входящий документ"
    getExtIncoming(id: ID!): ExtIncoming

    "Получить тип конкретного внешнего входящего документа"
    getExtIncomingType(id: ID!): Type

    "Получить все резолюции конкретного внешнего входящего документа"
    getExtIncomingResolutions(id: ID!): [Resolution]

    "Получить все темы конкретного внешнего входящего документа"
    getExtIncomingTemas(id: ID!): [Tema]

    "Получить всех подписантов конкретного внешнего входящего документа"
    getExtIncomingAuthors(id: ID!): [ExtEmployee]

    "Получить все организации-отправители конкретного внешнего входящего документа"
    getExtIncomingOrganisations(id: ID!): [Organisation]

    "Получить отделы, куда направлен конкретный внешний входящий документ"
    getExtIncomingDepartments(id: ID!): [Department]

    "Получить все файлы, прикреплённые к конкретному внешнему входящему документу"
    getExtIncomingFile(id: ID!): [ExtIncFile]

    "Получить все ответы на конкретный внешний входящий документ"
    getExtIncomingAnswers(id: ID!): [ExtOutgoing]
  }

  type Mutation {
    addExtIncoming(
      extIncoming: ExtIncomingInput!
      resId: [ID]
      temaId: [ID]
      authorId: [ID]
      execId: [ID]
      fileId: [ID]
      ): Message!
    editExtIncoming(
      id: ID!
      extIncoming: ExtIncomingEdit!
      resId: [ID]
      temaId: [ID]
      authorId: [ID]
      execId: [ID]
      statesId: [ID]
      fileId: [ID]
      ): Message!
    deleteExtIncoming(id: ID!): Message!
    setNextStateExtIncoming(id: ID!, depsId: [ID!]!): Message!
    setPreviousStateExtIncoming(id: ID!, depsId: [ID!]!): Message!
    sendExtIncomingToExecs(id: ID!, execsId: [ID]): Message!
    publicateExtIncoming(id: ID, publicateData: PublicateExtIncoming): Message!
  }
`
