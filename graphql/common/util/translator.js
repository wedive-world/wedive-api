const properties = [
    'name', 'description', 'address', 'title',
    'visitTimeDescription', 'waterTemperatureDescription', 'deepDescription', 'waterFlowDescription', 'eyeSightDescription', 'highlightDescription',
]

module.exports.translateIn = (originalObject, inputObject, countryCode) => {
    properties.forEach(property => {
        const translationKey = property + 'Translation'
        if (!originalObject.hasOwnProperty(translationKey)) {
            originalObject[translationKey] = new Map()
        }

        originalObject[translationKey].set(countryCode, inputObject[property])
    });

    return originalObject
}

module.exports.translateOut = (object, countryCode) => {
    properties
        .filter(property => object.hasOwnProperty(property))
        .forEach(property => {
            try {
                const translationKey = property + 'Translation'
                object[property] = object[translationKey][countryCode]
            } catch (err) {
                console.log(`translator | translateOut: ${property} cannot be translated into ${countryCode}`)
                console.log(`translator | object: ${JSON.stringify(object)}`)
                console.log(`${err}`)
            }
        });
    return object
}