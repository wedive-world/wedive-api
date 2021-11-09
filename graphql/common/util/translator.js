const properties = [
    'name', 'description', 'address', 'title',
    'visitTimeDescription', 'waterTemperatureDescription', 'deepDescription', 'waterFlowDescription', 'eyeSightDescription', 'highlightDescription',
]

module.exports.translateIn = (originalObject, inputObject, languageCode) => {
    properties.forEach(property => {
        const translationKey = property + 'Translation'
        if (!originalObject.hasOwnProperty(translationKey)) {
            originalObject[translationKey] = new Map()
        }

        originalObject[translationKey].set(languageCode, inputObject[property])
    });

    return originalObject
}

module.exports.translateOut = (object, languageCode) => {

    console.log("--------before--------");
    console.log(object);
    console.log("----------------");

    properties
        .filter(property => object.hasOwnProperty(property) && object.hasOwnProperty(property + 'Translation'))
        .forEach(property => {
            try {
                const translationKey = property + 'Translation'
                object[property] = object[translationKey][languageCode]
            } catch (err) {
                console.log(`translator | translateOut: ${property} cannot be translated into ${languageCode}`)
                console.log(`translator | object: ${JSON.stringify(object)}`)
                console.log(`${err}`)
            }
        });

    console.log("--------after--------");
    console.log(object);
    console.log("----------------");
    return object
}