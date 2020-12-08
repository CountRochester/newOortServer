const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const keys = require('../keys')
const Auth = require('../models/auth')
// Файл пока не используется
module.exports.login = async (req, res) => {
  try {
    const candidate = await Auth.User.findOne({ where: { name: req.body.name } })
    if (candidate) {
      const isPswd = await bcrypt.compare(req.body.password, candidate.password)
      if (isPswd) {
        const token = jwt.sign({
          name: candidate.name,
          userId: candidate.id
        }, keys.JWT, { expiresIn: 30 * 60 })
        req.session.isAuthenticated = true
        req.session.token = token
        // req.session.UserId = candidate.id
        res.status(200).json({ token })
      } else {
        res.status(404).json({ message: 'Пользователь с таким именем или паролем не найден' })
      }
    } else {
      res.status(404).json({ message: 'Пользователь с таким именем или паролем не найден' })
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports.createUser = async (req, res) => {
  try {
    const candidate = await Auth.User.findOne({ where: { name: req.body.name } })
    if (candidate) {
      res.status(409).json({ message: 'Пользователь с таким именем уже существует' })
    } else {
      const salt = await bcrypt.genSalt(10)
      const user = await Auth.User.create({
        name: req.body.name,
        password: await bcrypt.hash(req.body.password, salt)
      })
      res.status(201).json({ user })
    }
  } catch (err) {
    console.log(err)
  }
}
