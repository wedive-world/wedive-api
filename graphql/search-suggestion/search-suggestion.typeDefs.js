const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________SearchSuggestion: Response
  getAllSearchSuggestions: [String]
  findSearchSuggestions(query: String!, limit: Int = 30): [String]
}

type Mutation {
  
  MUTATION_________________________SearchSuggestion: Response
  updateSearchSuggestions: Response!
}
`;