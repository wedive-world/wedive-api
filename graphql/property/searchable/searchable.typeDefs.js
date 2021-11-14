const { gql } = require('apollo-server')

const fields = `
    aliases: [String]
    searchTerms: [String]
`

module.exports = gql`

interface Searchable {
    ${fields}
}

type DiveCenter implements Searchable {
    ${fields}
}

input DiveCenterInput {
    ${fields}
}

type DiveSite implements Searchable {
    ${fields}
}

input DiveSiteInput {
    ${fields}
}

type DivePoint implements Searchable {
    ${fields}
}

input DivePointInput {
    ${fields}
}

type Interest implements Searchable {
    ${fields}
}

input InterestInput {
    ${fields}
}

`