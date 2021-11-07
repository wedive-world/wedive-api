const { gql } = require('apollo-server')

const fields = `
    name: String
    uniqueName: String
    description: String
    youtubeVideoIds: [String]
    referenceUrls: [String]
    memo: String
`

const inputFields = `
    name: String
    uniqueName: String
    description: String
    youtubeVideoIds: [String]
    referenceUrls: [String]
    memo: String
`

module.exports = gql`

interface Introduction {
    ${fields}
}

type DiveCenter implements Introduction {
    ${fields}
}

input DiveCenterInput {
    ${inputFields}
}

type DiveSite implements Introduction {
    ${fields}
}

input DiveSiteInput {
    ${inputFields}
}

type DivePoint implements Introduction {
    ${fields}
}

input DivePointInput {
    ${inputFields}
}

type Interest implements Introduction {
    ${fields}
}

input InterestInput {
    ${inputFields}
}
`