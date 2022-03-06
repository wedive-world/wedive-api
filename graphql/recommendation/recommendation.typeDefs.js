const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________Recommendation: Recommendation
  getUserRecommendations(count: Int = 8): [Recommendation]
  getUserRecommendationsByTargetType(targetType: RecommendationTargetType, count: Int = 8): [Recommendation]
  getAllRecommendations: [Recommendation]
  getPreviewsByRecommendationId(_id: ID!): PreviewResult
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
  className: String

  previewCount: Int
  type: RecommendationType
  targetType: RecommendationTargetType

  searchParams: String
  arguments: [String]

  previews: [RecommendationPreview]
  previewsTotalCount: Int

  createdAt: Date
  updatedAt: Date
}

input RecommendationInput {
  _id: ID

  title: String
  description: String
  cssStyle: String
  className: String

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
  peopleLeft 
  peopleCountGte 
  peopleCountLte 
  daysLeft 
  daysGte 
  daysLte 
  genderOnly 
  daysOf 
}

union RecommendationPreview = Diving | DiveSite | DivePoint | DiveCenter | Instructor

type PreviewResult {
  recommendationTitle: String
  previews: [RecommendationPreview]
}
`;