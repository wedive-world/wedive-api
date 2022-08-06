const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________Interests: Interest
  getAllInterests(type: String): [Interest]
  getInterests(skip: Int = 0, limit: Int = 100): [Interest]
  getInterestById(_id: ID!): Interest @cacheControl(maxAge: 60)
  getInterestByUniqueName(uniqueName: String!): Interest @cacheControl(maxAge: 60)
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
  """unavailable, popular, soso, unrecommended""" popularity,
  """ $, $$, $$$, $$$$, $$$$$ """ priceIndex,
  """센터 시설정보 (주차, WIFI..)"""facility,
  """센터 지원언어"""language,
  """센터 결재방법"""payment,
  """교육 product 포함사항"""eduInclude,
  """사이트 방문 추천 레벨"""recommendLevel,
  """강사 추천사항"""instructorOption,
  """기타"""etc,
}

interface MonthlyInterest {
  month1: [Interest] @cacheControl(maxAge: 60)
  month2: [Interest] @cacheControl(maxAge: 60)
  month3: [Interest] @cacheControl(maxAge: 60)
  month4: [Interest] @cacheControl(maxAge: 60)
  month5: [Interest] @cacheControl(maxAge: 60)
  month6: [Interest] @cacheControl(maxAge: 60)
  month7: [Interest] @cacheControl(maxAge: 60)
  month8: [Interest] @cacheControl(maxAge: 60)
  month9: [Interest] @cacheControl(maxAge: 60)
  month10: [Interest] @cacheControl(maxAge: 60)
  month11: [Interest] @cacheControl(maxAge: 60)
  month12: [Interest] @cacheControl(maxAge: 60)
}

type DivePoint implements MonthlyInterest {
  interests: [Interest] @cacheControl(maxAge: 60)
  month1: [Interest] @cacheControl(maxAge: 60)
  month2: [Interest] @cacheControl(maxAge: 60)
  month3: [Interest] @cacheControl(maxAge: 60)
  month4: [Interest] @cacheControl(maxAge: 60)
  month5: [Interest] @cacheControl(maxAge: 60)
  month6: [Interest] @cacheControl(maxAge: 60)
  month7: [Interest] @cacheControl(maxAge: 60)
  month8: [Interest] @cacheControl(maxAge: 60)
  month9: [Interest] @cacheControl(maxAge: 60)
  month10: [Interest] @cacheControl(maxAge: 60)
  month11: [Interest] @cacheControl(maxAge: 60)
  month12: [Interest] @cacheControl(maxAge: 60)
}

input DivePointInput {
  interests: [ID]
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
}

type DiveSite implements MonthlyInterest {
  interests: [Interest] @cacheControl(maxAge: 60)
  month1: [Interest] @cacheControl(maxAge: 60)
  month2: [Interest] @cacheControl(maxAge: 60)
  month3: [Interest] @cacheControl(maxAge: 60)
  month4: [Interest] @cacheControl(maxAge: 60)
  month5: [Interest] @cacheControl(maxAge: 60)
  month6: [Interest] @cacheControl(maxAge: 60)
  month7: [Interest] @cacheControl(maxAge: 60)
  month8: [Interest] @cacheControl(maxAge: 60)
  month9: [Interest] @cacheControl(maxAge: 60)
  month10: [Interest] @cacheControl(maxAge: 60)
  month11: [Interest] @cacheControl(maxAge: 60)
  month12: [Interest] @cacheControl(maxAge: 60)
}

input DiveSiteInput {
  interests: [ID]
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
}

type DiveCenter {
  interests: [Interest] @cacheControl(maxAge: 60)
}

input DiveCenterInput {
  interests: [ID]
}

type DiveShop {
  interests: [Interest] @cacheControl(maxAge: 60)
}

input DiveShopInput {
  interests: [ID]
}

type Highlight {
  interests: [Interest] @cacheControl(maxAge: 60)
}

input HighlightInput {
  interests: [ID]
}

type Product {
  interests: [Interest] @cacheControl(maxAge: 60)
}

input ProductInput {
  interests: [ID]
}

type Diving {
  interests: [Interest] @cacheControl(maxAge: 60)
}

input DivingInput {
  interests: [ID]
}

type Recommendation {
  interests: [Interest] @cacheControl(maxAge: 60)
}

input RecommendationInput {
  interests: [ID]
}
`;