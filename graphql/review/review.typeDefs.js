const { gql } = require('apollo-server')

module.exports = gql`

type Query {

    getReviewsByTargetId(targetId: ID!, updatedSince: Date): [Review]
    getReviewsByCurrentUser: [Review]
}

type Mutation {

    upsertReview(input: ReviewInput): Review!
    deleteReviewById(_id: ID!): ID!
}

type Review {
  _id: ID!
  targetId: ID!
  targetTypeName: String!
  author: User!

  title: String
  description: String
  images: [Image]

  createdAt: Date
  updatedAt: Date
}

input ReviewInput {
  _id: ID
  targetId: ID!
  targetTypeName: String!

  title: String
  description: String
  images: [ID]
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
`;