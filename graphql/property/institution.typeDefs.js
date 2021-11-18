const { gql } = require('apollo-server')

module.exports = gql`

enum InstitutionType {
    AIDA
    CMAS
    PADI
    SSI
    AA
    KF
    UTA
    RAID
    SNSI
    MOLCHANOVA
    AFIA
}

type DiveCenter {
    institutionTypes: [InstitutionType]
}

input DiveCenterInput {
    institutionTypes: [InstitutionType]
}

`