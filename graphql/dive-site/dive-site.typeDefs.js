const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________DiveSites: DiveSite
  getAllDiveSites: [DiveSite]
  getDiveSites(skip: Int = 0, limit: Int = 100): [DiveSite]
  getDiveSiteById(_id: ID!): DiveSite @cacheControl(maxAge: 60)
  getDiveSiteByUniqueName(uniqueName: String!): DiveSite @cacheControl(maxAge: 60)
  getDiveSiteByAddress(address: String!): DiveSite @cacheControl(maxAge: 60)
  getDiveSitesNearby(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!, limit: Int = 20): [DiveSite] @cacheControl(maxAge: 60)
  searchDiveSitesByName(query: String!): [DiveSite]
  getNearByDiveSites(lat: Float!, lon: Float!, m: Int): [DiveSite] @cacheControl(maxAge: 60)
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
  

  visitTimeDescription: String
  waterTemperatureDescription: String
  deepDescription: String
  waterFlowDescription: String
  eyeSightDescription: String
  highlightDescription: String

  divingType: [DivingType]

  createdAt: Date
  updatedAt: Date
  typeDef: String
}

input DiveSiteInput {
  _id: ID

  waterTemperatureScore: Int
  eyeSightScore: Int
  adminScore: Int

  flowRateScore: Int
  waterEnvironmentScore: Int

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
  nearDiveSite: DiveSite
}

input DiveCenterInput {
  diveSites: [ID]
}

type DiveShop {
  diveSites: [DiveSite]
}

type Diving {
  diveSites: [DiveSite]
}

input DivingInput {
  diveSites: [ID]
}
`;