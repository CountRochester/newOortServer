import contract from './contract.js'
import type from './type.js'
import tema from './tema.js'
import department from './department.js'
// import employee from './employee.js'
import organisation from './organisation.js'
import position from './position.js'
import resolution from './resolution.js'
import state from './state.js'
import subdivision from './subdivision.js'

export default (context, dbModel) => ({
  ...contract,
  ...type,
  ...tema,
  ...department,
  // ...employee,
  ...organisation,
  ...position,
  ...resolution,
  ...state,
  ...subdivision
})
