const { gql } = require('apollo-server')

module.exports = gql`

type Query {
  QUERY____________________________DivePoints: DivePoint
  getDivePoints(skip: Int = 0, limit: Int = 100): [DivePoint]
  getAllDivePoints: [DivePoint]
  getDivePointById(_id: ID!): DivePoint @cacheControl(maxAge: 60)
  getDivePointByUniqueName(uniqueName: String!): DivePoint @cacheControl(maxAge: 60)
  getDivePointsNearBy(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!, limit: Int = 20): [DivePoint] @cacheControl(maxAge: 60)
  searchDivePointsByName(query: String!): [DivePoint] @cacheControl(maxAge: 60)
  getNearByDivePoints(lat: Float!, lon: Float!, m: Int): [DivePoint] @cacheControl(maxAge: 60)
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

  divingType: [DivingType]

  createdAt: Date
  updatedAt: Date
    typeDef: String
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

  divingType: [DivingType]
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