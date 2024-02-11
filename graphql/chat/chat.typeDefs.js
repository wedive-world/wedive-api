const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________Chats: Chat
  getChatsByChatRoomId(chatRoomId: ID!, skip: Int = 0, limit: Int = 10): [Chat]
  getChatById(_id: ID!): Chat
  searchChat(query: String, skip: Int = 0, limit: Int = 10): [Chat]
  getRecentChatByChatroom(skip: Int = 0, limit: Int = 10): [Chat]
}

type Mutation {
  
  MUTATION_________________________Chats: Chat
  upsertChat(input: ChatInput): Chat!
  deleteChatById(_id: ID!): Response!
}

type Chat {
  _id: ID!
  chatParent: ChatParent

  author: ID
  content: String
  reads: [ID]

  createdAt: Date
  updatedAt: Date
}

input ChatInput {
  _id: ID
  chatRoomId: ID
  content: String
}

type ChatRoom {
  chats: [Chat]
}

union ChatParent = ChatRoom
`;