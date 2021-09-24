const userResolvers = require('./user-resolver')
const interestResolvers = require('./interest-resolver')
const imageResolvers = require('./image-resolver')
const resolvers = {
    ...userResolvers,
    ...interestResolvers,

    Upload: imageResolvers.Upload,

    Query: {
        ...userResolvers.Query,
        ...interestResolvers.Query,
    },

    Mutation: {
        ...userResolvers.Mutation,
        ...interestResolvers.Mutation,
        ...imageResolvers.Mutation,
    }
}

module.exports = resolvers;