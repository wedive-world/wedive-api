const { gql } = require('apollo-server')

module.exports = gql`

type Query {
    getAllDiveCenters: [DiveCenter]
    getDiveCenterById(_id: ID!): DiveCenter
    getDiveCentersNearBy(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!): [DiveCenter]
    searchDiveCentersByName(query: String!): [DiveCenter]
}

type Mutation {
    upsertDiveCenter(input: DiveCenterInput!): DiveCenter!
    deleteDiveCenterById(_id: ID!): ID
}

type DiveCenter implements Place & Introduction & Publishable {

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

    interests: [Interest]

    diveSites: [DiveSite]
    divePoints: [DivePoint]

    managers: [User]
    clerks: [User]

    divingType: [DivingType]
    phoneNumber: String
    webPageUrl: String
    goeAddress: String

    adminScore: Int
    viewScore: Int
    educationScore: Int
    facilityScore: Int
    serviceScore: Int

    wediveComments: [String]

    createdAt: Date
    updatedAt: Date
}

input DiveCenterInput {
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

    interests: [ID]

    diveSites: [ID]
    divePoints: [ID]

    managers: [ID]
    clerks: [ID]

    divingType: [DivingType]
    phoneNumber: String
    webPageUrl: String
    goeAddress: String

    adminScore: Int
    viewScore: Int
    educationScore: Int
    facilityScore: Int
    serviceScore: Int

    wediveComments: [String]
}


`;