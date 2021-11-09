const { gql } = require('apollo-server')

module.exports = gql`

type Query {
    getAllDiveCenters: [DiveCenter]
    getDiveCenterById(_id: ID!): DiveCenter
    getDiveCenterByUniqueName(uniqueName: String!): DiveCenter
    getDiveCentersNearBy(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!): [DiveCenter]
    searchDiveCentersByName(query: String!): [DiveCenter]
}

type Mutation {
    upsertDiveCenter(input: DiveCenterInput!): DiveCenter!
    deleteDiveCenterById(_id: ID!): ID
}

type DiveCenter  {

    _id: ID!

    managers: [User]
    clerks: [User]

    divingType: [DivingType]
    phoneNumber: String
    webPageUrl: String
    geoAddress: String

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
    phoneNumber: String
    webPageUrl: String
    geoAddress: String

    adminScore: Int
    viewScore: Int
    educationScore: Int
    facilityScore: Int
    serviceScore: Int

    wediveComments: [String]
}


`;