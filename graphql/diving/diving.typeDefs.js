const { gql } = require('apollo-server')

module.exports = gql`

type Query {

    getAllDivings: [Diving]
    getDivingById(_id: ID!): Diving
    getDivingsByHostUserId(hostUserId: ID!): [Diving]
}

type Mutation {

    upsertDiving(input: DivingInput): Diving!
    deleteDivingById(_id: ID!): ID!
    joinDiving(divingId: ID!): Response!
}


type Diving {
    _id: ID!

    title: String
    description: String
    status: DivingStatus!

    hostUser: User!
    participants: [Participant]
    maxPeopleNumber: Int

    interests: [Interest]

    diveSites: [DiveSite]
    divePoints: [DivePoint]
    diveCenters: [DiveCenter]

    startedAt: Date
    finishedAt: Date

    images: [Image]

    createdAt: Date
    updatedAt: Date
  }

  input DivingInput {
    _id: ID

    title: String
    description: String

    status: DivingStatus

    hostUser: ID!
    participants: [ParticipantInput]

    interests: [ID]

    diveSites: [ID]
    divePoints: [ID]
    diveCenters: [ID]

    startedAt: Date
    finishedAt: Date

    images: [ID]

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