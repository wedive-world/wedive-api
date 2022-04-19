const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________Instructor: Instructor
  searchInstructor(searchParams: SearchParams): [Instructor]
  getInstructorByCurrentUser: Instructor
  getInstructorById(_id: ID!): Instructor
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

  name: String
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

  educations: [Product]
  courses: [Product]
  services: [Product]

  createdAt: Date,
  updatedAt: Date,
  typeDef: String
}

input InstructorInput {
  _id: ID,

  licenseImages: [ID],
  instructorType: [DivingType]

  name: String
  phoneNumber: String
  email: String
  gender: Gender

  introduction: String
  careers: [String]

  profileImages: [ID]
  modifiedProfileImages: [ID]

  languageCodes: [String]

  educations: [ID]
  courses: [ID]
  services: [ID]

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