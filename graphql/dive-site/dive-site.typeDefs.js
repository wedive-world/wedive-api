const { gql } = require('apollo-server')

module.exports = gql`

type Query {

    getAllDiveSites: [DiveSite]
    getDiveSiteById(_id: ID!): DiveSite
    getDiveSiteByAddress(address: String!): DiveSite
    getDiveSitesNearby(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!): [DiveSite]
    searchDiveSitesByName(query: String!): [DiveSite]
}

type Mutation {

    upsertDiveSite(input: DiveSiteInput!): DiveSite!
    deleteDiveSiteById(_id: ID!): ID
}

type DiveSite {
    _id: ID!

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

type DiveCenter {
  diveSites: [DiveSite]
}

input DiveCenterInput {
  divesites: [ID]
}
`;