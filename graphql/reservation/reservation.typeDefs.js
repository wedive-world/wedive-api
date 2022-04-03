const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________Reservations: Reservation
  getReservationsByCurrentUser(skip: Int = 0, limit: Int = 10): [Reservation]
  getOpenedReservation(skip: Int = 0, limit: Int = 10): [Reservation]
}

type Mutation {
  
  MUTATION_________________________Reservations: Reservation
  upsertReservation(input: ReservationInput!): Reservation!
  cancelReservationById(_id: ID!, reason: String): Response!
  acceptReservationById(_id: ID!): Response!
  completeReservationById(_id: ID!): Response!
  rejectReservationById(_id: ID!, reason: String): Response!
}

type Reservation {
  _id: ID!

  peopleNumber: Int

  startedAt: Date
  finishedAt: Date

  name: String
  phoneNumber: String
  
  user: User

  status: ReservationStatus
  adminStatus: ReservationAdminStatus
  admin: User

  receipts: [Receipt]

  createdAt: Date
  updatedAt: Date
}

input ReservationInput {
  _id: ID
  
  peopleNumber: Int

  startedAt: Date
  finishedAt: Date

  receipts: [ReceiptInput]

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

type DiveCenter {
  reservationTypes: [ReservationType]
  reservationHourUnit: Int
  reservationPeriods: [ReservationPeriod]
}

input DiveCenterInput {
  reservationTypes: [ReservationType]
  reservationHourUnit: Int
  reservationPeriods: [ReservationPeriodInput]
}

enum ReservationType {
  hours
  period
}

type ReservationPeriod {
    startHour: Int
    startMinute: Int
    finishHour: Int
    finishMinute: Int
    name: String
}

input ReservationPeriodInput {
    startHour: Int
    startMinute: Int
    finishHour: Int
    finishMinute: Int
    name: String
}

type Receipt {
  product: Product
  quantity: Int
}

input ReceiptInput {
  product: ID
  quantity: Int
}
`;