const { gql } = require('apollo-server')

module.exports = gql`

type Query {
  QUERY_________UserReactions_________: UserReaction
  getUserLikes: UserReaction
  getUserSubsciption: UserReaction
}

type Mutation {
  MUTATION_________UserReactions_________: UserReaction

  view(targetId: ID!, targetType: UserReactionTargetType): Response
  like(targetId: ID!, targetType: UserReactionTargetType): Response
  subscribe(targetId: ID!, targetType: UserReactionTargetType): Response
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
}

interface UserReactionable {
  views: Int
  likes: Int
}

type DiveCenter implements UserReactionable {
  views: Int
  likes: Int
}

type DivePoint implements UserReactionable {
  views: Int
  likes: Int
}

type DiveSite implements UserReactionable {
  views: Int
  likes: Int
}

type Diving implements UserReactionable {
  views: Int
  likes: Int
}


`;