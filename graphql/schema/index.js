const { gql } = require('apollo-server');
const typeDefs = gql`
  scalar Date

  type Query {
    getUserById(id: ID!): User
  }
  
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
  type ImageContentEntry {
    key: String,
    value: ImageContent
  }
  input Image {
    _id: ID,
    name: String
    description: String
    contentType: String
    contentMap: [ImageContentEntry],
    createdAt: Date,
    updatedAt: Date,
  }
  input ImageContent{
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
  input Instructor {
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
  type License{
    _id: ID,
    category: String,
    level: Int,
    title: String,
    description: String,
    institution: Institution,
  }
  input User2Input{
    name: String
  }
  type Mutation{
    createUser(user: User): User!
  }
`;

module.exports = typeDefs;