const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________Agendas: Agenda
  getAgendasByTargetId(targetId: ID!, skip: Int = 0, limit: Int = 10): [Agenda]
}

type Mutation {
  
  MUTATION_________________________Agendas: Agenda
  upsertAgenda(input: AgendaInput): Agenda!
  deleteAgendaById(_id: ID!): Response!
}

type Agenda {
  _id: ID!
  type: AgendaType
  author: User!
  languageCode: String

  title: String
  content: String

  reviewCount: Int

  createdAt: Date
  updatedAt: Date
}

input AgendaInput {
  _id: ID
  targetId: ID
  type: AgendaType

  title: String
  content: String
  rating: Int
}

enum AgendaType {
  agenda
  question
}

type Forum {
  agendas: [Agenda]
}
`;