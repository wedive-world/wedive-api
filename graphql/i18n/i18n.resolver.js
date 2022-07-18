module.exports = {

    // interface i18nName {name: String}
    // interface i18nDescription {description: String}
    // interface i18nAddress {address: String}
    // interface i18nTitle {title: String}
    // interface i18nVisitTimeDescription {visitTimeDescription: String}
    // interface i18nWaterTemperatureDescription {waterTemperatureDescription: String}
    // interface i18nDeepDescription {deepDescription: String}
    // interface i18nWaterFlowDescription {waterFlowDescription: String}
    // interface i18nEyeSightDescription {eyeSightDescription: String}
    // interface i18nHighlightDescription {highlightDescription: String}
    // interface i18nAliasesString {aliasesString: String}
    // interface i18nSearchTermsString { searchTermsString: String }
    // interface i18nUnitName { unitName: String }

    i18nName: {
        name: (parent, args, context, info) => {
            console.log(`!!!`)
            return getTranslation(parent, context.languageCode, 'name')
        },
    },
}

function getTranslation(parent, languageCode, fieldName) {
    console.log(`languageCode=${languageCode} fieldName=${fieldName}`)
    const originalValue = parent[fieldName]
    if (!languageCode) {
        return originalValue
    }
    const translatedField = filedName + 'Translation'

    if (!parent[translatedField]) {
        return originalValue
    }

    const translatedValue = parent[translatedField][languageCode]
    if (!translatedValue) {
        return originalValue
    }

    return translatedValue
}