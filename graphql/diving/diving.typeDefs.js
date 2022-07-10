const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________Divings: Diving
  getAllDivings: [Diving]
  getDivingById(_id: ID!): Diving
  getDivingsByHostUserId(hostUserId: ID!): [Diving]
  getDivingsByCurrentUser(skip: Int! = 0, limit: Int! = 10): [Diving]
  getDivingByChatRoomId(chatRoomId: String!): Diving
  getNearByDivings(lat: Float!, lng:Float!, skip:Int! = 0, limit: Int! = 10): [Diving]
  getDivingsByPlaceId(placeId: String!, activated:Boolean! = false, skip:Int! = 0, limit: Int! = 10): [Diving]
}

type Mutation {

  MUTATION_________Divings_________: Diving
  upsertDiving(input: DivingInput): Diving!
  deleteDivingById(_id: ID!): ID!
  joinDiving(divingId: ID!): Response!
  acceptParticipant(divingId: ID!, userId: ID!): Response!
  kickParticipant(divingId: ID!, userId: ID!): Response!
  completeDivingIfExist: Response!
  prepareDivingIfExist(days: Int = 3): Response!
  updateDivingProperties: Response!
}

type Diving {
    _id: ID!

    title: String
    description: String
    status: DivingStatus
    type: [DivingType]

    hostUser: User

    participants: [Participant]
    maxPeopleNumber: Int

    startedAt: Date
    finishedAt: Date
    
    chatRoomId: String

    createdAt: Date
    updatedAt: Date
    typeDef: String
  }

  input DivingInput {
    _id: ID

    title: String
    description: String
    status: DivingStatus
    type: [DivingType]

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
  leaveABoard
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