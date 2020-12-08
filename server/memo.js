'use strict'

function Memoized () { }

// Create memoized function
//   fn - function, sync or async
// Returns: function, memoized
// const memoize = (fn) => {
//   const cache = new Map()

//   const memoized = function (...args) {
//     const callback = args.pop()
//     const key = args[0]
//     const record = cache.get(key)
//     if (record) {
//       callback(record.err, record.data)
//       return
//     }
//     fn(...args, (err, data) => {
//       memoized.add(key, err, data)
//       memoized.emit('memoize', key, err, data)
//       callback(err, data)
//     })
//   }

//   const fields = {
//     cache,
//     timeout: 0,
//     limit: 0,
//     size: 0,
//     maxSize: 0,
//     maxCount: 0,
//     events: {
//       timeout: null,
//       memoize: null,
//       overflow: null,
//       add: null,
//       del: null,
//       clear: null
//     }
//   }

//   Object.setPrototypeOf(memoized, Memoized.prototype)
//   return Object.assign(memoized, fields)
// }

function sizeOf (obj) {
  let bytes = 0
  if (obj !== null && obj !== undefined) {
    switch (typeof obj) {
      case 'number':
        bytes += 8
        break
      case 'string':
        bytes += obj.length * 2
        break
      case 'boolean':
        bytes += 4
        break
      case 'object':
        for (const key in obj) {
          bytes += sizeOf(obj[key])
        }
        break
    }
  }
  return bytes
}

const memoize = (fn) => {
  const cache = new Map()

  const memoized = async function (...args) {
    const key = args[0]
    const record = cache.get(key)
    if (record) {
      return record
    }
    const data = await fn(...args)
    memoized.add(key, null, data)
    memoized.emit('memoize', key, null, data)
    return data
  }

  const fields = {
    cache,
    timeout: 0,
    limit: 0,
    size: 0,
    maxSize: 0,
    maxCount: 0,
    RAMusage: 0,
    events: {
      timeout: null,
      memoize: null,
      overflow: null,
      add: null,
      del: null,
      clear: null
    }
  }

  Object.setPrototypeOf(memoized, Memoized.prototype)
  return Object.assign(memoized, fields)
}

Memoized.prototype.calcRAM = function () {
  this.RAMusage = 0
  for (const elem of this.cache) {
    this.RAMusage += sizeOf(elem)
  }
  return this.RAMusage
}

Memoized.prototype.clear = function () {
  this.emit('clear')
  this.cache.clear()
}

Memoized.prototype.add = function (key, err, data) {
  this.emit('add', err, data)
  this.cache.set(key, data)
  return this
}

Memoized.prototype.del = function (key) {
  this.emit('del', key)
  this.cache.delete(key)
  return this
}

Memoized.prototype.get = function (key) {
  const record = this.cache.get(key)
  // callback(record.err, record.data)
  return record
}

Memoized.prototype.on = function (
  eventName, // string
  listener // function, handler
  // on('memoize', function(err, data))
  // on('add', function(key, err, data))
  // on('del', function(key))
  // on('clear', function())
) {
  if (eventName in this.events) {
    this.events[eventName] = listener
  }
}

Memoized.prototype.emit = function (
  // Emit Collector events
  eventName, // string
  ...args // rest arguments
) {
  const event = this.events[eventName]
  if (event) { event(...args) }
}

module.exports = { memoize }
