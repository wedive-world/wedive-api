const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________ChatRoom: ChatRoom
  getChatRooms: [ChatRoom]
  getHotHashTags(days: Int = 180, limit: Int = 10): [String]
  getHotHashTagsById(chatRoomId: ID!, days: Int = 180, limit: Int = 10): [String]
}

type Mutation {
  
  MUTATION_________________________ChatRoom: ChatRoom
  upsertChatRoom(input: ChatRoomInput): ChatRoom!
}

type ChatRoom {
  _id: ID!

  title: String
  latestChat: String
  users: [ID]

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