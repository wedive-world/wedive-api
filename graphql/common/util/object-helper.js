module.exports.updateObject = async (source, destination) => {
    
    Object.keys(source)
        .filter(key => source[key] && typeof destination[key] == typeof source[key])
        .forEach(key => { destination[key] = source[key] })

    return destination
}