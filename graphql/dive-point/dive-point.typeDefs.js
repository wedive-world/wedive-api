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

type DivePoint {
  _id: ID!

  diveSiteId: ID!

  adminScore: Int
  minDepth: Int
  maxDepth: Int
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