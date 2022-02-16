const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________Recommendation: Recommendation
  getUserRecommendations: [Recommendation]
  getAllRecommendations: [Recommendation]
}

type Mutation {
  
  MUTATION_________________________Recommendation: Recommendation
  upsertRecommendation(input: RecommendationInput): Recommendation!
  deleteRecommendation(_id: ID!): Response
}

type Recommendation {
  _id: ID!

  title: String
  description: String
  cssStyle: String

  previewCount: Int
  type: RecommendationType
  targetType: RecommendationTargetType

  searchParams: String
  arguments: [String]

  previews: [RecommendationPreview]

  createdAt: Date
  updatedAt: Date
}

input RecommendationInput {
  _id: ID

  title: String
  description: String
  cssStyle: String

  previewCount: Int
  type: RecommendationType
  targetType: RecommendationTargetType

  searchParams: SearchParams
  arguments: [String]
}

enum RecommendationTargetType {
  diving
  diveSite
  divePoint
  diveCenter
  instructorProfile
}

enum RecommendationType {
  interest
  new
  onePersonLeft
  custom
  search
  nearBy
}

interface RecommendationPreview {
  _id: ID
}

type Diving implements RecommendationPreview 

type DiveSite implements RecommendationPreview 

type DivePoint implements RecommendationPreview 

type DiveCenter implements RecommendationPreview 

type Instructor implements RecommendationPreview
`;