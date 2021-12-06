const { gql } = require('apollo-server')

module.exports = gql`

enum InstitutionType {
    PADI
    NAUI
    BSAC
    CMAS
    SSI
    NDL
    SDI_TDI
    IANTD
    KUDA
    NASE
    YMCA
    AIDA
    AA
    Molchanovs
    RAID
    UTA
    SNSI
    AFIA
    KF
    UTR
    PSS
    NASDS
    IDA_WDA
    IDDA
    IAC
    ACUC
    VIT
    PDIC International
    RSTC
    DDI
    IAHD
    MDEA
    ANDI
    GUE
    PSAI
    SEI
}

type DiveCenter {
    institutionTypes: [InstitutionType]
}

input DiveCenterInput {
    institutionTypes: [InstitutionType]
}

enum ScubaLicenseType {
    PADI
    NAUI
    BSAC
    CMAS
    SSI
    NDL
    SDI_TDI
    IANTD
    KUDA
    NASE
    YMCA
    AIDA
    AA
    Molchanovs
    RAID
    UTA
    SNSI
    AFIA
    KF
    UTR
    PSS
    NASDS
    IDA_WDA
    IDDA
    IAC
    ACUC
    VIT
    PDIC International
    RSTC
    DDI
    IAHD
    MDEA
    ANDI
    GUE
    PSAI
    SEI
}

enum FreeLicenseType {
    PADI
    NAUI
    BSAC
    CMAS
    SSI
    NDL
    SDI_TDI
    IANTD
    KUDA
    NASE
    YMCA
    AIDA
    AA
    Molchanovs
    RAID
    UTA
    SNSI
    AFIA
    KF
    UTR
    PSS
    NASDS
    IDA_WDA
    IDDA
    IAC
    ACUC
    VIT
    PDIC International
    RSTC
    DDI
    IAHD
    MDEA
    ANDI
    GUE
    PSAI
    SEI
}

type User {
    scubaLicenseType: ScubaLicenseType
    scubaLicenseLevel: Int
    freeLicenseType: FreeLicenseType
    freeLicenseLevel: Int
}

input UserInput {
    scubaLicenseType: ScubaLicenseType
    scubaLicenseLevel: Int
    freeLicenseType: FreeLicenseType
    freeLicenseLevel: Int
}

`