const { gql } = require('apollo-server')

module.exports = gql`

type Query {
    QUERY____________________________DiveCenters: DiveCenter
    getDiveCenters(offset: ID, limit: Int): [DiveCenter]
    getAllDiveCenters: [DiveCenter]
    getDiveCenterById(_id: ID!): DiveCenter
    getDiveCenterByUniqueName(uniqueName: String!): DiveCenter
    getDiveCentersNearBy(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!): [DiveCenter]
    searchDiveCentersByName(query: String!): [DiveCenter]
    getNearByDiveCenters(lat: Float!, lon: Float!, m: Int): [DiveSite]
}

type Mutation {
    MUTATION_______DiveCenters_______: DiveCenter
    upsertDiveCenter(input: DiveCenterInput!): DiveCenter!
    deleteDiveCenterById(_id: ID!): ID
}

type DiveCenter  {

    _id: ID!

    managers: [User]
    clerks: [User]

    divingType: [DivingType]
    enteranceLevelFree: String
    enteranceLevelScuba: String

    enteranceFee: String

    phoneNumber: String
    email: String
    webPageUrl: String
    geoAddress: String
    openingHours: [[String]]

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

    publishStatus: PublishStatus

    managers: [ID]
    clerks: [ID]

    divingType: [DivingType]
    enteranceLevelFree: String
    enteranceLevelScuba: String

    enteranceFee: String

    phoneNumber: String
    email: String
    webPageUrl: String
    geoAddress: String
    openingHours: [[String]]

    adminScore: Int
    viewScore: Int
    educationScore: Int
    facilityScore: Int
    serviceScore: Int

    wediveComments: [String]
}

type DiveSite {
    diveCenters: [DiveCenter]
}

type DivePoint {
    diveCenters: [DiveCenter]
}

type Diving {
    diveCenters: [DiveCenter]
}

input DivingInput {
    diveCenters: [ID]
}
`;