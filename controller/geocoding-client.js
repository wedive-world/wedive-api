const axios = require('axios').default

require('dotenv').config({ path: process.env.PWD + '/wedive-secret/geocoding-secret.env' })

const API_KEY = process.env.GEOCODING_API

console.log(`============ENV_LIST of admin-resolver.js============`)
console.log(`pwd=${process.env.PWD}`)
console.log(`API_KEY=${API_KEY}`)
console.log(`=====================================================`)

module.exports.queryReverseGeocoding = async function (lat, lon, language) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${API_KEY}&language=${language}`
    const { status, statusText, data } = await axios.get(url)
    // console.log(`statusText=${statusText} data=${JSON.stringify(data, null, 2)}`)

    if (data.status != 'OK') {
        console.log(`admin-resolver | queryReverseGeocoding: failed!`)
        return null
    }

    let location = data.results[0].geometry.location
    // console.log(`location=${JSON.stringify(location)}`)

    let countryCode = extractCountryCode(data)
    console.log(`countryCode=${JSON.stringify(countryCode)}`)

    return {
        countryCode: countryCode,
        refinedAddress: extractRefinedAddress(data)
    }
}

module.exports.queryGeocoding = async function (address, language) {
    let queryParams = {
        address: address,
        key: API_KEY,
        language: language
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?${require('querystring').stringify(queryParams)}`
    const { status, statusText, data } = await axios.get(url)
    // console.log(`statusText=${statusText} data=${JSON.stringify(data)}`)

    if (data.status != 'OK') {
        console.log(`admin-resolver | queryGeocoding: ${address}`)
        return null
    }

    let countryCode = extractCountryCode(data)
    // console.log(`countryCode=${JSON.stringify(countryCode)}`)

    return {
        location: data.results[0].geometry.location,
        refinedAddress: extractRefinedAddress(data),
        countryCode: countryCode
    }
}

function extractRefinedAddress(data) {
    let addressComponents = data.results[0].address_components;

    let country = addressComponents
        .find(component => component.types.includes('country'));

    let administrative_area_level_1 = addressComponents
        .find(component => component.types.includes('administrative_area_level_1'));

    let locality = addressComponents
        .find(component => component.types.includes('locality'));

    let sublocality_level_1 = addressComponents
        .find(component => component.types.includes('sublocality_level_1'));

    let refinedAddress = `${country ? country.long_name : ''} ${administrative_area_level_1 ? administrative_area_level_1.long_name : ''}${locality ? ' ' + locality.long_name : ''}${sublocality_level_1 ? ' ' + sublocality_level_1.long_name : ''}`;
    return refinedAddress;
}

function extractCountryCode(data) {
    let addressComponents = data.results[0].address_components;

    let country = addressComponents
        .find(component => component.types.includes('country'));

    // console.log(`country=${JSON.stringify(country)}`)

    if (!country || !country.short_name) {
        return ''
    }

    return country.short_name
}