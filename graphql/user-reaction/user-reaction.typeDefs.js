const { gql } = require('apollo-server')

module.exports = gql`

type Query {
  QUERY____________________________UserReactions: UserReaction
  getUserLikes: UserReaction
  getUserDislikes: UserReaction
  getUserSubsciption: UserReaction
}

type Mutation {
  MUTATION_________________________UserReactions: UserReaction

  view(targetId: ID!, targetType: UserReactionTargetType!): Boolean
  like(targetId: ID!, targetType: UserReactionTargetType!): Boolean
  dislike(targetId: ID!, targetType: UserReactionTargetType!): Boolean
  subscribe(targetId: ID!, targetType: UserReactionTargetType!): Boolean
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
  dislikes: Int
  isUserDislike: Boolean
  isUserLike: Boolean
  isUserSubscribe: Boolean
}

type DiveCenter implements UserReactionable {
  views: Int
  likes: Int
  dislikes: Int
  isUserDislike: Boolean
  isUserLike: Boolean
  isUserSubscribe: Boolean
}

type DivePoint implements UserReactionable {
  views: Int
  likes: Int
  dislikes: Int
  isUserDislike: Boolean
  isUserLike: Boolean
  isUserSubscribe: Boolean
}

type DiveSite implements UserReactionable {
  views: Int
  likes: Int
  dislikes: Int
  isUserDislike: Boolean
  isUserLike: Boolean
  isUserSubscribe: Boolean
}

type Diving implements UserReactionable {
  views: Int
  likes: Int
  dislikes: Int
  isUserDislike: Boolean
  isUserLike: Boolean
  isUserSubscribe: Boolean
}

type Review implements UserReactionable {
  views: Int
  likes: Int
  dislikes: Int
  isUserDislike: Boolean
  isUserLike: Boolean
  isUserSubscribe: Boolean
}

type Image implements UserReactionable {
  views: Int
  likes: Int
  dislikes: Int
  isUserDislike: Boolean
  isUserLike: Boolean
  isUserSubscribe: Boolean
}

type User implements UserReactionable {
  views: Int
  likes: Int
  dislikes: Int
  isUserDislike: Boolean
  isUserLike: Boolean
  isUserSubscribe: Boolean
}

`;