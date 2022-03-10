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
  lat1: Float
  lng1: Float
  lat2: Float
  lng2: Float
  interests: [[ID]]

  divingStatus: DivingStatus
  peopleLeft : Int
  peopleCountGte : Int
  peopleCountLte: Int
  daysLeft: Int
  daysGte: Int
  daysLte: Int
  genderOnly: Gender
  daysOf7: [Int]
  
  startedAt: Date
  finishedAt: Date
}
`;