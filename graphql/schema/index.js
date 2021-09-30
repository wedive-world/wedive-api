const { gql } = require('apollo-server');
const typeDefs = gql`
  scalar Date

  # The implementation for this scalar is provided by the
  # 'GraphQLUpload' export from the 'graphql-upload' package
  # in the resolver map below.
  scalar Upload

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
    _id: ID
    name: String
    description: String
    mimeType: String
    encoding: String
    fileSize: Int
    contentMap: [ImageContentEntry]
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
    address: String
    latitude: Float
    longitude: Float
    adminScore: Int
    minDepth: Int
    maxDepth: Int
    minTemperature: Int
    maxTemperature: Int
    diveSiteId: ID
    interests: [Interest]
    images: [Image]
    backgroundImages: [Image]
    countryCode: String
    createdAt: Date
    updatedAt: Date
  }

  input DivePointInput {
    _id: ID
    name: String
    description: String
    address: String
    latitude: Float
    longitude: Float
    adminScore: Int
    minDepth: Int
    maxDepth: Int
    minTemperature: Int
    maxTemperature: Int
    diveSiteId: ID
    interests: [ID]
    images: [ID]
    backgroundImages: [ID]
    countryCode: String
  }

  type DiveSite {
    _id: ID
    name: String
    description: String
    address: String
    latitude: Float
    longitude: Float
    adminScore: Int
    divePoints: [DivePoint]
    interests: [Interest]
    images: [Image]
    backgorundImages: [Image]
    youtubeVideoIds: [String]
    referenceUrls: [String]
    countryCode: String
    createdAt: Date
    updatedAt: Date
  }

  input DiveSiteInput {
    _id: ID
    name: String
    description: String
    address: String
    latitude: Float
    longitude: Float
    adminScore: Int
    divePoints: [ID]
    interests: [ID]
    images: [ID]
    backgorundImages: [ID]
    youtubeVideoIds: [String]
    referenceUrls: [String]
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

  input InterestInput {
    _id: ID
    title: String
    type: String
    iconType: String
    iconName: String
    iconColor: String
    iconUrl: String
  }

  type Query {
    user(_id: ID!): User
    users: [User]

    diveSite(_id: ID!): DiveSite
    searchDiveSite(query: String!, countryCode: String!): [DiveSite]
    nearByDiveSite(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!): [DiveSite]
    diveSites: [DiveSite]

    divePoint(_id: ID!): DivePoint
    searchDivePoint(query: String!, countryCode: String!): [DivePoint]
    nearByDivePoint(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!): [DivePoint]
    divePoints: [DivePoint]

      """
      @parameter type
        할인대상: discountTarget
        할인옵션: discountOption
        성별: gender
        나이: age
        다이빙: diving
        친목: amity
        환경: environment
      """
    interests(
      type: String
    ): [Interest]

    searchInterest(query: String!, type: String): [Interest]

    imageUrl(_id: ID!, width: Int): String
  }

  type Mutation{
    user(userInput: UserInput): User!

    divePoint(input: DivePointInput!): DivePoint!
    diveSite(input: DiveSiteInput!): DiveSite!

    interest(input: InterestInput!): Interest!

    uploadImage(file: Upload!): Image!
  }

`;

module.exports = typeDefs;