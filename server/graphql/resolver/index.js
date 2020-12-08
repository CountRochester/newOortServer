const auth = require('./auth')
const position = require('./docs/position')
const contract = require('./docs/contract')
const organisation = require('./docs/organisation')
const state = require('./docs/state')
const type = require('./docs/type')
const department = require('./docs/department')
const employee = require('./docs/employee')
const extEmployee = require('./docs/ext-employee')
const tema = require('./docs/tema')
const resolution = require('./docs/resolution')
const extIncoming = require('./docs/ext-incoming')
const extIncFile = require('./docs/ext-inc-file')
const extOutFile = require('./docs/ext-out-file')
const intIncFile = require('./docs/int-inc-file')
const intOutFile = require('./docs/int-out-file')
const internalFile = require('./docs/internal-file')
const extOutgoing = require('./docs/ext-outgoing')
const intIncoming = require('./docs/int-incoming')
const intOutgoing = require('./docs/int-outgoing')
const internal = require('./docs/internal')
const incomingNumber = require('./docs/incoming-number')
const intIncomingNumber = require('./docs/int-incoming-number')
const internalIncomingNumber = require('./docs/internal-incoming-number')
const shared = require('./docs/shared')
const extIncState = require('./docs/ext-inc-state')
const intIncState = require('./docs/int-inc-state')
const internalIncState = require('./docs/internal-inc-state')
const subdivision = require('./docs/subdivision')
const currentPosition = require('./docs/current-position')
const extCurrentPosition = require('./docs/ext-current-position')
const extIncNote = require('./docs/ext-inc-note')
const intIncNote = require('./docs/int-inc-note')
const internalNote = require('./docs/internal-note')
const fetchTimeArray = require('./fetch-time/resolver')

const rootResolver = {
  ...auth,
  ...position,
  ...contract,
  ...organisation,
  ...state,
  ...type,
  ...department,
  ...employee,
  ...extEmployee,
  ...tema,
  ...resolution,
  ...extIncoming,
  ...extIncFile,
  ...extOutFile,
  ...intIncFile,
  ...intOutFile,
  ...internalFile,
  ...extOutgoing,
  ...intIncoming,
  ...intOutgoing,
  ...internal,
  ...incomingNumber,
  ...extIncState,
  ...subdivision,
  ...currentPosition,
  ...extCurrentPosition,
  ...intIncomingNumber,
  ...internalIncomingNumber,
  ...intIncState,
  ...internalIncState,
  ...extIncNote,
  ...intIncNote,
  ...internalNote,
  ...shared,
  ...fetchTimeArray
}
module.exports = rootResolver
