/* eslint-disable max-nested-callbacks */
// import path from 'path'
// import fs from 'fs/promises'

// const url = new URL(import.meta.url)
// const filePath = path.parse(url.pathname.slice(1))
// const dirname = filePath.dir

// const schemas = {
//   async init () {
//     const files = await fs.readdir(dirname)
//     const includeFiles = files.filter(file => file !== 'index.js')
//     const promises = includeFiles.map(file => import(`./${file}`))
//     const imported = await Promise.allSettled(promises)
//     const schemaArr = []
//     imported.forEach((item) => {
//       if (item.value) {
//         schemaArr.push(item.value.default)
//       } else {
//         throw new Error(`Ошибка при загрузке файлов схем: ${item.reason}`)
//       }
//     })
//     return schemaArr
//   }
// }
//
// export default schemas

import contract from './contract.js'
import type from './type.js'
import tema from './tema.js'
import department from './department.js'
import employee from './employee.js'
import organisation from './organisation.js'
import position from './position.js'
import resolution from './resolution.js'
import state from './state.js'
import subdivision from './subdivision.js'
import currentPosition from './current-position.js'

const schemas = [contract, type, tema, department, employee, organisation,
  position, resolution, state, subdivision, currentPosition]
const Schema = schemas.reduce((acc, schema) => acc + schema, '')

export default Schema
