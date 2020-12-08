const { Strategy, ExtractJwt } = require('passport-jwt')
const Auth = require('../models/auth')
const keys = require('../keys')

// --------------------------------------------------------
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.JWT
}

module.exports = new Strategy(options, async (payload, done) => {
  try {
    const candidate = await Auth.User.findByPk(payload.userId).select('id')
    if (candidate) {
      done(null, candidate)
    } else {
      done(null, false)
    }
  } catch (err) {
    console.error(err)
  }
})
