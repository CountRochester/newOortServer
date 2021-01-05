import * as keysProd from './keys.prod.js'
import * as keysDev from './keys.dev.js'

let keys = {}
if (process.env.NODE_ENV === 'production') {
  keys = keysProd
} else {
  keys = keysDev
}

export default { ...keys }
