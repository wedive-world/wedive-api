const userResolvers = require('./user-resolver')

const resolvers = {
    Query: {
        ...userResolvers.Query
    }
}

module.exports = resolvers;