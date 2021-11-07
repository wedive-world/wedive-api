const { gql } = require('apollo-server')

module.exports = gql`

type Query {

    getUserReactionByTargetId(targetId: ID!): [UserReaction]
}

type Mutation {

    createUserReaction(input: ReviewInput): Diving!
    deleteUserReaction(_id: ID!): ID!
}

type UserReaction {
  _id: ID!
  type: UserReactionType!
  targetId: ID!
  targetType: String!
  author: User!

  createdAt: Date
}

input UserReactionInput {
  _id: ID

  type: UserReactionType!
  targetId: ID!
  targetType: String!
}

type UserReactionEntry {
  key: UserReactionType
  value: Boolean
}

type UserReactionCountEntry {
  key: UserReactionType
  count: Int
}

enum UserReactionType {
  like
  dislike
  star
}

interface UserReactionable {
  userReactions: [UserReactionEntry]
  userReactionCountMap: [UserReactionCountEntry]
}

type DiveCenter implements UserReactionable {
  userReactions: [UserReactionEntry]
  userReactionCountMap: [UserReactionCountEntry]
}

type DivePoint implements UserReactionable {
  userReactions: [UserReactionEntry]
  userReactionCountMap: [UserReactionCountEntry]
}

type DiveSite implements UserReactionable {
  userReactions: [UserReactionEntry]
  userReactionCountMap: [UserReactionCountEntry]
}


`;