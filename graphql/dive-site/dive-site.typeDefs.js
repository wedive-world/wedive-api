const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________DiveSites: DiveSite
  getAllDiveSites: [DiveSite]
  getDiveSites(skip: Int = 0, limit: Int = 100): [DiveSite]
  getDiveSiteById(_id: ID!): DiveSite
  getDiveSiteByUniqueName(uniqueName: String!): DiveSite
  getDiveSiteByAddress(address: String!): DiveSite
  getDiveSitesNearby(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!, limit: Int = 100): [DiveSite]
  searchDiveSitesByName(query: String!): [DiveSite]
  getNearByDiveSites(lat: Float!, lon: Float!, m: Int): [DiveSite]
}

type Mutation {

  MUTATION_________________________DiveSites: DiveSite
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

  divingType: [DivingType]

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

  divingType: [DivingType]
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