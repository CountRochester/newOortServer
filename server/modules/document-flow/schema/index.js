/* eslint-disable max-nested-callbacks */
import path from 'path'
import fs from 'fs/promises'

const url = new URL(import.meta.url)
const filePath = path.parse(url.pathname.slice(1))
const dirname = filePath.dir

const schemas = {
  async init () {
    const files = await fs.readdir(dirname)
    const includeFiles = files.filter(file => file !== 'index.js')
    const promises = includeFiles.map(file => import(`./${file}`))
    const imported = await Promise.allSettled(promises)
    const schemaArr = []
    imported.forEach((item) => {
      if (item.value) {
        schemaArr.push(item.value.default)
      } else {
        throw new Error(`Ошибка при загрузке файлов схем: ${item.reason}`)
      }
    })
    return schemaArr
  }
}

export default schemas
