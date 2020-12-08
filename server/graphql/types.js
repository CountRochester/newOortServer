const { GraphQLScalarType, GraphQLError } = require('graphql')
const { Kind } = require('graphql/language')
const { isISO8601 } = require('validator')
const moment = require('moment')

moment.locale('ru')

module.exports = {
  timeStamp: new GraphQLScalarType({
    name: 'TimeStamp',
    description: 'Дата и время',
    parseValue (value) {
      if (isISO8601(value.toISOString())) {
      // value comes from the client
        return moment(value).format('LLL:ss')
      } // sent to resolvers
      throw new Error('DateTime cannot represent an invalid ISO-8601 Date string')
    },
    serialize (value) {
      if (isISO8601(value.toISOString())) {
      // value comes from resolvers
        return moment(value).format('LLL:ss')
      } // sent to the client
      throw new Error('DateTime cannot represent an invalid ISO-8601 Date string')
    },
    parseLiteral (ast) {
      // ast comes from parsing the query
      // this is where you can validate and transform
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`Query error: Can only parse dates strings, got a: ${ast.kind}`, [ast])
      }
      if (isNaN(Date.parse(ast.value))) {
        throw new GraphQLError(`Query error: not a valid date`, [ast])
      }

      if (isISO8601(ast.value)) { return new Date(ast.value) }

      throw new Error('DateTime cannot represent an invalid ISO-8601 Date string')
    }
  }),
  time: new GraphQLScalarType({
    name: 'Time',
    description: 'Время',
    parseValue (value) {
      if (isISO8601(value.toISOString())) {
      // value comes from the client
        return moment(value).format('LTS')
      } // sent to resolvers
      throw new Error('DateTime cannot represent an invalid ISO-8601 Date string')
    },
    serialize (value) {
      if (isISO8601(value.toISOString())) {
      // value comes from resolvers
        return moment(value).format('LTS')
      } // sent to the client
      throw new Error('DateTime cannot represent an invalid ISO-8601 Date string')
    },
    parseLiteral (ast) {
      // ast comes from parsing the query
      // this is where you can validate and transform
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`Query error: Can only parse dates strings, got a: ${ast.kind}`, [ast])
      }
      if (isNaN(Date.parse(ast.value))) {
        throw new GraphQLError(`Query error: not a valid date`, [ast])
      }

      if (isISO8601(ast.value)) { return new Date(ast.value) }

      throw new Error('DateTime cannot represent an invalid ISO-8601 Date string')
    }
  }),
  date: new GraphQLScalarType({
    name: 'Date',
    description: 'Дата',
    parseValue (value) {
      if (!value) {
        return null
      }
      if (isISO8601(value.toISOString())) {
      // value comes from the client
        return moment(value).format('L')
      } // sent to resolvers
      throw new Error('DateTime cannot represent an invalid ISO-8601 Date string')
    },
    serialize (value) {
      if (!value) {
        return null
      }
      if (isISO8601(value.toISOString())) {
      // value comes from resolvers
        return moment(value).format('L')
      } // sent to the client
      throw new Error('DateTime cannot represent an invalid ISO-8601 Date string')
    },
    parseLiteral (ast) {
      // ast comes from parsing the query
      // this is where you can validate and transform
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`Query error: Can only parse dates strings, got a: ${ast.kind}`, [ast])
      }
      if (isNaN(Date.parse(ast.value))) {
        throw new GraphQLError(`Query error: not a valid date`, [ast])
      }

      if (isISO8601(ast.value)) { return new Date(ast.value) }

      throw new Error('DateTime cannot represent an invalid ISO-8601 Date string')
    }
  })
}
