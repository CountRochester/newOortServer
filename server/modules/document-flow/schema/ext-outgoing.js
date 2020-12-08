module.exports = `
  type ExtOutgoing {
    id: ID!

    "Исходящий номер документа"
    outNumber: String!

    "Дата исходящего номера документа"
    outDate: Date!

    prefix: String

    "Краткое содержание"
    subject: String

    "Ссылка на исполнителя"
    authorId: ID

    "Ссылка на тип документа"
    TypeId: ID

    "Ссылка на текущее состояние"
    StateId: ID

    "Дата создания"
    createdAt: TimeStamp!

    "Дата последнего изменения"
    updatedAt: TimeStamp!
  }

  type ExtOutgoingP {
    id: ID!

    "Исходящий номер документа"
    outNumber: String!

    "Дата исходящего номера документа"
    outDate: Date!

    "Краткое содержание"
    subject: String

    "Ссылка на исполнителя"
    Author: CurrentPosition

    "Ссылка на тип документа"
    Type: Type

    "Ссылка на текущее состояние"
    State: StateP

    Addressees: [ExtEmployeeP]
    Temas: [TemaP]
    Organisations: [Organisation]
    Department: DepartmentP
    Files: [ExtOutFile]
    IsAnswerOn: [ExtIncomingP]

    "Дата создания"
    createdAt: TimeStamp!

    "Дата последнего изменения"
    updatedAt: TimeStamp!
  }

  type ExtOutgoingRequest {
    id: ID!

    "Исходящий номер документа"
    outNumber: String!

    "Дата исходящего номера документа"
    outDate: Date!

    prefix: String

    "Краткое содержание"
    subject: String

    "Ссылка на исполнителя"
    author: String
    authorId: ID

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
    organisations: String
    organisationsId: [ID]
    department: String
    departmentId: ID
    files: String
    filesId: [ID]
    isAnswerOn: String
    isAnswerOnId: [ID]
    updatedAt: Date
  }

  input ExtOutgoingInput {
    "Исходящий номер документа"
    outNumber: String!

    "Дата исходящего номера документа"
    outDate: Date!

    prefix: String

    "Краткое содержание"
    subject: String

    "Ссылка на исполнителя"
    authorId: ID

    "Ссылка на тип документа"
    TypeId: ID

    "Ссылка на текущее состояние"
    StateId: ID
  }

  input ExtOutInput {
    subject: String
    outNumber: String
    prefix: String
    outDate: Date
    authorId: ID
    TypeId: ID
    StateId: ID
    temaId: [ID]
    addresseesId: [ID]
    podpisantId: [ID]
    answerId: [ID]
    note: String
    filesId: [ID]
    stateChanged: Int
  }

  input PublicateExtOutgoing {
    ExtOutgoing: ExtOutInput
  }

  type Query {
    updateExtOutgoingRequest(id: ID!, time: String!): [ExtOutgoingRequest]
    getExtOutgoingRequest(id: ID!): [ExtOutgoingRequest]
    getExtOutgoingRequestById(id: ID!): ExtOutgoingRequest
    getExtOutgoingRequestByIds(ids: [ID]!): [ExtOutgoingRequest]

    "Получить все внешние исходящие документы"
    getAllExtOutgoing: [ExtOutgoing]

    "Получить все внешние исходящие документы для конкретного отдела"
    getAllExtOutgoingInDepartment(id: ID!): [ExtOutgoing]

    "Получить конкретный внешний исходящий документ"
    getExtOutgoing(id: ID!): ExtOutgoing

    "Получить тип конкретного внешнего исходящего документа"
    getExtOutgoingType(id: ID!): Type

    "Получить текущее состояние конкретного внешнего исходящего документа"
    getExtOutgoingState(id: ID!): State

    "Получить всех адресатов конкретного внешнего исходящего документа"
    getExtOutgoingExtEmployees(id: ID!): [ExtEmployee]

    "Получить все темы конкретного внешнего исходящего документа"
    getExtOutgoingTemas(id: ID!): [Tema]

    "Получить автора конкретного внешнего исходящего документа"
    getExtOutgoingAuthor(id: ID!): CurrentPosition

    "Получить все организации-получатели конкретного внешнего исходящего документа"
    getExtOutgoingOrganisations(id: ID!): [Organisation]

    "Получить отдел автора конкретного внешнего исходящего документа"
    getExtOutgoingDepartment(id: ID!): [Department]

    "Получить прикреплённые файлы конкретного внешнего исходящего документа"
    getExtOutgoingFiles(id: ID!): [ExtOutFile]

    "Получить внешние входящие документы, ответом на которые является конкретный внешний исходящий документ"
    getExtOutgoingAnswers(id: ID!): [ExtIncoming]
  }

  type Mutation {
    addExtOutgoing(
      extOutgoing: ExtOutgoingInput!

      "Ссылки на адресатов"
      extCurrentPositionId: [ID]

      "Ссылки на темы"
      temaId: [ID]

      "Ссылки на подписантов"
      podpisantId: [ID]

      "Ссылки на входящие документы, на которые отвечает данный документ"
      answerId: [ID]

      "Ссылки на файлы, прикреплённые к данному документу"
      fileId: [ID]
      ): Message!
    editExtOutgoing(
      id: ID!
      extOutgoing: ExtOutgoingInput!

      "Ссылки на адресатов"
      extCurrentPositionId: [ID]

      "Ссылки на темы"
      temaId: [ID]

      "Ссылки на подписантов"
      podpisantId: [ID]

      "Ссылки на входящие документы, на которые отвечает данный документ"
      answerId: [ID]

      "Ссылки на файлы, прикреплённые к данному документу"
      fileId: [ID]
      ): Message!
    deleteExtOutgoing(id: ID!): Message!
    addNoteToExtOutgoing (id: ID!, note: String!): Message!
    setStateExtOutgoing(id: ID! stateId: ID): Message!
    setNextStateExtOutgoing(id: ID!): Message!
    setPreviousStateExtOutgoing(id: ID!): Message!
    publicateExtOutgoing(id: ID, publicateData: PublicateExtOutgoing): Message!
  }
`
