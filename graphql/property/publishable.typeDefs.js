const { gql } = require('apollo-server')

const fields = `
    publishStatus: PublishStatus
`

const inputFields = `
    publishStatus: PublishStatus
`

module.exports = gql`

interface Publishable {
    ${fields}
}

enum PublishStatus {
    pending
    active
    inactive
    deleted
}

type DiveCenter implements Publishable {
    ${fields}
}

input DiveCenterInput {
    ${inputFields}
}

type DiveSite implements Publishable {
    ${fields}
}

input DiveSiteInput {
    ${inputFields}
}

type DivePoint implements Publishable {
    ${fields}
}

input DivePointInput {
    ${inputFields}
}

`