const { gql } = require('apollo-server')

module.exports = gql`

type Query {

    getAllInterests(type: String): [Interest]
    getInterestById(_id: ID!): Interest
    searchInterestsByName(query: String!, type: String): [Interest]
}

type Mutation {

    upsertInterest(input: InterestInput!): Interest!
    deleteInterestById(_id: ID!): ID
}

type Interest implements Introduction {
    _id: ID
    title: String
    type: InterestType
    iconType: String
    iconName: String
    iconColor: String
    iconUrl: String

    name: String
    uniqueName: String
    description: String
    images: [Image]
    backgroundImages: [Image]
    youtubeVideoIds: [String]
    referenceUrls: [String]
    memo: String
  }

  input InterestInput {
    _id: ID
    title: String
    type: InterestType
    iconType: String
    iconName: String
    iconColor: String
    iconUrl: String

    name: String
    uniqueName: String
    description: String
    images: [ID]
    backgroundImages: [ID]
    youtubeVideoIds: [String]
    referenceUrls: [String]
    memo: String
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
    """다이빙 타입(프리,스쿠바)""" divingType
    """month, 1,2,3,4... 12 """ month
    """sunny, cloudy, rain, heavyRain""" climate
    """popular, soso, unrecommended""" popularity,
    """ $, $$, $$$, $$$$, $$$$$ """ priceIndex
  }

`;