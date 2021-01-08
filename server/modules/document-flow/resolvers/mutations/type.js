import {
  isManagerCheck, defaultErrorHandler,
  getValidValue, isClerkCheck
} from '../../../common.js'

export default {
  async addType (root, { type: { name } }, {
    authentication: { sessionStorage },
    documentFlow: { model: { Type } },
    pubsub
  }) {
    try {
      await isManagerCheck(sessionStorage)
      const typeName = getValidValue(name, 'name')
      const candidate = await Type.findOne({ where: { name: typeName } })
      if (candidate) {
        throw new Error('Такой тип документа уже существует')
      }
      const newItem = await Type.create({
        name: typeName
      })
      const message = {
        type: 'addType',
        text: 'Новый тип документа успешно добавлен',
        messageType: 'success',
        id: newItem.id,
        item: JSON.stringify({ type: { name: typeName } })
      }
      pubsub.publish('TYPE_CHANGED', {
        typeChanged: {
          type: 'add',
          id: newItem.id,
          item: newItem
        }
      })
      return message
    } catch (err) {
      return defaultErrorHandler(err)
    }
  },

  async editType (root, { id, type: { name } }, {
    authentication: { sessionStorage },
    documentFlow: { model: { Type } },
    pubsub
  }) {
    try {
      await isManagerCheck(sessionStorage)
      const typeName = getValidValue(name, 'name')
      const candidate = await Type.findByPk(id)
      if (!candidate) {
        throw new Error(`Тип документа с id: ${id} не существует`)
      }
      if (typeName === '') {
        throw new Error('Название типа документа не должно быть пустым')
      }
      candidate.name = typeName

      await candidate.save()
      const message = {
        type: 'editType',
        text: 'Данные типа документа успешно изменены',
        messageType: 'success',
        id,
        item: JSON.stringify({ type: { name: typeName } })
      }
      pubsub.publish('TYPE_CHANGED', {
        typeChanged: {
          type: 'edit',
          id: candidate.id,
          item: candidate
        }
      })
      return message
    } catch (err) {
      return defaultErrorHandler(err)
    }
  },

  async deleteTypes (root, { ids }, {
    authentication: { sessionStorage },
    documentFlow: { model: { Type } },
    Op,
    pubsub
  }) {
    try {
      await isClerkCheck(sessionStorage)
      if (!ids.length) {
        throw new Error('Не указаны id')
      }
      await Type.destroy({
        where: { id: { [Op.in]: ids } }
      })

      const message = {
        type: 'deleteType',
        text: 'Тип документа успешно удалён',
        messageType: 'success',
        ids
      }
      pubsub.publish('TYPE_CHANGED', {
        typeChanged: {
          type: 'delete',
          ids
        }
      })
      return message
    } catch (err) {
      return defaultErrorHandler(err)
    }
  }
}
