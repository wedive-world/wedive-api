const { gql } = require('apollo-server')

module.exports = gql`

type Query {
  getAllDivePoints: [DivePoint]
  getDivePointById(_id: ID!): DivePoint
  getDivePointByUniqueName(uniqueName: String!): DivePoint
  getDivePointsNearBy(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!): [DivePoint]
  searchDivePointsByName(query: String!): [DivePoint]
}

type Mutation {
  upsertDivePoint(input: DivePointInput!): DivePoint!
  deleteDivePointById(_id: ID!): ID
}

type DivePoint {
  _id: ID!

  diveSiteId: ID!
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

  diveSiteId: ID!

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
`;