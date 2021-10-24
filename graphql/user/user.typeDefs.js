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

    name: String
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
`;