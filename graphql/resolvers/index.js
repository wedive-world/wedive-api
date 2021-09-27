const userResolvers = require('./user-resolver')
const interestResolvers = require('./interest-resolver')
const imageResolvers = require('./image-resolver')
const diveSiteResolvers = require('./dive-site-resolver')
const divePointResolvers = require('./dive-point-resolver')

const resolvers = {
    ...userResolvers,
    ...interestResolvers,
    ...diveSiteResolvers,
    ...divePointResolvers,

    Upload: imageResolvers.Upload,

    Query: {
        ...userResolvers.Query,
        ...interestResolvers.Query,
        ...imageResolvers.Query,
        ...diveSiteResolvers.Query,
        ...divePointResolvers.Query,
    },

    Mutation: {
        ...userResolvers.Mutation,
        ...interestResolvers.Mutation,
        ...imageResolvers.Mutation,
        ...diveSiteResolvers.Mutation,
        ...divePointResolvers.Mutation,
    }
}

module.exports = resolvers;