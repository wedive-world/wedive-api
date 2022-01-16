const { gql } = require('apollo-server')

module.exports = gql`

type Mutation {

  MUTATION_________________________ADMIN: Response
  updateAddressByLocation(targetType: String): Response!
  updateDiveCenterLatLngByAddress: Response!
  updateLatLngByAddress(targetType: String): Response!
}

`;