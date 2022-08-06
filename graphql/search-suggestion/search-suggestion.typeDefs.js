const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________SearchSuggestion: Response
  getAllSearchSuggestions: [String]
  findSearchSuggestions(query: String!, limit: Int = 20): [String] @cacheControl(maxAge: 3600)
}

type Mutation {
  
  MUTATION_________________________SearchSuggestion: Response
  updateSearchSuggestions: Response!
}
`;