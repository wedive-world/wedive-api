const { gql } = require('apollo-server');
const typeDefs = gql`
  scalar Date

  # The implementation for this scalar is provided by the
  # 'GraphQLUpload' export from the 'graphql-upload' package
  # in the resolver map below.
  scalar Upload

  interface Place {
    address: String
    latitude: Float!
    longitude: Float!
    countryCode: String
  }

  interface Introduction {
    name: String!
    description: String
    images: [Image]
    backgroundImages: [Image]
    youtubeVideoIds: [String]
    referenceUrls: [String]
  }

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
    """e.g.) 1989, 1991, 1942""" birth: Int!
    """e.g.) m: male, f: female""" gender: String!
    """2alpha iso code, e.g.) kr, jp, us""" countryCode: String! 
    """2alpha iso code, e.g.) kr, jp, us""" mainLanguageCode: String! 
    """2alpha iso code, e.g.) kr, jp, us""" languageCodes: [String!]! 
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

  type ImageContent {
    _id: ID
    name: String
    url: String
    createdAt: Date
  }

  type Institution {
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

  type DivePoint implements Place & Introduction {
    _id: ID!
    name: String!
    description: String
    images: [Image]
    backgroundImages: [Image]
    youtubeVideoIds: [String]
    referenceUrls: [String]

    address: String
    latitude: Float!
    longitude: Float!
    countryCode: String

    diveSiteId: ID!

    adminScore: Int
    minDepth: Int
    maxDepth: Int
    minTemperature: Int
    maxTemperature: Int
    flowRateScore: Int

    interests: [Interest]

    createdAt: Date
    updatedAt: Date
  }

  input DivePointInput {
    _id: ID
    name: String
    description: String
    images: [ID]
    backgroundImages: [ID]
    youtubeVideoIds: [String]
    referenceUrls: [String]

    address: String
    latitude: Float!
    longitude: Float!
    countryCode: String

    diveSiteId: ID!

    adminScore: Int
    minDepth: Int
    maxDepth: Int
    minTemperature: Int
    maxTemperature: Int
    flowRateScore: Int

    interests: [ID]
  }

  type DiveSite implements Place & Introduction {
    _id: ID!
    name: String!
    description: String
    images: [Image]
    backgroundImages: [Image]
    youtubeVideoIds: [String]
    referenceUrls: [String]

    address: String
    latitude: Float!
    longitude: Float!
    countryCode: String

    divePoints: [DivePoint]
    interests: [Interest]

    waterTemperatureScore: Int
    eyeSiteScore: Int
    adminScore: Int

    createdAt: Date
    updatedAt: Date
  }

  input DiveSiteInput {
    _id: ID
    name: String
    description: String
    images: [ID]
    backgroundImages: [ID]
    youtubeVideoIds: [String]
    referenceUrls: [String]

    address: String
    latitude: Float!
    longitude: Float!
    countryCode: String

    divePoints: [ID]
    interests: [ID]

    waterTemperatureScore: Int
    eyeSiteScore: Int
    adminScore: Int
  }

  type StringEntry {
    key: String,
    value: String
  }

  type DiveCenter implements Place & Introduction {

    _id: ID!
    name: String!
    description: String
    images: [Image]
    backgroundImages: [Image]
    youtubeVideoIds: [String]
    referenceUrls: [String]

    address: String
    latitude: Float!
    longitude: Float!
    countryCode: String
    
    interests: [Interest]

    diveSites: [DiveSite]
    divePoints: [DivePoint]

    managers: [User]
    clerks: [User]

    phoneNumber: String
    supportFreeDiving: Boolean
    supportScubaDiving: Boolean

    createdAt: Date
    updatedAt: Date
  }

  input DiveCenterInput {

    _id: ID
    name: String!
    description: String
    images: [ID]
    backgroundImages: [ID]
    youtubeVideoIds: [String]
    referenceUrls: [String]

    address: String
    latitude: Float!
    longitude: Float!
    countryCode: String
    
    interests: [ID]

    diveSites: [ID]
    divePoints: [ID]

    managers: [ID]
    clerks: [ID]

    phoneNumber: String
    supportFreeDiving: Boolean
    supportScubaDiving: Boolean
  }

  type Interest {
    _id: ID
    title: String
    type: InterestType
    iconType: String
    iconName: String
    iconColor: String
    iconUrl: String
  }

  input InterestInput {
    _id: ID
    title: String
    type: InterestType
    iconType: String
    iconName: String
    iconColor: String
    iconUrl: String
  }

  enum InterestType {
    """할인 대상""" discountTarget
    """할인 옵션""" discountOption
    """성별""" gender
    """나이""" age
    """친목""" amity
    """여행 특성""" tripFeature
    """수상 내역""" award
    """별명""" nickName
    """다이빙 환경""" divingPointEnvironment
    """수중 생물""" aquaticLife
    """다이빙 타입(프리,스쿠바)""" divingType
  }

  type Query {
    getAllUsers: [User]
    getUserById(_id: ID!): User

    getAllDiveSites: [DiveSite]
    getDiveSiteById(_id: ID!): DiveSite
    getDiveSitesNearby(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!): [DiveSite]
    searchDiveSitesByName(query: String!): [DiveSite]

    getAllDivePoints: [DivePoint]
    getDivePointById(_id: ID!): DivePoint
    getDivePointsNearBy(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!): [DivePoint]
    searchDivePointsByName(query: String!): [DivePoint]

    getAllInterests(type: String): [Interest]
    getInterestById(_id: ID!): Interest
    searchInterestsByName(query: String!, type: String): [Interest]

    getImageUrlById(_id: ID!, width: Int): String
  }

  type Mutation{
    upsertUser(userInput: UserInput): User!

    upsertDivePoint(input: DivePointInput!): DivePoint!
    deleteDivePointById(_id: ID!): ID

    upsertDiveSite(input: DiveSiteInput!): DiveSite!
    deleteDiveSiteById(_id: ID!): ID

    upsertInterest(input: InterestInput!): Interest!
    deleteInterestById(_id: ID!): ID

    uploadImage(file: Upload!): Image!
  }

`;

module.exports = typeDefs;