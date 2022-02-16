const { gql } = require('apollo-server')

module.exports = gql`

type Query {
  QUERY____________________________Notification: Notification
  getNotifications(skip: Int = 0, limit: Int = 10): [Notification]
}

type Mutation {
  MUTATION_________________________Notification: Notification

  read(notificationId: ID!): Response
  readAll: Response
}

type Notification {
  _id: ID
  userId: ID,

  targetId: ID,
  targetType: NotificationTargetType,
  target: NotificationTarget

  subjectId: ID
  subjectType: NotificationTargetType
  subject: NotificationTarget
  
  event: NotificationEvent,
  read: Boolean,

  createdAt: Date,
  updatedAt: Date,
}

enum NotificationTargetType {
  diveCenter
  divePoint
  diveSite
  diving
  instructor
  user
}

union NotificationTarget = DiveCenter | DivePoint | DiveSite | Diving | Instructor | User

enum NotificationEvent {
  onParticipantJoined
  onParticipantAccepted
  onDivingPreparation
  onDivingPublicEnded
  onDivingComplete
  onDivingCreatedInDiveCenter
  onDivingCreatedInDivePoint
  onDivingCreatedInDiveSite
  onDivingCreatedByInstructor
}
`;