const { gql } = require('apollo-server')

module.exports = gql`

type Mutation {

    upsertHighlight(input: HighlightInput!): Highlight!
    deleteHighlightById(_id: ID!): ID
}

type Highlight {
    _id: ID!
    name: String
    description: String
    images: [Image]
    divePointId: ID!
    interests: [Interest]
  }

  input HighlightInput {
    _id: ID
    name: String
    description: String
    images: [ID]
    divePointId: ID
    interests: [ID]
  }

`;