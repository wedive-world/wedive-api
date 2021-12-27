const { gql } = require('apollo-server')

const monthlyInterestFields = `
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
`

const monthlyInterestInputFields = `
  month1: [ID]
  month2: [ID]
  month3: [ID]
  month4: [ID]
  month5: [ID]
  month6: [ID]
  month7: [ID]
  month8: [ID]
  month9: [ID]
  month10: [ID]
  month11: [ID]
  month12: [ID]
`

module.exports = gql`

type Query {

  QUERY____________________________Interests: Interest
  getAllInterests(type: String): [Interest]
  getInterests(skip: Int = 0, limit: Int = 100): [Interest]
  getInterestById(_id: ID!): Interest
  getInterestByUniqueName(uniqueName: String!): Interest
  searchInterestsByName(query: String!, type: String): [Interest]
}

type Mutation {

  MUTATION_________________________Interests: Interest
  upsertInterest(input: InterestInput!): Interest!
  deleteInterestById(_id: ID!): ID
}

type Interest {
  _id: ID
  title: String
  type: InterestType
  iconType: String
  iconName: String
  iconColor: String
  iconUrl: String
}

input InterestInput {
  _id: ID
  title: String
  type: InterestType
  iconType: String
  iconName: String
  iconColor: String
  iconUrl: String
}

enum InterestType {
  """할인 대상""" discountTarget
  """할인 옵션""" discountOption
  """성별""" gender
  """나이""" age
  """친목""" amity
  """여행 특성""" tripFeature
  """수상 내역""" award
  """별명""" nickName
  """Diving features, e.g. hardTraning, fun diving...""" divingFeature
  """다이빙 환경""" divingPointEnvironment
  """수중 생물""" aquaticLife
  """수중 생물 100%보는""" aquaticLife100
  """다이빙 타입(프리,스쿠바)""" divingType
  """month, 1,2,3,4... 12 """ month
  """sunny, cloudy, rain, heavyRain""" climate
  """popular, soso, unrecommended""" popularity,
  """ $, $$, $$$, $$$$, $$$$$ """ priceIndex,
  """센터 시설정보 (주차, WIFI..)"""facility,
  """센터 지원언어"""language,
  """센터 결재방법"""payment,
  """교육 product 포함사항"""eduInclude,
}

interface MonthlyInterest {
  ${monthlyInterestFields}
}

type DivePoint implements MonthlyInterest {
  interests: [Interest]
  ${monthlyInterestFields}
}

input DivePointInput {
  interests: [ID]
  ${monthlyInterestInputFields}
}

type DiveSite implements MonthlyInterest {
  interests: [Interest]
  ${monthlyInterestFields}
}

input DiveSiteInput {
  interests: [ID]
  ${monthlyInterestInputFields}
}

type DiveCenter {
  interests: [Interest]
}

input DiveCenterInput {
  interests: [ID]
}

type Highlight {
  interests: [Interest]
}

input HighlightInput {
  interests: [ID]
}

type Product {
  interests: [Interest]
}

input ProductInput {
  interests: [ID]
}

type Diving {
  interests: [Interest]
}

input DivingInput {
  interests: [ID]
}

`;