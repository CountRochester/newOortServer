import { getAllEntitys, getEntity, getEntityByRequest } from './common.js'

// getParentState(id: ID!): State
// getNextState(id: ID!): State

export default {
  async getAllStates (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'State',
    }
    const result = await getAllEntitys(options, args, serverContext)
    return result
  },

  async getState (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'State',
    }
    const result = await getEntity(options, args, serverContext)
    return result
  },

  async getParentState (_, args, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'State',
    }
    const state = await getEntity(options, args, serverContext)
    const parentState = await getEntity({ entity: 'State' }, {
      id: state.parentStateId
    }, serverContext)

    return parentState
  },

  async getNextState (_, { id }, serverContext) {
    const options = {
      check: 'isLoggedCheck',
      entity: 'State',
    }
    const request = {
      parentStateId: id
    }
    const result = await getEntityByRequest(options, request, serverContext)
    return result
  }
}
