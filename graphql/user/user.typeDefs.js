const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY_________Users_________: User

  """get All users"""
  getAllUsers: [User]
  """get only one user by id"""
  getUserById(_id: ID!): User
  getUserByEmail(email: String!): User
  getUserByNickName(nickName: String!): User
}

type Mutation {
  MUTATION_________Users_________: User
  upsertUser(input: UserInput): User!
  updateFcmToken(firebaseUid: String!, fcmToken: String!): Response!
}

type User {
  _id: ID!

  uid: String
  authProvider: AuthProvider
  oauthToken: String

  fcmToken: String

  email: String
  emailVerified: Boolean
  phoneNumber: String
  phoneNumberVerified: Boolean

  profileImages: [Image]
  nickName: String
  name: String

  birthAge: Int
  gender: Gender
  residence: String

  interests: [Interest]

  divingLog: Int

  freeDivingBests: [StringEntry]
  freeLicenceseLevel: String
  freeLicenceType: String

  scubaLicenceseLevel: String
  scubaLicenceType: String

  createdAt: Date
  updatedAt: Date
}

input UserInput {
  _id: ID

  uid: String
  authProvider: AuthProvider
  oauthToken: String

  email: String
  phoneNumber: String

  profileImages: [ID]
  nickName: String
  name: String

  birthAge: Int
  gender: Gender
  residence: String

  instructors: [ID]

  interests: [ID]

  divingLog: Int

  freeDivingBest: [StringEntryInput]
  freeLicenceseLevel: String
  freeLicenceType: String

  scubaLicenceseLevel: String
  scubaLicenceType: String
}

enum AuthProvider {
  firebase
}

enum Gender {
  m
  f
}

type InstructorVerification {
  user: User
}

input InstructorVerificationInput {
  user: ID!
}

type Instructor {
  _id: ID,
  user: User,
  gender: Int,
  description: String
  languageCodes: [String]
  createdAt: Date
  updatedAt: Date
}

type Diving {
  hostUser: User!
}

input DivingInput {
  hostUser: ID!
}

`;