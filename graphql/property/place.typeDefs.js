const { gql } = require('apollo-server')

const fields = `
    address: String
    latitude: Float
    longitude: Float
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
    ${fields}
}

type DiveSite implements Place {
    ${fields}
}

input DiveSiteInput {
    ${fields}
}

type DivePoint implements Place {
    ${fields}
}

input DivePointInput {
    ${fields}
}

`