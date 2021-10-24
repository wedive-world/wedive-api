const { gql } = require('apollo-server')

module.exports = gql`

type Query {

    getAllDiveSites: [DiveSite]
    getDiveSiteById(_id: ID!): DiveSite
    getDiveSitesNearby(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!): [DiveSite]
    searchDiveSitesByName(query: String!): [DiveSite]
}

type Mutation {

    upsertDiveSite(input: DiveSiteInput!): DiveSite!
    deleteDiveSiteById(_id: ID!): ID
}

type DiveSite implements Place & Introduction & Publishable & MonthlyInterest {
    _id: ID!

    address: String
    latitude: Float!
    longitude: Float!
    countryCode: String

    name: String
    uniqueName: String
    description: String
    images: [Image]
    backgroundImages: [Image]
    youtubeVideoIds: [String]
    referenceUrls: [String]
    memo: String

    publishStatus: PublishStatus

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

    divePoints: [DivePoint]
    interests: [Interest]

    waterTemperatureScore: Int
    eyeSiteScore: Int
    adminScore: Int

    visitTimeDescription: String
    waterTemperatureDescription: String
    deepDescription: String
    waterFlowDescription: String
    eyeSightDescription: String
    highlightDescription: String

    createdAt: Date
    updatedAt: Date
  }

  input DiveSiteInput {
    _id: ID

    address: String
    latitude: Float!
    longitude: Float!
    countryCode: String

    name: String
    uniqueName: String
    description: String
    images: [ID]
    backgroundImages: [ID]
    youtubeVideoIds: [String]
    referenceUrls: [String]
    memo: String

    publishStatus: PublishStatus

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

    divePoints: [ID]
    interests: [ID]

    waterTemperatureScore: Int
    eyeSiteScore: Int
    adminScore: Int

    visitTimeDescription: String
    waterTemperatureDescription: String
    deepDescription: String
    waterFlowDescription: String
    eyeSightDescription: String
    highlightDescription: String
  }

`;