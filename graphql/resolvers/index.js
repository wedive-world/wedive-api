const resolvers = {
    Query: {
        books: () => [
            {
                title: 'Title 1',
                author: 'Author 1'
            },
            {
                title: 'Title 2',
                author: 'Author 2'
            }
        ]
    }
}

module.exports = resolvers;