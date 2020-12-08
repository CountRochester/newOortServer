import { entity } from './entity.js'
const serverStartTime = (+Date.now()).toString()

export const fetchTime = (function () {
  let instance
  function init () {
    // приватная часть
    const fetchTimeArray = {}
    entity.forEach((ent) => { fetchTimeArray[ent] = serverStartTime })
    return {
      // публичная часть
      ...fetchTimeArray
    }
  }
  return {
    getInstance: () => {
      if (!instance) {
        instance = init()
      }
      return instance
    }
  }
})()

