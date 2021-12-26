const { gql } = require('apollo-server')

module.exports = gql`

type Query {
  QUERY____________________________DivePoints: DivePoint
  getDivePoints(from: ID, limit: Int!): [DivePoint]
  getAllDivePoints: [DivePoint]
  getDivePointById(_id: ID!): DivePoint
  getDivePointByUniqueName(uniqueName: String!): DivePoint
  getDivePointsNearBy(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!): [DivePoint]
  searchDivePointsByName(query: String!): [DivePoint]
  getNearByDivePoints(lat: Float!, lon: Float!, m: Int): [DivePoint]
}

type Mutation {
  MUTATION_________________________DivePoints: DivePoint
  upsertDivePoint(input: DivePointInput!): DivePoint!
  deleteDivePointById(_id: ID!): ID
}

type DivePoint {
  _id: ID!

  diveSiteId: ID
  diveSite: DiveSite

  adminScore: Int
  minDepth: Int
  maxDepth: Int
  minSight: Int
  maxSight: Int
  flowRateScore: Int
  waterEnvironmentScore: Int
  eyeSightScore: Int
  highlightDescription: String

  createdAt: Date
  updatedAt: Date
}

input DivePointInput {
  _id: ID

  diveSiteId: ID

  adminScore: Int
  minDepth: Int
  maxDepth: Int
  minSight: Int
  maxSight: Int
  flowRateScore: Int
  waterEnvironmentScore: Int
  eyeSightScore: Int
  highlightDescription: String
}

type DiveSite {
  divePoints: [DivePoint]
}

input DiveSiteInput {
  divePoints: [ID]
}

type DiveCenter {
  divePoints: [DivePoint]
}

input DiveCenterInput {
  divePoints: [ID]
}

type Diving {
  divePoints: [DivePoint]
}

input DivingInput {
  divePoints: [ID]
}
`;