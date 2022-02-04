const { gql } = require('apollo-server')

module.exports = gql`

type User {
  divingHistoryLocations: [[Float]]
}

`;