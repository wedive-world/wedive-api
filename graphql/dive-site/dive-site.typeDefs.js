const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY_________DiveSites_________: DiveSite
  getAllDiveSites: [DiveSite]
  getDiveSiteById(_id: ID!): DiveSite
  getDiveSiteByUniqueName(uniqueName: String!): DiveSite
  getDiveSiteByAddress(address: String!): DiveSite
  getDiveSitesNearby(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!): [DiveSite]
  searchDiveSitesByName(query: String!): [DiveSite]
}

type Mutation {

  MUTATION_________DiveSites_________: DiveSite
  upsertDiveSite(input: DiveSiteInput!): DiveSite!
  deleteDiveSiteById(_id: ID!): ID
}

type DiveSite {
    _id: ID!

    waterTemperatureScore: Int
    eyeSightScore: Int
    adminScore: Int

    minDepth: Int
    maxDepth: Int
    minSight: Int
    maxSight: Int
    flowRateScore: Int
    waterEnvironmentScore: Int
    eyeSightScore: Int

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
    eyeSightScore: Int
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

type Diving {
  diveSites: [DiveSite]
}

input DivingInput {
  diveSites: [ID]
}
`;