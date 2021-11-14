module.exports.updateObject = async (source, destination) => {

    console.log(`updateObject: source=${JSON.stringify(source)}, destination=${destination}`)

    Object.keys(source)
        .filter(key => source[key] && typeof destination[key] == typeof source[key])
        .forEach(key => destination[key] = source[key])

    console.log(`updateObject: destination=${destination}`)
}