import { isLoggedCheck } from '../../../common.js'

export default {
  async getAllType (root, args, {
    authentication: { sessionStorage },
    documentFlow: { model: { Type } },
    core: { logger },
    consola
  }) {
    try {
      await isLoggedCheck(sessionStorage)
      const type = await Type.findAll()
      return type
    } catch (err) {
      logger.writeLog(err)
      consola.error(err)
      throw err
    }
  },

  async getType (root, { id }, {
    authentication: { sessionStorage },
    documentFlow: { model: { Type } },
    core: { logger },
    consola
  }) {
    try {
      await isLoggedCheck(sessionStorage)
      const types = await Type.findByPk(id)
      return types
    } catch (err) {
      logger.writeLog(err)
      consola.error(err)
      throw err
    }
  }
}
