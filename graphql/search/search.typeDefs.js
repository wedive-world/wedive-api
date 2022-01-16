const { gql } = require('apollo-server')

module.exports = gql`

type Query {
  QUERY____________________________Search: [Place]
  searchPlaces(limit: Int = 5, searchParams: SearchParams): [Place]
  searchDivings(limit: Int = 5, searchParams: SearchParams): [Diving]
}

input SearchParams {
  query: String
  divingTypes: [DivingType]
  adminScore: Int
  waterEnvironmentScore: Int
  eyeSightScore: Int
  interests: [[ID]]
}
`;