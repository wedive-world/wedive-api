const { gql } = require('apollo-server')

module.exports = gql`

  scalar Date
  
  interface MonthlyInterest {
    month1: [Interest]
    month2: [Interest]
    month3: [Interest]
    month4: [Interest]
    month5: [Interest]
    month6: [Interest]
    month7: [Interest]
    month8: [Interest]
    month9: [Interest]
    month10: [Interest]
    month11: [Interest]
    month12: [Interest]
  }

  type StringEntry {
    key: String,
    value: String
  }

  type IntEntry {
    key: String,
    value: Int
  }

  type Response {
    result: ResponseResult
    reason: ResponseReason
  }

  enum ResponseResult {
    success
    fail
  }

  enum ResponseReason {
    tooManyPeople
    publicEnded
  }
`;