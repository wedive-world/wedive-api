const { gql } = require('apollo-server')

module.exports = gql`

type Query {

    getAllDivePoints: [DivePoint]
    getDivePointById(_id: ID!): DivePoint
    getDivePointsNearBy(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!): [DivePoint]
    searchDivePointsByName(query: String!): [DivePoint]
}

type Mutation {

    upsertDivePoint(input: DivePointInput!): DivePoint!
    deleteDivePointById(_id: ID!): ID
}

type DivePoint implements Place & Introduction & Publishable & MonthlyInterest {
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

    diveSiteId: ID!

    adminScore: Int
    minDepth: Int
    maxDepth: Int
    flowRateScore: Int
    waterEnvironmentScore: Int
    eyeSightScore: Int
    highlightDescription: String


    interests: [Interest]
    highlights: [Highlight]

    createdAt: Date
    updatedAt: Date
  }

  input DivePointInput {
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

    diveSiteId: ID!

    adminScore: Int
    minDepth: Int
    maxDepth: Int
    flowRateScore: Int
    waterEnvironmentScore: Int
    eyeSightScore: Int
    highlightDescription: String

    interests: [ID]
    highlights: [ID]
  }
`;