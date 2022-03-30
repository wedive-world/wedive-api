const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________Reservations: Reservation
  getReservationsByCurrentUser(skip: Int = 0, limit: Int = 10): [Reservation]
  getOpenedReservation(skip: Int = 0, limit: Int = 10): [Reservation]
}

type Mutation {
  
  MUTATION_________________________Reservations: Reservation
  upsertReservation(input: ReservationInput): Reservation!
  cancelReservationById(_id: ID!, reason: String): Response!
  assignReservationById(_id: ID!): Response!
  completeReservationById(_id: ID!): Response!
  rejectReservationById(_id: ID!, reason: String): Response!
}

type Reservation {
  _id: ID!

  diveCenter: DiveCenter
  peopleNumber: Int

  startedAt: Date
  finishedAt: Date

  name: String
  phoneNumber: String
  
  user: User

  status: ReservationStatus
  adminStatus: ReservationAdminStatus
  admin: User

  createdAt: Date
  updatedAt: Date
}

input ReservationInput {
  _id: ID
  
  diveCenter: ID!
  peopleNumber: Int

  startedAt: Date
  finishedAt: Date

  name: String
  phoneNumber: String
}

enum ReservationStatus {
  requested
  accepted
  complete
  rejected
  cancelRequested
  cancelAccepted
  canceled
  cancelRejected
}

enum ReservationAdminStatus {
  opened
  assigned
  closed
}

`;