const { gql } = require('apollo-server');
const typeDefs = gql`
  scalar Date

  type User {
    _id: ID
    name: String
    birthAge: Int
    gender: String
    profileImage: Image
    instructor: Instructor
    countryCode: String
    languageCodes: [String]
    createdAt: Date
    updatedAt: Date
  }

  input UserInput {
    name: String
    birthAge: Int
    gender: String
    countryCode: String
    languageCodes: [String]
  }

  type ImageContentEntry {
    key: String,
    value: ImageContent
  }

  type Image {
    _id: ID,
    name: String
    description: String
    contentType: String
    contentMap: [ImageContentEntry],
    createdAt: Date,
    updatedAt: Date,
  }

  type ImageContent{
    _id: ID
    name: String
    url: String
    createdAt: Date
  }

  type Institution{
    _id: ID
    name: String
    description: String
  }

  type Instructor {
    _id: ID,
    user: User,
    gender: Int,
    description: String
    profileImage: [Image]
    licenseIds: [License]
    countryCode: String
    languageCodes: [String]
    createdAt: Date
    updatedAt: Date
  }

  type License {
    _id: ID,
    category: String,
    level: Int,
    title: String,
    description: String,
    institution: Institution,
  }

  type DivePoint {
    _id: ID
    name: String
    description: String
    latitude: Float
    longitude: Float
    depth: Int
    diveSiteId: DiveSite
    createdAt: Date
    updatedAt: Date
  }

  type DiveSite {
    _id: ID
    name: String
    description: String
    latitude: Float
    longitude: Float
    propertyMap: [PropertyEntry]
    countryCode: String
    createdAt: Date
    updatedAt: Date
  }

  input DiveSiteInput {
    name: String
    description: String
    latitude: Float
    longitude: Float
    countryCode: String
  }

  type PropertyEntry {
    key: String,
    value: String
  }

  type DiveCenter {
    _id: ID
    name: String
    description: String
    latitude: Float
    longitude: Float
    supportFreeDiving: Boolean
    supportScubaDiving: Boolean
    countryCode: String
    diveSites: [DiveSite]
    managers: [User]
    createdAt: Date
    updatedAt: Date
  }

  type Query {
    user(id: ID!): User
    users: [User]

    diveCenter(id: ID!): DiveCenter
    diveCenters: [DiveCenter]

    diveSite(id: ID!): DiveSite
    diveSites: [DiveSite]

    divePoint(id: ID!): DivePoint
    divePoints: [DivePoint]
  }

  type Mutation{
    user(userInput: UserInput): User!
    diveSite(diveSiteInput: DiveSiteInput!): DiveSite!
    diveSites(diveSiteInputs: [DiveSiteInput!]!): String
  }

`;

module.exports = typeDefs;