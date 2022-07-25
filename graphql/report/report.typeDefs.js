const { gql } = require('apollo-server')

module.exports = gql`

type Query {
  QUERY_________________________Report: Response
  getReportCodes: [[String]]
}

type Mutation {
  MUTATION_________________________Report: Response
  report(targetId: ID!, reason: String!): Response
}

interface Reportable {
  reportCount: Int
  isblocked: Boolean
}

type Diving implements Reportable {
  reportCount: Int
  isblocked: Boolean
}

type Agenda implements Reportable {
  reportCount: Int
  isblocked: Boolean
}

type User implements Reportable {
  reportCount: Int
  isblocked: Boolean
}

type Community implements Reportable {
  reportCount: Int
  isblocked: Boolean
}

type Instructor implements Reportable {
  reportCount: Int
  isblocked: Boolean
}

type Review implements Reportable {
  reportCount: Int
  isblocked: Boolean
}
`;