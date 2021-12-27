const { gql } = require('apollo-server')

module.exports = gql`

type Query {
  QUERY____________________________UserReactions: UserReaction
  getUserLikes: UserReaction
  getUserSubsciption: UserReaction
}

type Mutation {
  MUTATION_________________________UserReactions: UserReaction

  view(targetId: ID!, targetType: UserReactionTargetType!): Response
  like(targetId: ID!, targetType: UserReactionTargetType!): Response
  subscribe(targetId: ID!, targetType: UserReactionTargetType!): Response
}

type UserReaction {
  targetIds: [ID]
  diveCenters: [DiveCenter]
  divePoints: [DivePoint]
  diveSites: [DiveSite]
  divings: [Diving]
  images: [Image]
  users: [User]
}

enum UserReactionTargetType {
  diveCenter
  divePoint
  diveSite
  diving
  image
  user
  review
}

interface UserReactionable {
  views: Int
  likes: Int
  isUserLike: Boolean
  isUserSubscribe: Boolean
}

type DiveCenter implements UserReactionable {
  views: Int
  likes: Int
  isUserLike: Boolean
  isUserSubscribe: Boolean
}

type DivePoint implements UserReactionable {
  views: Int
  likes: Int
  isUserLike: Boolean
  isUserSubscribe: Boolean
}

type DiveSite implements UserReactionable {
  views: Int
  likes: Int
  isUserLike: Boolean
  isUserSubscribe: Boolean
}

type Diving implements UserReactionable {
  views: Int
  likes: Int
  isUserLike: Boolean
  isUserSubscribe: Boolean
}

type Review implements UserReactionable {
  views: Int
  likes: Int
  isUserLike: Boolean
  isUserSubscribe: Boolean
}

type Image implements UserReactionable {
  views: Int
  likes: Int
  isUserLike: Boolean
  isUserSubscribe: Boolean
}

`;