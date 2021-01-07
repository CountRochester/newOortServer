
export default (context, Docs) => ({
  async getAllContract () {
    try {
      return await Docs.Contract.findAll()
    } catch (err) {
      throw err
    }
  },
  async getContract (root, { id }) {
    try {
      return await Docs.Contract.findByPk(id)
    } catch (err) {
      throw err
    }
  }
})
