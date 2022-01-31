const { gql } = require('apollo-server')

const fields = `
    _id: ID
    name: String
    description: String
    highlightDescription: String
    images: [Image]
    address: String
    latitude: Float
    longitude: Float
    adminScore: Int
    countryCode: String
`

const inputFields = `
    name: String
    images: [ID]
    address: String
    latitude: Float
    longitude: Float
    adminScore: Int
    countryCode: String
`

module.exports = gql`

interface Place {
    ${fields}
}

type DiveCenter implements Place {
    ${fields}
}

input DiveCenterInput {
    ${inputFields}
}

type DiveSite implements Place {
    ${fields}
}

input DiveSiteInput {
    ${inputFields}
}

type DivePoint implements Place {
    ${fields}
}

input DivePointInput {
    ${inputFields}
}

`