import { fetchTime } from './module.js'

const fetchTimeArray = fetchTime.getInstance()

export default {
  getFetchTime () {
    return fetchTimeArray
  }
}
