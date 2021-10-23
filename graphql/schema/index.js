const { gql } = require('apollo-server');
const typeDefs = gql`

type Query {

    """get All users"""
    getAllUsers: [User]
    """get only one user by id"""
    getUserById(_id: ID!): User
    getUserByEmail(email: String): User

    getAllDiveSites: [DiveSite]
    getDiveSiteById(_id: ID!): DiveSite
    getDiveSitesNearby(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!): [DiveSite]
    searchDiveSitesByName(query: String!): [DiveSite]

    getAllDivePoints: [DivePoint]
    getDivePointById(_id: ID!): DivePoint
    getDivePointsNearBy(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!): [DivePoint]
    searchDivePointsByName(query: String!): [DivePoint]

    getAllDiveCenters: [DiveCenter]
    getDiveCenterById(_id: ID!): DiveCenter
    getDiveCentersNearBy(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!): [DiveCenter]
    searchDiveCentersByName(query: String!): [DiveCenter]

    getAllInterests(type: String): [Interest]
    getInterestById(_id: ID!): Interest
    searchInterestsByName(query: String!, type: String): [Interest]

    getImageUrlById(_id: ID!, width: Int): String

    getAllDivings: [Diving]
    getDivingById(_id: ID!): Diving
    getDivingsByHostUserId(hostUserId: ID!): [Diving]
  }

  type Mutation{
    upsertUser(input: UserInput): User!

    upsertDivePoint(input: DivePointInput!): DivePoint!
    deleteDivePointById(_id: ID!): ID

    upsertDiveSite(input: DiveSiteInput!): DiveSite!
    deleteDiveSiteById(_id: ID!): ID

    upsertDiveCenter(input: DiveCenterInput!): DiveCenter!
    deleteDiveCenterById(_id: ID!): ID

    upsertInterest(input: InterestInput!): Interest!
    deleteInterestById(_id: ID!): ID

    uploadImage(file: Upload!): Image!
    
    upsertHighlight(input: HighlightInput!): Highlight!
    deleteHighlightById(_id: ID!): ID

    upsertDiving(input: DivingInput): Diving!
    deleteDivingById(_id: ID!): ID!
    joinDiving(divingId: ID!): Response!
  }

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
    """name for show to user"""
    name: String

    """unique id for url, english"""
    uniqueName: String
    description: String
    images: [Image]
    backgroundImages: [Image]
    youtubeVideoIds: [String]
    referenceUrls: [String]
    memo: String
  }

  interface Publishable {
    publishSatus: PublishStatus
  }
enum PublishStatus {
    pending
    active
    inactive
    deleted
  }

  interface MonthlyInterest {
    month1: [Interest]
    month2: [Interest]
    month3: [Interest]
    month4: [Interest]
    month5: [Interest]
    month6: [Interest]
    month7: [Interest]
    month8: [Interest]
    month9: [Interest]
    month10: [Interest]
    month11: [Interest]
    month12: [Interest]
  }

  type User {
    _id: ID!

    name: String!
    email: String!

    birthAge: Int
    gender: Gender

    instructor: Instructor
    profileImages: [Image]

    createdAt: Date!
    updatedAt: Date!
  }

  input UserInput {
    _id: ID

    name: String!
    email: String!

    birthAge: Int
    gender: Gender

    instructor: ID
    profileImages: [ID]
  }

  enum Gender {
    m
    f
  }

  type ImageContentEntry {
    key: String,
    value: ImageContent
  }

  type Image {
    _id: ID
    name: String
    description: String
    reference: String,

    uploaderId: String,
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

  type DivePoint implements Place & Introduction & Publishable & MonthlyInterest {
    _id: ID!

    address: String
    latitude: Float!
    longitude: Float!
    countryCode: String

    name: String
    uniqueName: String
    description: String
    images: [Image]
    backgroundImages: [Image]
    youtubeVideoIds: [String]
    referenceUrls: [String]
    memo: String

    publishSatus: PublishStatus

    month1: [Interest]
    month2: [Interest]
    month3: [Interest]
    month4: [Interest]
    month5: [Interest]
    month6: [Interest]
    month7: [Interest]
    month8: [Interest]
    month9: [Interest]
    month10: [Interest]
    month11: [Interest]
    month12: [Interest]

    diveSiteId: ID!

    adminScore: Int
    minDepth: Int
    maxDepth: Int
    minTemperature: Int
    maxTemperature: Int
    flowRateScore: Int

    interests: [Interest]
    highlights: [Highlight]

    createdAt: Date
    updatedAt: Date
  }

  input DivePointInput {
    _id: ID

    address: String
    latitude: Float!
    longitude: Float!
    countryCode: String

    name: String
    uniqueName: String
    description: String
    images: [ID]
    backgroundImages: [ID]
    youtubeVideoIds: [String]
    referenceUrls: [String]
    memo: String

    publishSatus: PublishStatus

    month1: [ID]
    month2: [ID]
    month3: [ID]
    month4: [ID]
    month5: [ID]
    month6: [ID]
    month7: [ID]
    month8: [ID]
    month9: [ID]
    month10: [ID]
    month11: [ID]
    month12: [ID]

    diveSiteId: ID!

    adminScore: Int
    minDepth: Int
    maxDepth: Int
    minTemperature: Int
    maxTemperature: Int
    flowRateScore: Int

    interests: [ID]
    highlights: [ID]
  }
  
  type Highlight {
    _id: ID!
    name: String
    description: String
    images: [Image]
    divePointId: ID!
    interests: [Interest]
  }

  input HighlightInput {
    _id: ID!
    name: String
    description: String
    images: [ID]
    divePointId: ID
    interests: [ID]
  }

  type DiveSite implements Place & Introduction & Publishable & MonthlyInterest {
    _id: ID!

    address: String
    latitude: Float!
    longitude: Float!
    countryCode: String

    name: String
    uniqueName: String
    description: String
    images: [Image]
    backgroundImages: [Image]
    youtubeVideoIds: [String]
    referenceUrls: [String]
    memo: String

    publishSatus: PublishStatus

    month1: [Interest]
    month2: [Interest]
    month3: [Interest]
    month4: [Interest]
    month5: [Interest]
    month6: [Interest]
    month7: [Interest]
    month8: [Interest]
    month9: [Interest]
    month10: [Interest]
    month11: [Interest]
    month12: [Interest]

    divePoints: [DivePoint]
    interests: [Interest]

    waterTemperatureScore: Int
    eyeSiteScore: Int
    adminScore: Int

    visitTimeDescription: String
    waterTemperatureDescription: String
    deepDescription: String
    waterFlowDescription: String
    eyeSightDescription: String
    highlightDescription: String

    createdAt: Date
    updatedAt: Date
  }

  input DiveSiteInput {
    _id: ID

    address: String
    latitude: Float!
    longitude: Float!
    countryCode: String

    name: String
    uniqueName: String
    description: String
    images: [ID]
    backgroundImages: [ID]
    youtubeVideoIds: [String]
    referenceUrls: [String]
    memo: String

    publishSatus: PublishStatus

    month1: [ID]
    month2: [ID]
    month3: [ID]
    month4: [ID]
    month5: [ID]
    month6: [ID]
    month7: [ID]
    month8: [ID]
    month9: [ID]
    month10: [ID]
    month11: [ID]
    month12: [ID]

    divePoints: [ID]
    interests: [ID]

    waterTemperatureScore: Int
    eyeSiteScore: Int
    adminScore: Int

    visitTimeDescription: String
    waterTemperatureDescription: String
    deepDescription: String
    waterFlowDescription: String
    eyeSightDescription: String
    highlightDescription: String
  }

  type StringEntry {
    key: String,
    value: String
  }

  type DiveCenter implements Place & Introduction & Publishable {

    _id: ID!

    address: String
    latitude: Float!
    longitude: Float!
    countryCode: String

    name: String
    uniqueName: String
    description: String
    images: [Image]
    backgroundImages: [Image]
    youtubeVideoIds: [String]
    referenceUrls: [String]
    memo: String
    
    publishSatus: PublishStatus

    interests: [Interest]

    diveSites: [DiveSite]
    divePoints: [DivePoint]

    managers: [User]
    clerks: [User]

    phoneNumber: String
    divingType: [DivingType]

    createdAt: Date
    updatedAt: Date
  }

  input DiveCenterInput {
    _id: ID

    address: String
    latitude: Float!
    longitude: Float!
    countryCode: String

    name: String
    uniqueName: String
    description: String
    images: [ID]
    backgroundImages: [ID]
    youtubeVideoIds: [String]
    referenceUrls: [String]
    memo: String
    
    publishSatus: PublishStatus

    interests: [ID]

    diveSites: [ID]
    divePoints: [ID]

    managers: [ID]
    clerks: [ID]

    phoneNumber: String
    divingType: [DivingType]
  }

  type Interest implements Introduction {
    _id: ID
    title: String
    type: InterestType
    iconType: String
    iconName: String
    iconColor: String
    iconUrl: String

    name: String
    uniqueName: String
    description: String
    images: [Image]
    backgroundImages: [Image]
    youtubeVideoIds: [String]
    referenceUrls: [String]
    memo: String
  }

  input InterestInput {
    _id: ID
    title: String
    type: InterestType
    iconType: String
    iconName: String
    iconColor: String
    iconUrl: String

    name: String!
    uniqueName: String!
    description: String
    images: [ID]
    backgroundImages: [ID]
    youtubeVideoIds: [String]
    referenceUrls: [String]
    memo: String
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
    """month, 1,2,3,4... 12 """ month
    """sunny, cloudy, rain, heavyRain""" climate
    """popular, soso, unrecommended""" popularity
  }

  type Diving {
    _id: ID!

    title: String
    description: String
    status: DivingStatus!

    hostUser: User!
    participants: [Participant]
    maxPeopleNumber: Int

    interests: [Interest]

    diveSites: [DiveSite]
    divePoints: [DivePoint]
    diveCenters: [DiveCenter]

    startedAt: Date
    finishedAt: Date

    images: [Image]

    createdAt: Date
    updatedAt: Date
  }

  input DivingInput {
    _id: ID

    title: String
    description: String

    status: DivingStatus

    hostUser: ID!
    participants: [ParticipantInput]

    interests: [ID]

    diveSites: [ID]
    divePoints: [ID]
    diveCenters: [ID]

    startedAt: Date
    finishedAt: Date

    images: [ID]

    createdAt: Date
    updatedAt: Date
}

enum DivingStatus {
  searchable
  publicEnded
  divingComplete

  canceled
  banned
}

enum DivingType {
  scubaDiving
  freeDiving
}

enum ParticipantStatus {
  applied
  joined
  banned
}

type Participant {
  user: User
  status: ParticipantStatus
  name: String
  birth: Int
  gender: String
}

input ParticipantInput {
  user: ID
  status: ParticipantStatus
  name: String
  birth: Int
  gender: String
}

type Response {
  result: ResponseResult
  reason: ResponseReason
}

enum ResponseResult {
  success
  fail
}

enum ResponseReason {
  tooManyPeople
  publicEnded
}
`;

module.exports = typeDefs;