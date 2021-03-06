const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________Forum: Forum
  getForums: [Forum]
  getHotHashTags(days: Int = 180, limit: Int = 10): [String]
  getHotHashTagsById(targetId: ID!, days: Int = 180, limit: Int = 10): [String]
}

type Mutation {
  
  MUTATION_________________________Forum: Forum
  upsertForum(input: ForumInput): Forum!
}

type Forum {
  _id: ID!

  name: String
  description: String
  priority: Int

  createdAt: Date
  updatedAt: Date
}

input ForumInput {
  _id: ID
  
  name: String
  description: String
  priority: Int
}
`;