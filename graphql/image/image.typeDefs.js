const { gql } = require('apollo-server')

module.exports = gql`

    # The implementation for this scalar is provided by the
    # 'GraphQLUpload' export from the 'graphql-upload' package
    # in the resolver map below.
    scalar Upload

    type Query {

        getImageUrlById(_id: ID!, width: Int): String
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

`;