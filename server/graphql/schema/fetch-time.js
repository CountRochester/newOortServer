
module.exports = `
  type FetchTime {
    contracts: String
    temas: String
    organisations: String
    states: String
    types: String
    positions: String
    departments: String
    subdivisions: String
    currentPositions: String
    extCurrentPositions: String
    employees: String
    extEmployees: String
    extIncomings: String
    extOutgoings: String
    intIncomings: String
    intOutgoings: String
    internals: String
    incNumbers: String
    intIncNumbers: String
    internalIncNumbers: String
    extIncFiles: String
    extOutFiles: String
    intIncFiles: String
    intOutFiles: String
    internalFiles: String
    extIncStates: String
    intIncStates: String
    internalIncStates: String
    resolutions: String
  }

  type Query {
    getFetchTime: FetchTime
  }
`
