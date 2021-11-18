const { gql } = require('apollo-server')

module.exports = gql`

# The implementation for this scalar is provided by the
# 'GraphQLUpload' export from the 'graphql-upload' package
# in the resolver map below.
scalar Upload

type Query {

    getImageUrlById(_id: ID!, width: Int): String @cacheControl(maxAge: 30)
    getImageUrlsByIds(_ids: [ID], widths: [Int]): [String] @cacheControl(maxAge: 30)

    getResizedImageById(_id: ID!, width: Int): ResizedImage @cacheControl(maxAge: 30)
    getResizedImagesByIds(_ids: [ID], widths: [Int]): [ResizedImage] @cacheControl(maxAge: 30)
}

type Mutation {

    uploadImage(file: Upload!): Image!
    updateImage(input: UpdateImageInput!): Image!
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
    images: [Image]
    backgroundImages: [Image]
}

input DiveSiteInput {
    images: [ID]
    backgroundImages: [ID]
}

type DivePoint {
    images: [Image]
    backgroundImages: [Image]
}

input DivePointInput {
    images: [ID]
    backgroundImages: [ID]
}

type DiveCenter {
    images: [Image]
    backgroundImages: [Image]
}

input DiveCenterInput {
    images: [ID]
    backgroundImages: [ID]
}

type Highlight {
    images: [Image]
}

input HighlightInput {
    images: [ID]
}

type Interest {
    images: [Image]
    backgroundImages: [Image]
}

input InterestInput {
    images: [ID]
    backgroundImages: [ID]
}

type Product {
    images: [Image]
    backgroundImages: [Image]
}

input ProductInput {
    images: [ID]
    backgroundImages: [ID]
}
`;