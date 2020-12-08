const serviceModel = (Sequelize) => ({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  }
})

const serviceModelNames = [
  'ByWorker',
  'DocInt',
  'ExtAnswer',
  'ExtDoc',
  'ExtIncDep',
  'ExtIncTema',
  'ExtOutDoc',
  'ExtOutEmp',
  'ExtOutTema',
  'IntAnswer',
  'IntDoc',
  'IntEmp',
  'IntIncAuth',
  'IntIncEmp',
  'IntIncTema',
  'IntOutDoc',
  'IntOutEmp',
  'IntOutTema',
  'IntTema',
  'ResEmp',
  'SubEmpl'
]

export const buildServiceModel = (docsDBLink, Sequelize) => {
  const serviceModels = {}
  serviceModelNames.forEach((modelName) => {
    serviceModels[modelName] = docsDBLink.define(modelName, serviceModel(Sequelize))
  })
  return serviceModels
}
