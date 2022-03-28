const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________Instructor: Instructor
}

type Mutation {
  
  MUTATION_________________________Instructor: Instructor
  upsertInstructor(input: InstructorInput): Instructor!
  deleteInstructor(_id: ID!): Response!
}

type Instructor {
  _id: ID!,

  user: User!,
  licenseImages: [Image],
  instructorType: [DivingType],

  phoneNumber: String,
  email: String,
  gender: Gender,

  introduction: String
  careers: [String]

  profileImages: [Image]
  modifiedProfileImages: [Image]

  diveCenters: [DiveCenter],
  diveSites: [DiveSite],
  divePoints: [DivePoint],

  createdAt: Date,
  updatedAt: Date,
  typeDef: String
}

input InstructorInput {
  _id: ID,

  licenseImages: [ID],
  instructorType: [DivingType]

  phoneNumber: String
  email: String
  gender: Gender

  introduction: String
  careers: [String]

  profileImages: [ID]
  modifiedProfileImages: [ID]

  languageCodes: [String]

  diveCenters: [ID]
  diveSite: [ID]
  divePoint: [ID]
}

type DiveCenter {
  instructors: [Instructor]
}

type DivePoint {
  instructors: [Instructor]
}

type DiveSite {
  instructors: [Instructor]
}

type User {
  instructorProfile: Instructor
}

`;