const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY_________Divings_________: Diving
  getAllDivings: [Diving]
  getDivingById(_id: ID!): Diving
  getDivingsByHostUserId(hostUserId: ID!): [Diving]
}

type Mutation {

  MUTATION_________Divings_________: Diving
  upsertDiving(input: DivingInput): Diving!
  deleteDivingById(_id: ID!): ID!
  joinDiving(divingId: ID!): Response!
}

type Diving {
    _id: ID!

    title: String
    description: String
    status: DivingStatus!
    type: DivingType

    participants: [Participant]
    maxPeopleNumber: Int

    startedAt: Date
    finishedAt: Date

    createdAt: Date
    updatedAt: Date
  }

  input DivingInput {
    _id: ID

    title: String
    description: String
    status: DivingStatus
    type: DivingType

    participants: [ParticipantInput]
    maxPeopleNumber: Int

    startedAt: Date
    finishedAt: Date

    createdAt: Date
    updatedAt: Date
}

enum DivingStatus {
  searchable
  publicEnded
  divingComplete

  canceled
  banned
}

enum DivingType {
  scubaDiving
  freeDiving
}

enum ParticipantStatus {
  applied
  joined
  banned
}

type Participant {
  user: User
  status: ParticipantStatus
  name: String
  birth: Int
  gender: String
}

input ParticipantInput {
  user: ID
  status: ParticipantStatus
  name: String
  birth: Int
  gender: String
}

`;