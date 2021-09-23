const userResolvers = require('./user-resolver')
const interestResolvers = require('./interest-resolver')

const resolvers = {
    ...userResolvers,
    ...interestResolvers,

    Query: {
        ...userResolvers.Query,
        ...interestResolvers.Query,
    },

    Mutation: {
        ...userResolvers.Mutation,
        ...interestResolvers.Mutation,
    }
}

module.exports = resolvers;