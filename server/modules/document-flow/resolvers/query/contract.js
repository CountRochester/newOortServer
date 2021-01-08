import { isLoggedCheck } from '../../../common.js'

export default {
  async getAllContract (root, args, {
    authentication: { sessionStorage },
    documentFlow: { model: { Contract } },
    core: { logger },
    consola
  }) {
    try {
      await isLoggedCheck(sessionStorage)
      const contract = await Contract.findAll()
      return contract
    } catch (err) {
      logger.writeLog(err)
      consola.error(err)
      throw err
    }
  },
  async getContract (root, { id }, {
    authentication: { sessionStorage },
    documentFlow: { model: { Contract } },
    core: { logger },
    consola
  }) {
    try {
      await isLoggedCheck(sessionStorage)
      const contracts = await Contract.findByPk(id)
      return contracts
    } catch (err) {
      logger.writeLog(err)
      consola.error(err)
      throw err
    }
  }
}
