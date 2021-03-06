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

type DiveShop implements Introduction {
    ${fields}
}

input DiveShopInput {
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

type Product implements Introduction {
    ${fields}
}

input ProductInput {
    name: String
    uniqueName: String
    description: String
    youtubeVideoIds: [String]
    referenceUrls: [String]
    memo: String
}
`