import contract from './contract.js'
import type from './type.js'
import tema from './tema.js'

export default (context, dbModel) => ({
  ...contract,
  ...type,
  ...tema
})
