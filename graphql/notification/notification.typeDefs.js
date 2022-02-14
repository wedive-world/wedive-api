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
  event: String,
  targetType: NotificationTargetType,
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
}
`;