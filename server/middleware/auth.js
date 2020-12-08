// const { Router } = require('express')
const _ = require('lodash')

const Cookie = require('cookie')
// const Cookies = require('js-cookie')
const jwtDecode = require('jwt-decode')

const Auth = require('../models/auth')

const acceptedFunc = [
  'getUser',
  'getEmployee',
  'getAllUsers',
  'getAllEmployee',
  'getAllGroups',
  'getAllDepartment',
  'getAllPosition',
  'getAllSubdivision',
  'getAllTema',
  'getAllOrganisation',
  'getAllState',
  'getAllType',
  'getAllContract',
  'getAllExtEmployee',
  'getAllCurrentPosition',
  'getAllExtCurrentPosition'
]

// function formJson1 (str, key) {
//   const query = _.trim(str)
//   const out = []
//   let k = 0
//   let m = 0
//   let n = 0
//   let index = 0
//   let innerStr = ''
//   let lKey
//   for (let i = 0; i < query.length; i++) {
//     if (query[i] === '{') {
//       if (!lKey) {
//         lKey = _.trim(query.slice(m, i))
//       }
//       if (!n) {
//         m = i
//       }
//       k++
//       n++
//       index = 0
//     } else if (query[i] === '}') {
//       k--
//     }
//     if (k === 0 && n > 0 && !index) {
//       innerStr = _.trim(query.slice(m + 1, i))
//       const value = formJson(innerStr, lKey)
//       if (!key) {
//         const output = {}
//         output[lKey] = value
//         return output
//       }
//       out.push(value)
//       lKey = null
//       m = i + 1
//       n = 0
//       index++
//     }
//   }
//   if (k === 0 && key && !lKey && !index) {
//     const output = {}
//     output[key] = query
//     return output
//   }
//   return out
// }

function formJson (str) {
  const query = _.trim(str)
  const out = []
  let k = 0
  let m = 0
  let n = 0
  let index = 0
  let lKey
  let innerStr = ''
  for (let i = 0; i < query.length; i++) {
    if (query[i] === '{') {
      if (!lKey) {
        lKey = _.trim(query.slice(m, i))
      }
      if (!n) {
        m = i
      }
      k++
      n++
      index = 0
    } else if (query[i] === '}') {
      k--
    }
    if (k === 0 && n > 0 && !index) {
      innerStr = _.trim(query.slice(m + 1, i))
      const output = {}
      output[lKey] = innerStr
      out.push(output)
      lKey = null
      m = i + 1
      n = 0
      index++
    }
  }
  return out
}

function getKeys (str) {
  const arr = formJson(str) || []
  const item = arr[0]
  const requests = Object.values(item)
  const funcs = formJson(Object.values(requests))
  const funcsKeysArr = funcs.map(el => Object.keys(el))
  const funcsKeys = []
  funcsKeysArr.forEach((el) => {
    el.forEach((it) => {
      funcsKeys.push(it)
    })
  })
  return funcsKeys
}

function checkAvalibleFunc (request) {
  let accFun = 0
  acceptedFunc.forEach((el) => {
    if (request.includes(el)) {
      accFun++
    }
  })
  return accFun === request.length
}

async function authGQL (req, res, next) {
  const headers = req.headers
  // const body = req.body
  // const request = getKeys(body.query)
  const cookies = Cookie.parse(headers.cookie || '') || {}
  const token = cookies['jwt-token']
  const sid = cookies['connect.sid'] ? cookies['connect.sid'].slice(2, 34) : null
  if (token) {
    let jwtData
    if (token) {
      jwtData = jwtDecode(token) || {}
    }
    let sessionUser
    if (jwtData && sid) {
      sessionUser = await Auth.session.findOne({ where: { sid } })
    }
    let session = {}
    if (sessionUser) {
      session = sessionUser.dataValues
      const now = new Date()
      if (jwtData.userId === session.UserId &&
        +session.expires > +now) {
        next()
      } else {
        await sessionUser.destroy()
        const data = { access: 'denied' }
        res.json(JSON.stringify(data))
        res.end()
      }
    } else {
      const data = { access: 'denied' }
      res.json(JSON.stringify(data))
      res.end()
    }
  // } else if (checkAvalibleFunc(request)) {
  //   // console.log(body.query)
  //   console.log('Ok')
  //   next()
  } else {
    console.log('Denied')
    console.log(req.body)
    next()
  }
  // return req
}

module.exports = authGQL
