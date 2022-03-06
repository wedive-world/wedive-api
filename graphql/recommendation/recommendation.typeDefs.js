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
  peopleLeft """1명 남은 다이빙, arguments: 사람 수"""
  peopleCountGte """~명 이상 다이빙, arguments: 사람 수"""
  peopleCountLte """~명 이하 다이빙, arguments: 사람 수"""
  daysLeft """ 몇일 뒤 시작하는 다이빙 (3일 뒤 바로 출발가능한 다이빙) """
  daysGte """몇일 이상 다이빙 (4일 이상 연박 다이빙)"""
  daysLte """몇일 이하 다이빙 (당일치기 다이빙) """
  genderOnly """성별 제한 다이빙 (여자만 떠나는 다이빙)"""
  daysOf7 """요일 제한 다이빙, 0:월 6: 일요일 , 직장인을 위한 주말 다이빙"""
}

union RecommendationPreview = Diving | DiveSite | DivePoint | DiveCenter | Instructor

type PreviewResult {
  recommendationTitle: String
  previews: [RecommendationPreview]
}
`;