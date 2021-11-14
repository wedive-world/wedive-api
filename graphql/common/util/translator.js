const translatableProperties = [
    'name', 'description', 'address', 'title',
    'visitTimeDescription', 'waterTemperatureDescription', 'deepDescription', 'waterFlowDescription', 'eyeSightDescription', 'highlightDescription',
    'aliasesString', 'searchTermsString',
]

const stringifiableProperties = [
    'aliases', 'searchTerms'
]

function onInputPreProcess(object) {
    stringifiableProperties.filter(property => object.hasOwnProperty(property))
        .filter(property => object[property] && object[property].length > 0)
        .forEach(property => {
            object[property + 'String'] = object[property].reduce((prev, next) => `${prev},${next}`)
        })

    return object
}

module.exports.translateIn = (originalObject, inputObject, languageCode) => {

    inputObject = onInputPreProcess(inputObject)

    translatableProperties
        .filter(property => inputObject.hasOwnProperty(property))
        .forEach(property => {
            const translationKey = property + 'Translation'
            if (!originalObject.hasOwnProperty(translationKey)) {
                originalObject[translationKey] = new Map()
            }

            originalObject[translationKey].set(languageCode, inputObject[property])
        });

    return originalObject
}

module.exports.translateOut = (object, languageCode) => {

    translatableProperties
        .filter(property => object.hasOwnProperty(property + 'Translation'))
        .forEach(property => {
            try {
                const translationKey = property + 'Translation'
                object[property] = object[translationKey][languageCode]
            } catch (err) {
                console.log(`translator | translateOut: ${property} cannot be translated into ${languageCode} `)
                console.log(`translator | object: ${JSON.stringify(object)} `)
                console.log(`${err} `)
            }
        });

    return object
}