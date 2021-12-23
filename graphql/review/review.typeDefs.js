const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY_________Reviews_________: Review
  getReviewsByCurrentUser: [Review]
}

type Mutation {
  
  MUTATION_________Reviews_________: Review
  upsertReview(input: ReviewInput): Review!
  deleteReviewById(_id: ID!): Response!
}

type Review {
  _id: ID!
  targetId: ID!
  targetType: ReviewTargetType!
  author: User!
  languageCode: String

  title: String
  content: String
  rating: Int

  createdAt: Date
  updatedAt: Date
}

input ReviewInput {
  _id: ID
  targetId: ID!
  targetType: ReviewTargetType!

  title: String
  content: String
  rating: Int
}

enum ReviewTargetType {
  diving
  diveSite
  divePoint
  diveCenter
  review
}

interface Reviewable {
  reviews: [Review]
  reviewCount: Int
}

type DiveCenter implements Reviewable {
  reviews: [Review]
  reviewCount: Int
}

type DivePoint implements Reviewable {
  reviews: [Review]
  reviewCount: Int
}

type DiveSite implements Reviewable {
  reviews: [Review]
  reviewCount: Int
}

type Review implements Reviewable {
  reviews: [Review]
  reviewCount: Int
}

type Diving implements Reviewable {
  reviews: [Review]
  reviewCount: Int
}
`;