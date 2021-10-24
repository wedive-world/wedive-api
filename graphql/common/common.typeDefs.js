const { gql } = require('apollo-server')

module.exports = gql`

  scalar Date
  
  interface Place {
    address: String
    latitude: Float!
    longitude: Float!
    countryCode: String
  }

  interface Introduction {
    """name for show to user"""
    name: String

    """unique id for url, english"""
    uniqueName: String
    description: String
    images: [Image]
    backgroundImages: [Image]
    youtubeVideoIds: [String]
    referenceUrls: [String]
    memo: String
  }

  interface Publishable {
    publishStatus: PublishStatus
  }

  enum PublishStatus {
    pending
    active
    inactive
    deleted
  }

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