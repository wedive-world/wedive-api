const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________Users: User

  """get All users"""
  getAllUsers: [User]
  """get only one user by id"""
  getUserById(_id: ID!): User
  getUserByEmail(email: String!): User
  getUserByNickName(nickName: String!): User
  getUserByUid(uid: ID!): User
}

type Mutation {
  MUTATION_________________________Users: User
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

  freeDivingBests: [[String]]
  freeLicenseLevel: String
  freeLicenseType: String

  scubaLicenseLevel: String
  scubaLicenseType: String

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

  interests: [ID]

  divingLog: Int

  freeDivingBests: [[String]]
  freeLicenseLevel: String
  freeLicenseType: String

  scubaLicenseLevel: String
  scubaLicenseType: String
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

type Diving {
  hostUser: User!
}

input DivingInput {
  hostUser: ID!
}

type Instructor {
  user: User!
}

`;