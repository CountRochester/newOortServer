module.exports = `
  type Internal {
    id: ID!

    "Краткое содержание"
    subject: String

    "Номер документа"
    docNumber: String

    docNumberPrefix: String

    "Дата документа"
    docDate: Date

    "Тип документа"
    TypeId: ID

    "Текущее состояние документа"
    StateId: ID

    "Автор документа"
    authorId: ID

    "Дата создания"
    createdAt: TimeStamp!

    "Дата изменения"
    updatedAt: TimeStamp!
  }

  type InternalP {
    id: ID

    "Входящий номер отдела"
    incNumber: Int

    "Дата входящего номера"
    incDate: Date

    "Краткое содержание"
    subject: String

    "Номер документа"
    docNumber: String

    "Дата документа"
    docDate: Date

    "Тип документа"
    Type: Type

    "Текущее состояние документа"
    State: State

    "Автор документа"
    Author: CurrentPosition

    Resolutions: [ResolutionP]
    Temas: [TemaP]
    Podpisants: [EmployeeP]
    AddresseeDeps: [DepartmentP]
    Files: [IntIncFile]

    "Дата создания"
    createdAt: TimeStamp

    "Дата изменения"
    updatedAt: TimeStamp
  }

  type InternalStateReq {
    InternalStateId: ID!
    StateId: ID!
    StateName: String
  }

  type InternalIncNumber {
    InternalIncNumberId: ID!
    incNumberDigit: Int!
    incDate: Date!
    prefix: ID
  }

  type InternalDepData {
    DepartmentId: ID
    state: InternalStateReq
    incNumber: InternalIncNumber
  }

  type InternalRequest {
    id: ID!
    incNumber: String
    incNumberDigit: Int
    incDate: Date
    incNumberId: ID
    subject: String
    docNumber: String
    docDate: Date
    docNumberPrefix: String

    notes: [Note]

    InternalDepData: [InternalDepData]
    
    type: String
    typeId: ID
    temas: String, 
    temasId: [ID],
    state: String
    stateId: ID
    author: String
    authorId: ID
    podpisants: String,
    podpisantsId: [ID],
    addressee: String,
    addresseeId: [ID],
    resolutions: [ID],
    Files: [String],
    FilesId: [ID]
    updatedAt: Date
  }

  input IntInput {
    subject: String
    docNumber: String
    docNumberPrefix: String
    docDate: Date
    TypeId: ID
    temaId: [ID]
    authorId: ID
    podpisantId: [ID]
    addresseeId: [ID]
    filesId: [ID]
    resolutions: String
  }

  input PublicateInternal {
    Internal: IntInput
    DepData: depDataInput
  }

  input InternalInput {

    "Краткое содержание"
    subject: String

    "Номер документа"
    docNumber: String

    docNumberPrefix: String

    "Дата документа"
    docDate: Date

    "Тип документа"
    TypeId: ID

    "Автор документа"
    authorId: ID
  }

  type Query {
    updateInternalRequest(id: ID!, time: String!): [InternalRequest]
    getInternalRequest(id: ID!): [InternalRequest]
    getInternalRequestById(id: ID! depId: ID): InternalRequest
    getInternalRequestByIds(ids: [ID]!): [InternalRequest]

    "Получить все внутренние документы"
    getAllInternal: [Internal]

    "Получить все внутренние документы для конкретного отдела"
    getAllInternalInDepartment(id: ID!): [Internal]

    "Получить все внутренние документы автором которых является конкретный отдел"
    getAllInternalInDepartmentByAuthor(id: ID!): [Internal]

    "Получить конкретный внутренний документ"
    getInternal(id: ID!): Internal

    "Получить тип конкретного внутреннего документа"
    getInternalType(id: ID!): Type

    "Получить текущее состояние конкретного внутреннего документа"
    getInternalState(id: ID!): State

    "Получить все резолюции конкретного внутреннего документа"
    getInternalResolutions(id: ID!): [Resolution]

    "Получить все темы конкретного внутреннего документа"
    getInternalTemas(id: ID!): [Tema]

    "Получить подписантов конкретного внутреннего документа"
    getInternalPodpisants(id: ID!): [CurrentPosition]

    "Получить отделы подписантов конкретного внутреннего документа"
    getInternalDepartments(id: ID!): [Department]

    "Получить автора конкретного внутреннего документа"
    getInternalAuthor(id: ID!): CurrentPosition

    "Получить отдел автора конкретного внутреннего документа"
    getInternalAuthorDepartment(id: ID!): Department

    "Получить отделы-получатели конкретного внутреннего документа"
    getInternalToDepartments(id: ID!): [Department]

    "Получить файлы, прикреплённые к конкретному внутреннему документу"
    getInternalAttachedFiles(id: ID!): [IntIncFile]
  }

  type Mutation {
    addInternal(
      internal: InternalInput!

      "Резолюции"
      resId: [ID]

      "Темы"
      temaId: [ID]

      "Подписанты"
      podpisantId: [ID]

      "Адресаты кому направляется документ"
      addresseeId: [ID]

      "Файлы, прикреплённые к документу"
      fileId: [ID]
      ): Message!

    editInternal(
      id: ID!
      internal: InternalInput!

      "Резолюции"
      resId: [ID]

      "Темы"
      temaId: [ID]

      "Подписанты"
      podpisantId: [ID]

      "Адресаты кому направляется документ"
      addresseeId: [ID]

      "Файлы, прикреплённые к документу"
      fileId: [ID]
      ): Message!

    deleteInternal(id: ID!): Message!
    setNextStateInternal(id: ID!, depsId: [ID]): Message!
    setPreviousStateInternal(id: ID!, depsId: [ID]): Message!
    sendInternalToExecs (id: ID! execsId: [ID]): Message!
    publicateInternal(id: ID, publicateData: PublicateInternal): Message!
  }
`
