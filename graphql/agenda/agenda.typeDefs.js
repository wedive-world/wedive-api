const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________Agendas: Agenda
  getAgendasByTargetId(targetId: ID!, agendaTypes: [ID], skip: Int = 0, limit: Int = 10): [Agenda]
  getUserAgendas(agendaTypes: [ID], skip: Int = 0, limit: Int = 10): [Agenda]
  getAllAgendaTypes: [AgendaType]
}

type Mutation {
  
  MUTATION_________________________Agendas: Agenda
  upsertAgenda(input: AgendaInput): Agenda!
  deleteAgendaById(_id: ID!): Response!
  upsertAgendaType(input: AgendaTypeInput): AgendaType!
  deleteAgendaTypeById(_id: ID!): Response!
}

type Agenda {
  _id: ID!
  types: [AgendaType]
  author: User!
  languageCode: String

  title: String
  content: String
  agendaPlaces: [AgendaPlace]
  hashTags: [HashTag]

  reviewCount: Int

  createdAt: Date
  updatedAt: Date
}

input AgendaInput {
  _id: ID
  targetId: ID
  types: [ID]

  title: String
  content: String
  agendaPlaces: [ID]
  hashTags: [HashTagInput]
}
 
type AgendaType {
  _id: ID
  name: String
}

input AgendaTypeInput {
  _id: ID
  name: String
}

type HashTag {
  name: String
}

input HashTagInput {
  name: String
}

type Forum {
  agendas: [Agenda]
}

union AgendaPlace = DiveCenter | Diving | DiveSite | DivePoint
`;