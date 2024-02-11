const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________Chats: Chat
  getChatsByTargetId(targetId: ID!, skip: Int = 0, limit: Int = 10): [Chat]
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

  content: String
  reads: Int

  createdAt: Date
  updatedAt: Date
}

input ChatInput {
  _id: ID
  targetId: ID
  types: [ID]

  title: String
  latestChat: String
}

type ChatRoom {
  chats: [Chat]
}

union ChatParent = ChatRoom
`;