import Sequelize from 'sequelize'

// Подключение моделей
import { buildContractModel } from './docs-parts/contract.js'
import { buildCurrentPositionModel } from './docs-parts/current-position.js'
import { buildDepartmentModel } from './docs-parts/department.js'
import { buildEmployeeModel } from './docs-parts/employee.js'
import { buildExtCurrentPositionModel } from './docs-parts/ext-current-position.js'
import { buildExtEmployeeModel } from './docs-parts/ext-employee.js'
import { buildExtIncomingModel } from './docs-parts/ext-incoming.js'
import { buildExtOutgoingModel } from './docs-parts/ext-outgoing.js'
import { buildExtIncFileModel, buildIntIncFileModel, buildInternalFileModel, buildExtOutFileModel, buildIntOutFileModel } from './docs-parts/file.js'
import { buildExtIncStateModel, buildIntIncStateModel, buildInternalIncStateModel } from './docs-parts/inc-state.js'
import { buildIncomingNumberModel, buildIntIncomingNumberModel, buildInternalIncomingNumberModel } from './docs-parts/incoming-number.js'
import { buildIntIncomingModel } from './docs-parts/int-incoming.js'
import { buildIntOutgoingModel } from './docs-parts/int-outgoing.js'
import { buildInternalModel } from './docs-parts/internal.js'
import { buildExtIncNoteModel, buildIntIncNoteModel, buildInternalNoteModel } from './docs-parts/note.js'
import { buildOrganisationModel } from './docs-parts/organisation.js'
import { buildPositionModel } from './docs-parts/position.js'
import { buildResolutionModel } from './docs-parts/resolution.js'
import { buildStateModel } from './docs-parts/state.js'
import { buildSubdivisionModel } from './docs-parts/subdivision.js'
import { buildTemaModel } from './docs-parts/tema.js'
import { buildTypeModel } from './docs-parts/type.js'

// Подключение вспомогательных моделей
import { buildServiceModel } from './docs-parts/service/service-model.js'

import fetchTimeArray from '../fetch-time/resolver.js'
import { matrix } from '../fetch-time/entity.js'


const changeTracker = entity => (instance, options) => {
  fetchTimeArray[entity] = (+Date.now()).toString()
}

export const buildDocsModel = (docsDBLink) => {
  const Organisation = buildOrganisationModel(docsDBLink, Sequelize)
  const ExtEmployee = buildExtEmployeeModel(docsDBLink, Sequelize)
  const ExtIncoming = buildExtIncomingModel(docsDBLink, Sequelize)
  const Resolution = buildResolutionModel(docsDBLink, Sequelize)
  const CurrentPosition = buildCurrentPositionModel(docsDBLink, Sequelize)
  const ExtCurrentPosition = buildExtCurrentPositionModel(docsDBLink, Sequelize)
  const ExtIncFile = buildExtIncFileModel(docsDBLink, Sequelize)
  const ExtOutFile = buildExtOutFileModel(docsDBLink, Sequelize)
  const IntIncFile = buildIntIncFileModel(docsDBLink, Sequelize)
  const IntOutFile = buildIntOutFileModel(docsDBLink, Sequelize)
  const InternalFile = buildInternalFileModel(docsDBLink, Sequelize)
  const ExtOutgoing = buildExtOutgoingModel(docsDBLink, Sequelize)
  const IncomingNumber = buildIncomingNumberModel(docsDBLink, Sequelize)
  const Tema = buildTemaModel(docsDBLink, Sequelize)
  const Type = buildTypeModel(docsDBLink, Sequelize)
  const ExtIncNote = buildExtIncNoteModel(docsDBLink, Sequelize)
  const Department = buildDepartmentModel(docsDBLink, Sequelize)
  const ExtIncState = buildExtIncStateModel(docsDBLink, Sequelize)
  const State = buildStateModel(docsDBLink, Sequelize)
  const IntIncoming = buildIntIncomingModel(docsDBLink, Sequelize)
  const IntOutgoing = buildIntOutgoingModel(docsDBLink, Sequelize)
  const IntIncNote = buildIntIncNoteModel(docsDBLink, Sequelize)
  const IntIncomingNumber = buildIntIncomingNumberModel(docsDBLink, Sequelize)
  const IntIncState = buildIntIncStateModel(docsDBLink, Sequelize)
  const Contract = buildContractModel(docsDBLink, Sequelize)
  const Internal = buildInternalModel(docsDBLink, Sequelize)
  const InternalNote = buildInternalNoteModel(docsDBLink, Sequelize)
  const InternalIncomingNumber = buildInternalIncomingNumberModel(docsDBLink, Sequelize)
  const InternalIncState = buildInternalIncStateModel(docsDBLink, Sequelize)
  const Subdivision = buildSubdivisionModel(docsDBLink, Sequelize)
  const Employee = buildEmployeeModel(docsDBLink, Sequelize)
  const Position = buildPositionModel(docsDBLink, Sequelize)

  const serviceModels = buildServiceModel(docsDBLink, Sequelize)

  // ----------------------------------------------------------------------------------
  // Резолюция может относится к нескольким служащим
  Resolution.belongsToMany(CurrentPosition, {
    through: serviceModels.ResEmp,
    as: 'executant'
  })
  // Каждому служащему может относится несколько резолюций
  CurrentPosition.belongsToMany(Resolution, { through: serviceModels.ResEmp })
  // Автором резолючии может быть один служащий
  Resolution.belongsTo(CurrentPosition, { as: 'author' })

  // ----------------------------------------------------------------------------------
  // !!! Внешний входящий документ !!!
  // Внешний входящий документ подписан одним или несколькими служащими
  ExtIncoming.belongsToMany(ExtCurrentPosition, { through: serviceModels.ExtDoc })
  // Служащий может написать несколько внешних документов
  ExtCurrentPosition.belongsToMany(ExtIncoming, { through: serviceModels.ExtDoc })
  // Внешний входящий документ может иметь несколько файлов
  ExtIncoming.hasMany(ExtIncFile)
  // Файл принадлежит одному документу
  ExtIncFile.belongsTo(ExtIncoming)
  // Внешний входящий документ может иметь несколько тем
  ExtIncoming.belongsToMany(Tema, { through: serviceModels.ExtIncTema })
  // Внешний входящий документ может иметь несколько резолюций
  ExtIncoming.hasMany(Resolution)
  // Внешний входящий документ принадлежит к одному из типов
  ExtIncoming.belongsTo(Type)
  // Внешний входящий документ может иметь одно состояние
  // ExtIncoming.belongsTo(State)
  // Внешний входящий документ может иметь несколько ответов
  ExtIncoming.belongsToMany(ExtOutgoing, {
    through: serviceModels.ExtAnswer
  })
  // Внешний входящий документ может иметь несколько входящих номеров для различных отделов
  ExtIncoming.hasMany(IncomingNumber)

  // Внешний входящий документ может иметь несколько примечаний
  ExtIncoming.hasMany(ExtIncNote)
  // Примечание принадлежит к одному внешнему входящему документу
  ExtIncNote.belongsTo(ExtIncoming)
  // В отделе может быть несколько примечаний
  Department.hasMany(ExtIncNote)
  // Примечание принадлежит к одному отделу
  ExtIncNote.belongsTo(Department)
  // ----------------------------------------------------------------------------------
  // Входящий номер принадлежит одному внешнему входящему документу
  IncomingNumber.belongsTo(ExtIncoming)
  // Входящий номер принадлежит одному отделу
  IncomingNumber.belongsTo(Department)
  // В отделе может быть несколько входящих номеров
  Department.hasMany(IncomingNumber)
  // ----------------------------------------------------------------------------------
  // Для каждого отдела своё состояние внешнего входящего документа
  ExtIncState.belongsTo(Department)
  // В отделе может быть несколько состояний внешних входящих документов
  Department.hasMany(ExtIncState)
  // Каждое состояние внешнего входящего документа принадлежит одному документу
  ExtIncState.belongsTo(ExtIncoming)
  // Для каждого внешнего входящего документа может быть несколько состояний
  ExtIncoming.hasMany(ExtIncState)
  // Каждое состояние внешнего входящего документа принадлежит одному состоянию
  ExtIncState.belongsTo(State)
  // Для каждого состояния может быть несколько состояний внешнего входящего документа
  State.hasMany(ExtIncState)
  // ----------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------
  // Внешний входящий документ может быть направлен нескольком отделам
  ExtIncoming.belongsToMany(CurrentPosition, {
    through: serviceModels.ExtIncDep,
    as: 'executant'
  })
  // В отдел можут придти несколько внешних входящих документов
  CurrentPosition.belongsToMany(ExtIncoming, { through: serviceModels.ExtIncDep })
  // Отдел (подразделение) может подчиняться какому-либо вышестоящему подразделению
  Department.belongsTo(Department, {
    // foreignKey: 'parentDepartmentId',
    // target: 'id'
    as: 'parentDepartment'
  })

  // ----------------------------------------------------------------------------------
  // !!! Внешний исходящий документ !!!
  // Внешний исходящий документ может быть подписан несколькими служащими
  ExtOutgoing.belongsToMany(CurrentPosition, {
    through: serviceModels.ExtOutDoc,
    as: 'podpisant'
  })
  // Служащий может подписать несколько внешних исходящих документов
  CurrentPosition.belongsToMany(ExtOutgoing, {
    through: serviceModels.ExtOutDoc
  })

  ExtOutgoing.belongsTo(CurrentPosition, {
    as: 'author',
    foreignKey: 'authorId'
  })
  // Внешний исходящий документ может являться ответом на несколько внешних входящих документов
  ExtOutgoing.belongsToMany(ExtIncoming, {
    through: serviceModels.ExtAnswer,
    as: 'answer',
    foreignKey: 'answerId'
  })
  ExtIncoming.belongsToMany(ExtOutgoing, { through: serviceModels.ExtAnswer })
  // Внешний исходящий документ может иметь несколько файлов
  ExtOutgoing.hasMany(ExtOutFile)
  ExtOutFile.belongsTo(ExtOutgoing)
  // Внешний исходящий документ может иметь несколько тем
  ExtOutgoing.belongsToMany(Tema, { through: serviceModels.ExtOutTema })
  // Внешний исходящий документ принадлежит к одному из типов
  ExtOutgoing.belongsTo(Type)
  // Внешний исходящий документ может иметь одно состояние
  ExtOutgoing.belongsTo(State)
  // Внешний исходящий документ может быть адресован одному или несколькими служащими
  ExtOutgoing.belongsToMany(ExtCurrentPosition, { through: serviceModels.ExtOutEmp })
  // Служащим может быть адресовано несколько внешних исходящих документов
  ExtCurrentPosition.belongsToMany(ExtOutgoing, { through: serviceModels.ExtOutEmp })

  // ----------------------------------------------------------------------------------
  // !!! Внутренний входящий документ !!!
  // Внутренний входящий документ может быть направлен нескольким служащим
  IntIncoming.belongsToMany(CurrentPosition, {
    through: serviceModels.IntDoc,
    as: 'addressee'
  })
  // Служащему может прийти несколько внутренних входящих документов
  CurrentPosition.belongsToMany(IntIncoming, { through: serviceModels.IntDoc })
  // Внутренний входящий документ может иметь несколько файлов
  IntIncoming.hasMany(IntIncFile)
  // Внутренний входящий документ может подписать несколько служащих
  IntIncoming.belongsToMany(CurrentPosition, {
    through: serviceModels.IntIncEmp,
    as: 'podpisant'
  })
  CurrentPosition.belongsToMany(IntIncoming, { through: serviceModels.IntIncEmp })
  IntIncoming.belongsToMany(CurrentPosition, {
    through: serviceModels.IntIncAuth,
    as: 'author'
  })
  CurrentPosition.belongsToMany(IntIncoming, { through: serviceModels.IntIncAuth })

  // Служащие могут подписать несколько внутренних входящих документов
  CurrentPosition.belongsToMany(IntIncoming, { through: serviceModels.IntIncEmp })
  // Employee.belongsToMany(IntIncoming, { through: IntIncEmp })

  // Внутренний входящий документ может являться ответом на несколько внутренних исходящих документов
  IntIncoming.belongsToMany(IntOutgoing, { through: serviceModels.IntAnswer })
  // Внутренний входящий документ может иметь несколько файлов
  IntIncFile.belongsTo(IntIncoming)
  // Внутренний входящий документ может иметь несколько тем
  IntIncoming.belongsToMany(Tema, { through: serviceModels.IntIncTema })
  // Внутренний входящий документ может иметь несколько резолюций
  IntIncoming.hasMany(Resolution)
  // Внутренний входящий документ принадлежит к одному из типов
  IntIncoming.belongsTo(Type)
  // // Внутренний входящий документ может иметь одно состояние
  // IntIncoming.belongsTo(State)
  // Внутренний входящий документ может являться исходящим в другом отделе
  IntIncoming.belongsTo(IntOutgoing, { as: 'source' })

  // Внутренний входящий документ может иметь несколько примечаний
  IntIncoming.hasMany(IntIncNote)
  // Примечание принадлежит к одному внутреннему входящему документу
  IntIncNote.belongsTo(IntIncoming)
  // В отделе может быть несколько примечаний
  Department.hasMany(IntIncNote)
  // Примечание принадлежит к одному отделу
  IntIncNote.belongsTo(Department)

  // ----------------------------------------------------------------------------------
  // Входящий номер принадлежит одному внутреннему входящему документу
  IntIncomingNumber.belongsTo(IntIncoming)
  IntIncoming.hasMany(IntIncomingNumber)
  // Входящий номер принадлежит одному отделу
  IntIncomingNumber.belongsTo(Department)
  // В отделе может быть несколько входящих номеров
  Department.hasMany(IntIncomingNumber)
  // ----------------------------------------------------------------------------------
  // Для каждого отдела своё состояние внутреннего входящего документа
  IntIncState.belongsTo(Department)
  // В отделе может быть несколько состояний внутренних входящих документов
  Department.hasMany(IntIncState)
  // Каждое состояние внутреннего входящего документа принадлежит одному документу
  IntIncState.belongsTo(IntIncoming)
  // Для каждого внутреннего входящего документа может быть несколько состояний
  IntIncoming.hasMany(IntIncState)
  // Каждое состояние внутреннего входящего документа принадлежит одному состоянию
  IntIncState.belongsTo(State)
  // Для каждого состояния может быть несколько состояний внутреннего входящего документа
  State.hasMany(IntIncState)
  // ----------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------
  // !!! Внутренний исходящий документ !!!
  // Внутренний исходящий документ может быть направлен нескольким служащим
  IntOutgoing.belongsToMany(CurrentPosition, {
    through: serviceModels.IntOutDoc,
    as: 'addressee'
  })
  // От служащего могут уйти несколько внутренних исходящих документов
  CurrentPosition.belongsToMany(IntOutgoing, { through: serviceModels.IntOutDoc })
  // Внутренний исходящий документ может подписать несколько служащих
  IntOutgoing.belongsToMany(CurrentPosition, {
    through: serviceModels.IntOutEmp,
    as: 'podpisant'
  })
  // Служащие могут подписать несколько внутренних исходящих документов
  CurrentPosition.belongsToMany(IntOutgoing, { through: serviceModels.IntOutEmp })
  // Employee.belongsToMany(IntOutgoing, { through: IntOutEmp })
  // У документа есть один исполнитель
  IntOutgoing.belongsTo(CurrentPosition, { as: 'author' })
  // Один исполнитель может быть автором нескольких документов
  CurrentPosition.hasMany(IntOutgoing)
  // Внутренний исходящий документ может являться ответом на несколько внутренних входящих документов
  IntOutgoing.belongsToMany(IntIncoming, {
    through: serviceModels.IntAnswer,
    as: 'answer',
    foreignKey: 'answerId'
  })
  // Внутренний исходящий документ может иметь несколько файлов
  IntOutgoing.hasMany(IntOutFile)
  IntOutFile.belongsTo(IntOutgoing)
  // Внутренний исходящий документ может иметь несколько тем
  IntOutgoing.belongsToMany(Tema, { through: serviceModels.IntOutTema })
  // Внутренний исходящий документ принадлежит к одному из типов
  IntOutgoing.belongsTo(Type)
  // Внутренний исходящий документ может иметь одно состояние
  IntOutgoing.belongsTo(State)
  // Внутренний исходящий документ может являться входящими документами в других отделах
  IntOutgoing.hasMany(IntIncoming)

  // ----------------------------------------------------------------------------------
  // Каждый контракт может иметь несколько тем
  Contract.hasMany(Tema)
  // Каждая тема принадлежит одному из контракту
  Tema.belongsTo(Contract)

  // ----------------------------------------------------------------------------------
  // !!! Внутренний документ !!!
  // Внутренний документ может быть направлен в несколько отделов
  Internal.belongsToMany(CurrentPosition, {
    through: serviceModels.DocInt,
    as: 'addressee'
  })
  // Из отдела могут уйти несколько внутренних документов
  CurrentPosition.belongsToMany(Internal, { through: serviceModels.DocInt })
  // Внутренний  документ может подписать несколько служащих
  Internal.belongsToMany(CurrentPosition, {
    through: serviceModels.IntEmp,
    as: 'podpisant',
    foreignKey: 'podpisantId'
  })
  // Внутренний  документ может иметь одного автора
  Internal.belongsTo(CurrentPosition, { as: 'author' })
  CurrentPosition.hasMany(Internal)
  // Служащие могут подписать несколько внутренних документов
  CurrentPosition.belongsToMany(Internal, { through: serviceModels.IntEmp })
  // Внутренний  документ может иметь несколько тем
  Internal.belongsToMany(Tema, { through: serviceModels.IntTema })
  // Внутренний документ принадлежит к одному из типов
  Internal.belongsTo(Type)
  // Внутренний документ может иметь одно состояние
  Internal.belongsTo(State)
  // Внутренний  документ может иметь несколько резолюций
  Internal.hasMany(Resolution)
  // Внутренний документ может иметь несколько файлов
  Internal.hasMany(InternalFile)
  InternalFile.belongsTo(Internal)

  // Внутренний документ может иметь несколько примечаний
  Internal.hasMany(InternalNote)
  // Примечание принадлежит к одному внутреннему документу
  InternalNote.belongsTo(Internal)
  // В отделе может быть несколько примечаний
  Department.hasMany(InternalNote)
  // Примечание принадлежит к одному отделу
  InternalNote.belongsTo(Department)
  // ----------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------
  // Входящий номер принадлежит одному внутреннему входящему документу
  InternalIncomingNumber.belongsTo(Internal)
  Internal.hasMany(InternalIncomingNumber)
  // Входящий номер принадлежит одному отделу
  InternalIncomingNumber.belongsTo(Department)
  // В отделе может быть несколько входящих номеров
  Department.hasMany(InternalIncomingNumber)
  // ----------------------------------------------------------------------------------
  // Для каждого отдела своё состояние внутреннего входящего документа
  InternalIncState.belongsTo(Department)
  // В отделе может быть несколько состояний внутренних входящих документов
  Department.hasMany(InternalIncState)
  // Каждое состояние внутреннего входящего документа принадлежит одному документу
  InternalIncState.belongsTo(Internal)
  // Для каждого внутреннего входящего документа может быть несколько состояний
  Internal.hasMany(InternalIncState)
  // Каждое состояние внутреннего входящего документа принадлежит одному состоянию
  InternalIncState.belongsTo(State)
  // Для каждого состояния может быть несколько состояний внутреннего входящего документа
  State.hasMany(InternalIncState)
  // ----------------------------------------------------------------------------------

  Resolution.belongsTo(Internal)
  Resolution.belongsTo(ExtIncoming)
  Resolution.belongsTo(IntIncoming)
  // ----------------------------------------------------------------------------------
  // В каком-то одном состоянии может находится несколько документов
  // State.hasMany(ExtIncoming)
  State.hasMany(IntIncoming)
  State.hasMany(ExtOutgoing)
  State.hasMany(IntOutgoing)
  // У состояния может быть предшествующее состояние
  State.belongsTo(State, { as: 'parentState' })

  // ----------------------------------------------------------------------------------
  Tema.belongsToMany(ExtIncoming, { through: serviceModels.ExtIncTema })
  Tema.belongsToMany(ExtOutgoing, { through: serviceModels.ExtOutTema })
  Tema.belongsToMany(IntOutgoing, { through: serviceModels.IntOutTema })
  Tema.belongsToMany(IntIncoming, { through: serviceModels.IntIncTema })
  Tema.belongsToMany(Internal, { through: serviceModels.IntTema })
  // ----------------------------------------------------------------------------------
  // Подразделение принадлежит отделу
  Subdivision.belongsTo(Department)
  // В отделе может быть несколько подразделений
  Department.hasMany(Subdivision)
  // В подразделение может быть несколько работников
  Subdivision.belongsToMany(CurrentPosition, { through: serviceModels.SubEmpl })
  // Работник может быть в нескольких подразделениях
  CurrentPosition.belongsToMany(Subdivision, { through: serviceModels.SubEmpl })
  // ----------------------------------------------------------------------------------
  // Каждая текущая должность принадлежит одному сотруднику
  CurrentPosition.belongsTo(Employee)
  // У сотрудника может быть одновременно несколько должностей
  Employee.hasMany(CurrentPosition)
  // Кадой текущей должности соответствует название должности
  CurrentPosition.belongsTo(Position)
  // Для каждой должности может быть несколько текущих должностей
  Position.hasMany(CurrentPosition)
  // Текущая должность принадлежит одному отделу
  CurrentPosition.belongsTo(Department)
  // В отделе может быть несколько текущих должностей
  Department.hasMany(CurrentPosition)
  // ----------------------------------------------------------------------------------
  // Каждая текущая должность принадлежит одному сотруднику
  ExtCurrentPosition.belongsTo(ExtEmployee)
  // У сотрудника может быть одновременно несколько должностей
  ExtEmployee.hasMany(ExtCurrentPosition)
  // Кадой текущей должности соответствует название должности
  ExtCurrentPosition.belongsTo(Position)
  // Для каждой должности может быть несколько текущих должностей
  Position.hasMany(ExtCurrentPosition)
  // Текущая должность принадлежит одному отделу
  ExtCurrentPosition.belongsTo(Organisation)
  // В отделе может быть несколько текущих должностей
  Organisation.hasMany(ExtCurrentPosition)
  // ----------------------------------------------------------------------------------
  const Docs = {
    Organisation,
    ExtEmployee,
    ExtIncoming,
    Position,
    Employee,
    Department,
    ExtOutgoing,
    ExtIncFile,
    ExtOutFile,
    IntIncFile,
    IntOutFile,
    InternalFile,
    IntIncoming,
    IntOutgoing,
    Contract,
    Tema,
    Type,
    Internal,
    Resolution,
    State,
    IncomingNumber,
    ExtIncState,
    Subdivision,
    CurrentPosition,
    ExtCurrentPosition,
    IntIncomingNumber,
    IntIncState,
    InternalIncomingNumber,
    InternalIncState,
    ExtIncNote,
    IntIncNote,
    InternalNote
  }

  for (const entity in matrix) {
    Docs[matrix[entity]].afterCreate(changeTracker(entity))
    Docs[matrix[entity]].afterDestroy(changeTracker(entity))
    Docs[matrix[entity]].afterSave(changeTracker(entity))
    Docs[matrix[entity]].afterUpdate(changeTracker(entity))
    Docs[matrix[entity]].afterBulkDestroy(changeTracker(entity))
  }

  return Docs
}