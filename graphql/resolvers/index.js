const userResolvers = require('./user-resolver')
const diveCenterResolvers = require('./dive-center-resolver')

const resolvers = {
    ...userResolvers,
    ...diveCenterResolvers,

    Query: {
        ...userResolvers.Query,
        ...diveCenterResolvers.Query
    },

    Mutation: {
        ...userResolvers.Mutation,
    }
}

module.exports = resolvers;