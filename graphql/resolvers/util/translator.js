const properties = ['name', 'description', 'address', 'title']

module.exports.translateIn = (originalObject, inputObject, countryCode) => {
    properties.forEach(property => {
        const translationKey = property + 'Translation'
        if (!originalObject.hasOwnProperty(translationKey)) {
            divePoint[translationKey] = new Map()
        }

        originalObject[translationKey].set(countryCode, inputObject[property])
    });

    return originalObject
}

module.exports.translateOut = (object, countryCode) => {
    properties
        .filter(property => object.hasOwnProperty(property))
        .forEach(property => {
            object[property] = object[property + 'Translation'][countryCode]
        });
    return object
}