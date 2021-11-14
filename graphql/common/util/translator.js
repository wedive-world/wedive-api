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
        .forEach(property => {
            object[property + 'String'] = object[property].reduce((prev, next) => `${prev},${next}`)
        })

    return object
}

module.exports.translateIn = (originalObject, inputObject, languageCode) => {

    inputObject = onInputPreProcess(inputObject)
    console.log(`onInputPreProcess: inputObject=${JSON.stringify(inputObject)}`)

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

    console.log(`translateOut: << type=${typeof object} object=${JSON.stringify(object)}, languageCode = ${languageCode}`)

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

    console.log(`translateOut: >> object=${JSON.stringify(object)}, languageCode = ${languageCode}`)

    return object
}