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
    users: [User]
    getUserById(id: ID!): User

    diveCenters: [DiveCenter]
    diveSites: [DiveSite]
    divePoints: [DivePoint]

    getDiveCenterById(id: ID!): DiveCenter
    getDiveSiteById(id: ID!): DiveSite
    getDivePointById(id: ID!): DivePoint
  }

  type Mutation{
    createUser(userInput: UserInput): User!
  }

`;

module.exports = typeDefs;