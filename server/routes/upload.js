const extIncFile = require('../graphql/resolver/docs/ext-inc-file')
const extOutFile = require('../graphql/resolver/docs/ext-out-file')
const intIncFile = require('../graphql/resolver/docs/int-inc-file')
const intOutFile = require('../graphql/resolver/docs/int-out-file')
const internalFile = require('../graphql/resolver/docs/internal-file')
const entitys = { extIncFile, extOutFile, intIncFile, intOutFile, internalFile }

const handler = async (request, reply) => {
  try {
    const response = []
    const type = request.files[0].fieldname
    const entity = type[0].toUpperCase() + type.slice(1)
    for (const file of request.files) {
      let message
      if (type !== 'avatar') {
        message = await entitys[type][`add${entity}`](null, { [type]: { file: file.filename } })
      }
      response.push({
        id: message ? message.id : null,
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        message
      })
    }
    reply.send(response)
  } catch (err) {
    throw err
  }
}

module.exports = handler
