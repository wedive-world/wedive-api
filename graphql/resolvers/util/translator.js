module.exports.divePointTranslateOut = (divePoint, countryCode) => {

    divePoint.name = divePoint.nameTranslation.get(countryCode)
    divePoint.description = divePoint.descriptionTranslation.get(countryCode)
    divePoint.address = divePoint.addressTranslation.get(countryCode)

    return divePoint
}

module.exports.divePointTranslateIn = (divePoint, input, countryCode) => {

    if (!divePoint.nameTranslation) {
        divePoint.nameTranslation = new Map()
    }

    if (!divePoint.descriptionTranslation) {
        divePoint.descriptionTranslation = new Map()
    }

    if (!divePoint.addressTranslation) {
        divePoint.addressTranslation = new Map()
    }

    divePoint.nameTranslation.set(countryCode, input.name)
    divePoint.descriptionTranslation.set(countryCode, input.description)
    divePoint.addressTranslation.set(countryCode, input.address)

    return divePoint
}

module.exports.diveSiteTranslateOut = (diveSite, countryCode) => {

    diveSite.name = diveSite.nameTranslation.get(countryCode)
    diveSite.description = diveSite.descriptionTranslation.get(countryCode)
    diveSite.address = diveSite.addressTranslation.get(countryCode)

    return diveSite
}

module.exports.diveSiteTranslateIn = (diveSite, input, countryCode) => {

    if (!diveSite.nameTranslation) {
        diveSite.nameTranslation = new Map()
    }

    if (!diveSite.descriptionTranslation) {
        diveSite.descriptionTranslation = new Map()
    }

    if (!diveSite.addressTranslation) {
        diveSite.addressTranslation = new Map()
    }

    diveSite.nameTranslation.set(countryCode, input.name)
    diveSite.descriptionTranslation.set(countryCode, input.description)
    diveSite.addressTranslation.set(countryCode, input.address)

    return diveSite
}

module.exports.interestTranslateOut = (interest, countryCode) => {

    interest.name = interest.titleTranslation.get(countryCode)

    return interest
}