const { gql } = require('apollo-server')

module.exports = gql`

type Query {
  QUERY_________________________Report: Report
  getReportCodes: [[String]]
}

type Mutation {
  MUTATION_________________________Report: Report
  createReport(input: ReportInput): Response
}

type Report {
  userId: ID
  targetId: ID!
  reportCode: Int!
  reportReason: String
  createdAt: Date
  updatedAt: Date
}

input ReportInput {
  targetId: ID!
  reportCode: Int!
  reportReason: String
}

interface Reportable {
  reportCount: Int
}

type Diving implements Reportable {
  reportCount: Int
}

type Agenda implements Reportable {
  reportCount: Int
}

type User implements Reportable {
  reportCount: Int
}

type Community implements Reportable {
  reportCount: Int
}

type Instructor implements Reportable {
  reportCount: Int
}

type Review implements Reportable {
  reportCount: Int
}
`;