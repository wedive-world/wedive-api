const { gql } = require('apollo-server')

module.exports = gql`

type Query {

    """get All users"""
    getAllUsers: [User]
    """get only one user by id"""
    getUserById(_id: ID!): User
    getUserByEmail(email: String): User
}

type Mutation {
    upsertUser(input: UserInput): User!
    updateFcmToken(firebaseUid: String!, fcmToken: String!): Response!
}

type User {
    _id: ID!

    firebaseUid: String!
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

    createdAt: Date
    updatedAt: Date
  }

  input UserInput {
    _id: ID

    name: String
    nickName: String
    email: String

    birthAge: Int
    gender: Gender

    instructors: [ID]
    profileImages: [ID]

    divingLog: Int
    freeDivingBest: [StringEntryInput]

    interests: [ID]
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
`;