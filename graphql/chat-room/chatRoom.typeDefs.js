const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________ChatRoom: ChatRoom
  getChatRooms: [ChatRoom]
  getChatRoomsJoinedByCurrentUser: [ChatRoom]
}

type Mutation {
  
  MUTATION_________________________ChatRoom: ChatRoom
  upsertChatRoom(input: ChatRoomInput): ChatRoom!
}

type ChatRoom {
  _id: ID!

  title: String
  latestChat: String
  users: [User]

  divingInfo : Diving

  createdAt: Date
  updatedAt: Date
}

input ChatRoomInput {
  _id: ID
  
  title: String
  latestChat: String
  users: [ID]
}
`;