const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________License: License
  getAllLicenses: [License]
}

type Mutation {
  
  MUTATION_________________________License: License
  upsertLicense(input: LicenseInput): License!
  deleteLicense(_id: ID!): Response!
}

type License {
  _id: ID!

  title: String,
  divingType: String,
  category: String,
  level: String,
  description: String,
  institution: String,

  createdAt: Date
  updatedAt: Date
}

input LicenseInput {
  _id: ID!

  title: String,
  divingType: String,
  category: String,
  level: String,
  description: String,
  institution: String
}

`;