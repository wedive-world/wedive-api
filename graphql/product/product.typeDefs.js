const { gql } = require('apollo-server')

module.exports = gql`

type Query {

    getAllProducts: [Product]
    getProductById(_id: ID!): Product
    getProductsByIds(_ids: [ID]): [Product]
}

type Mutation {

    upsertProduct(input: ProductInput): Product!
    deleteProductById(_id: ID!): ID!
}

type Product {
  _id: ID!

  totalPrice: Int
  totalTypes: [ProductType]
  totalHours: Int
  totalDays: Int

  options: [Product]

  price: Int
  type: [ProductType]
  hours: Int
  days: Int

  courseInformations: [Image]

  briefIcon: Image
  cautions: [String]

  createdAt: Date
  updatedAt: Date
}

input ProductInput {
  _id: ID!

  options: [ID]

  price: Int
  type: [ProductType]
  hours: Int
  days: Int

  courseInformations: [ID]

  briefIcon: ID
  cautions: [String]
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
  course
  rental
  meal
  ticket
}


`;