const { gql } = require('apollo-server')

module.exports = gql`

type Mutation {
    upsertInstructorVerification(input: InstructorVerificationInput): InstructorVerification!
    verifyInstructor(instructorVerificationId: ID!, isVerified: Boolean!, verificationReason: String): Response
}

type InstructorVerification {
    _id: ID!

    instructorLicenseImage: Image
    instructorType: DivingType
    phoneNumber: String
    email: String
    isVerified: Boolean
    verificationReason: String

    createdAt: Date
    updatedAt: Date
  }

  input InstructorVerificationInput {
    _id: ID

    instructorLicenseImage: ID
    instructorType: DivingType
    phoneNumber: String
    email: String
    isVerified: Boolean
    verificationReason: String
  }

  type InstructorProfile {
    _id: ID
    introduction: String
    careers: [String]
  }

  type User {
    instructorTypes: [DivingType]
    instructorVerifications: [InstructorVerification]
  }

  input UserInput {
    instructorVerifications: [ID]
  }
`;