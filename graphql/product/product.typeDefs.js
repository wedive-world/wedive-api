const { gql } = require('apollo-server')

module.exports = gql`

type Query {

  QUERY____________________________Products: Product
  getAllProducts: [Product]
  getProductById(_id: ID!): Product
  getProductsByIds(_ids: [ID]): [Product]
}

type Mutation {

  MUTATION_________________________Products: Product
  upsertProduct(input: ProductInput): Product!
  deleteProductById(_id: ID!): ID!
}

type Product {
  _id: ID!

  options: [Product]

  price: Int
  discountPercent: Int
  type: [ProductType]

  amount: Int
  unitName: String

  hours: Int
  days: Int

  courseInformations: [Image]

  briefIcon: Image
  preCaution: String
  cautions: [String]

  description: String
  divingTypes: [DivingType]
  availableTime: [String]
  availableAnnualPeriod: [String]
  availableDayType: [DayType]
  cancelPenalty: [String]

  createdAt: Date
  updatedAt: Date
}

input ProductInput {
  _id: ID

  options: [ID]

  price: Int
  type: [ProductType]

  amount: Int
  unitName: String

  hours: Int
  days: Int

  courseInformations: [ID]

  briefIcon: ID
  preCaution: String
  cautions: [String]

  description: String
  divingTypes: [DivingType]
  availableTime: [String]
  availableAnnualPeriod: [String]
  availableDayType: [DayType]
  cancelPenalty: [String]
}

type DiveCenter {
  tickets: [Product]
  educations: [Product]
  courses: [Product]
  rentals: [Product]
}

input DiveCenterInput {
  tickets: [ID]
  educations: [ID]
  courses: [ID]
  rentals: [ID]
}

enum ProductType {
  education
  fun
  experience
  course
  rental
  ticket
  discount
}
`;