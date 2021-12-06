const { gql } = require('apollo-server')

module.exports = gql`

enum InstitutionType {
    PADI
    NAUI
    DAN
    RAID
    AFIA
    AIDA
    CMAS
    MOLCHANOVS
    SNSI
    SSI
    UTA
    ACUC
    BDSG
    BHA
    BSAC
    DDRC
    GADAP
    IANTD
    IDA
    IDEST
    IRISH
    LIFEBOATS
    NOB
    SAA
    SDI
    SITA
    SSAC
    TDI
    UKDMC
    NDL
    KUDA
    NASE
    YMCA
    AA
    KF
    UTR
    PSAI
    PSS
    NASDS
    IDEA_WDA
    IDDA 
    IAC 
    VIT 
    PDIC
    DDI
    RSTC
    IAHD
    MDEA
    ANDI
    GUE
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
    DAN
    RAID
    AFIA
    AIDA
    CMAS
    MOLCHANOVS
    SNSI
    SSI
    UTA
    ACUC
    BDSG
    BHA
    BSAC
    DDRC
    GADAP
    IANTD
    IDA
    IDEST
    IRISH
    LIFEBOATS
    NOB
    SAA
    SDI
    SITA
    SSAC
    TDI
    UKDMC
    NDL
    KUDA
    NASE
    YMCA
    AA
    KF
    UTR
    PSAI
    PSS
    NASDS
    IDEA_WDA
    IDDA 
    IAC 
    VIT 
    PDIC
    DDI
    RSTC
    IAHD
    MDEA
    ANDI
    GUE
    SEI
}

enum FreeLicenseType {
    PADI
    NAUI
    DAN
    RAID
    AFIA
    AIDA
    CMAS
    MOLCHANOVS
    SNSI
    SSI
    UTA
    ACUC
    BDSG
    BHA
    BSAC
    DDRC
    GADAP
    IANTD
    IDA
    IDEST
    IRISH
    LIFEBOATS
    NOB
    SAA
    SDI
    SITA
    SSAC
    TDI
    UKDMC
    NDL
    KUDA
    NASE
    YMCA
    AA
    KF
    UTR
    PSAI
    PSS
    NASDS
    IDEA_WDA
    IDDA 
    IAC 
    VIT 
    PDIC
    DDI
    RSTC
    IAHD
    MDEA
    ANDI
    GUE
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