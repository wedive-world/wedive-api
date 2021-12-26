const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________Instructor: Instructor
}

type Mutation {
  
  MUTATION_________________________Instructor: Instructor
  updateInstructor(input: InstructorInput): Instructor!
  deleteInstructor(_id: ID!): Response!
}

type Instructor {
  _id: ID,

  user: User!,
  licenseImages: [Image],
  licenses: [License],
  instructorType: [DivingType],

  phoneNumber: String,
  email: String,

  gender: Gender,
  description: String,

  profileImages: [Image],

  languageCodes: [String],

  diveCenters: [DiveCenter],
  diveSite: [DiveSite],
  divePoint: [DivePoint],

  createdAt: Date,
  updatedAt: Date,
}

input InstructorInput {
  _id: ID,

  phoneNumber: String,
  email: String,

  gender: Gender,
  description: String,

  profileImages: [ID],

  languageCodes: [String],

  diveCenters: [ID],
  diveSite: [ID],
  divePoint: [ID],
}

`;