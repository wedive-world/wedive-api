const { gql } = require('apollo-server')

module.exports = gql`

type Query {
  getInstructorVerifications: [InstructorVerification]
}

type Mutation {
  upsertInstructorVerification(input: InstructorVerificationInput): InstructorVerification!
  verifyInstructor(instructorVerificationId: ID!, isVerified: Boolean!, reason: String): Response
}

type InstructorVerification {
  _id: ID!

  user: User!,
  licenseImages: [Image],
  licenses: [License],
  instructorType: [DivingType],

  phoneNumber: String,
  email: String,
  gender: Gender,

  introduction: String
  careers: [String]

  profileImages: [Image]

  diveCenters: [DiveCenter],
  diveSites: [DiveSite],
  divePoints: [DivePoint],

  isVerified: Boolean,
  reason: String,

  createdAt: Date
  updatedAt: Date
}

  input InstructorVerificationInput {
    _id: ID

    user: ID!,
    licenseImages: [ID],
    licenses: [ID],
    instructorType: [DivingType],

    phoneNumber: String,
    email: String,
    gender: Gender,

    introduction: String
    careers: [String]

    profileImages: [ID]

    diveCenters: [ID],
    diveSites: [ID],
    divePoints: [ID],
  }

  type User {
    instructorVerifications: [InstructorVerification]
  }

  input UserInput {
    instructorVerifications: [ID]
  }
`;