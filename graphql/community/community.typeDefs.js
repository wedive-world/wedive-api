const { gql } = require('apollo-server')

module.exports = gql`

type Query {
  searchCommunities(query: String): [Community]
  getAllCommunities: [Community]
  getCommunityById(_id: ID!): Community
}

type Mutation {
  
  MUTATION_________________________Community: Community
  upsertCommunity(input: CommunityInput): Community
  registerNotice(communityId: ID!, agendaId: ID!): Response!
  unregisterNotice(communityId: ID!, agendaId: ID!): Response!
}

type Community {
  _id: ID!

  title: String
  description: String
  visibility: VisibilityType
  password: String

  notices: [Agenda]
  owners: [User]
  users: [User]
  
  languageCode: String

  subscriptionCount: Int

  createdAt: Date
  updatedAt: Date
}

input CommunityInput {
  _id: ID
  
  title: String
  description: String
  visibility: VisibilityType
  password: String
}

enum VisibilityType {
  public
  private
}
`;