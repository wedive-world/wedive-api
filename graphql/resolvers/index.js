const userResolvers = require('./user-resolver')
const diveCenterResolvers = require('./dive-center-resolver')
const interestResolvers = require('./interest-resolver')

const resolvers = {
    ...userResolvers,
    ...diveCenterResolvers,
    ...interestResolvers,

    Query: {
        ...userResolvers.Query,
        ...diveCenterResolvers.Query,
        ...interestResolvers.Query,
    },

    Mutation: {
        ...userResolvers.Mutation,
        ...diveCenterResolvers.Mutation,
        ...interestResolvers.Mutation,
    }
}

module.exports = resolvers;