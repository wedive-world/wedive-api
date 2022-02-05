const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________Forum: Forum
  getForums: [Forum]
}

type Mutation {
  
  MUTATION_________________________Forum: Forum
  upsertForum(input: ForumInput): Forum!
}

type Forum {
  _id: ID!

  name: String
  description: String

  createdAt: Date
  updatedAt: Date
}

input ForumInput {
  _id: ID!
  
  name: String
  description: String
}
`;