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
  divePointId: ID
}

input HighlightInput {
  name: String
  description: String
  divePointId: ID
}

type DivePoint {
  highlights: [Highlight]
}

input DivePointInput {
  highlights: [ID]
}

type DiveSite {
  highlights: [Highlight]
}

input DiveSiteInput {
  highlights: [ID]
}
`;