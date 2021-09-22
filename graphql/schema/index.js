const { gql } = require('apollo-server');
const typeDefs = gql`
  scalar Date

  type User {
    _id: ID!
    name: String!
    birthAge: Int!
    gender: String!
    profileImages: [Image]
    instructor: Instructor
    countryCode: String!
    mainLanguageCode: String!
    languageCodes: [String!]!
    createdAt: Date!
    updatedAt: Date!
  }

  input UserInput {
    name: String!
    """e.g.) 1989, 1991, 1942"""
    birth: Int!

    """e.g.) m: male, f: female"""
    gender: String!

    """2alpha iso code, e.g.) kr, jp, us"""
    countryCode: String! 
    
    """2alpha iso code, e.g.) kr, jp, us"""
    mainLanguageCode: String! 

    """2alpha iso code, e.g.) kr, jp, us"""
    languageCodes: [String!]! 
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
    propertyMap: [StringEntry]
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

  type StringEntry {
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

  type Interest {
    _id: ID
    title: String
    type: String
    iconType: String
    iconName: String
    iconColor: String
    iconUrl: String
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

    interests(
      """
      iso-alpha2 code, e.g.) jp, us, kr
      """
      languageCode: String!,
      """
      할인대상: discountTarget
      할인옵션: discountOption
      성별: gender
      나이: age
      다이빙: diving
      친목: amity
      환경: environment
      """
      type: String!
    ): [Interest]
  }

  type Mutation{
    user(userInput: UserInput): User!

    diveSite(diveSiteInput: DiveSiteInput!): DiveSite!
    diveSites(diveSiteInputs: [DiveSiteInput!]!): String

    interest(
      title: String!,
      type: String!,
      languageCode: String!,
      iconType: String!,
      iconName: String,
      iconColor: String,
      iconUrl: String
    ): Interest!
  }

`;

module.exports = typeDefs;