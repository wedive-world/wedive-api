const { gql } = require('apollo-server')

module.exports = gql`

  scalar Date

  type StringEntry {
    key: String,
    value: String
  }

  input StringEntryInput {
    key: String,
    value: String
  }

  type IntEntry {
    key: String,
    value: Int
  }

  type Response {
    success: Boolean
    reason: String
  }

  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION
`;