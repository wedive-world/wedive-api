const { gql } = require('apollo-server')

module.exports = gql`

# The implementation for this scalar is provided by the
# 'GraphQLUpload' export from the 'graphql-upload' package
# in the resolver map below.
scalar Upload

type Query {

    QUERY____________________________Images: Image
    getImageUrlById(_id: ID!, width: Int): String @cacheControl(maxAge: 600)
    getImageUrlsByIds(_ids: [ID], widths: [Int]): [String] @cacheControl(maxAge: 600)

    getResizedImageById(_id: ID!, width: Int = 640): ResizedImage @cacheControl(maxAge: 600)
    getResizedImagesByIds(_ids: [ID], widths: [Int]): [ResizedImage] @cacheControl(maxAge: 600)
}

type Mutation {

    MUTATION_________________________Images: Image
    uploadImage(file: Upload!): Image!
    updateImage(input: UpdateImageInput!): Image!
    updateThmbnailForAllImages: Response
}

type Image {
    
    _id: ID

    name: String
    description: String
    reference: String,
    uploaderId: String,

    mimeType: String
    encoding: String
    fileSize: Int

    thumbnailUrl: String

    createdAt: Date,
    updatedAt: Date,
}

input UpdateImageInput {
    _id: ID!
    name: String
    description: String
    reference: String
    uploaderId: String
}

type ResizedImage {
    _id: ID

    name: String
    description: String
    reference: String,
    uploaderId: String,

    url: String
}

type DiveSite {
    images: [Image] @cacheControl(maxAge: 60)
    backgroundImages: [Image] @cacheControl(maxAge: 60)
}

input DiveSiteInput {
    images: [ID]
    backgroundImages: [ID]
}

type DivePoint {
    images: [Image] @cacheControl(maxAge: 60)
    backgroundImages: [Image] @cacheControl(maxAge: 60)
}

input DivePointInput {
    images: [ID]
    backgroundImages: [ID]
}

type DiveCenter {
    images: [Image] @cacheControl(maxAge: 60)
    backgroundImages: [Image] @cacheControl(maxAge: 60)
}

input DiveCenterInput {
    images: [ID]
    backgroundImages: [ID]
}

type DiveShop {
    images: [Image] @cacheControl(maxAge: 60)
    backgroundImages: [Image] @cacheControl(maxAge: 60)
}

input DiveShopInput {
    images: [ID]
    backgroundImages: [ID]
}

type Highlight {
    images: [Image] @cacheControl(maxAge: 60)
}

input HighlightInput {
    images: [ID]
}

type Interest {
    images: [Image] @cacheControl(maxAge: 60)
    backgroundImages: [Image] @cacheControl(maxAge: 60)
}

input InterestInput {
    images: [ID]
    backgroundImages: [ID]
}

type Product {
    images: [Image] @cacheControl(maxAge: 60)
    backgroundImages: [Image] @cacheControl(maxAge: 60)
}

input ProductInput {
    images: [ID]
    backgroundImages: [ID]
}

type User {
    instructorLicenseImages: [Image]
}

type Diving {
    images: [Image] @cacheControl(maxAge: 60)
}

input DivingInput {
    images: [ID]
}

type Review {
    images: [Image]
}

input ReviewInput {
    images: [ID]
}

type Recommendation {
    images: [Image]
    backgroundImages: [Image]
}

input RecommendationInput {
    images: [ID]
    backgroundImages: [ID]
}

type Agenda {
    images: [Image]
}

input AgendaInput {
    images: [ID]
}

type Community {
    images: [Image]
}

input CommunityInput {
    images: [ID]
}

`;