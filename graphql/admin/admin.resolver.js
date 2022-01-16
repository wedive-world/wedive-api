const axios = require('axios').default

const {
    DiveCenter,
    DivePoint,
    DiveSite
} = require('../../model').schema;

require('dotenv').config({ path: process.env.PWD + '/wedive-secret/geocoding-secret.env' })

const API_KEY = process.env.GEOCODING_API

console.log(`============ENV_LIST of admin-resolver.js============`)
console.log(`pwd=${process.env.PWD}`)
console.log(`API_KEY=${API_KEY}`)
console.log(`=====================================================`)

module.exports = {

    Mutation: {
        async updateAddressByLocation(parent, args, context, info) {
            console.log(`mutation | updateAddressByLocation: args=${JSON.stringify(args)}`)
            await queryReverseGeocoding(37.7449082715848, 127.522424288906, context.languageCode)
            return {
                success: true
            }
        },

        async updateDiveCenterLatLngByAddress(parent, args, context, info) {
            console.log(`mutation | updateLatLngByAddress: args=${JSON.stringify(args)}`)

            let diveCenters = await DiveCenter.find()
            let failed = ''
            for (let diveCenter of diveCenters) {
                if (!diveCenter.geoAddress) {
                    failed += diveCenter.name + ' '
                    continue
                }

                let result = await queryGeocoding(diveCenter.geoAddress, context.languageCode)
                let location = result.location
                let refinedAddress = result.refinedAddress
                diveCenter.latitude = location.lat
                diveCenter.longitude = location.lng
                diveCenter.location.type = 'Point'
                diveCenter.location.coordinates = [location.lng, location.lat]
                if (!diveCenter.addressTranslation) {
                    diveCenter.addressTranslation = new Map()
                }
                diveCenter.addressTranslation.set(context.languageCode, refinedAddress)

                try {
                    await diveCenter.save()
                } catch (err) {
                    failed += diveCenter.name + ' '
                    continue
                }
            }

            return {
                success: true,
                reason: failed
            }
        }
    }
};

async function queryReverseGeocoding(lat, lon, language) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${API_KEY}&language=${language}`
    const { status, statusText, data } = await axios.get(url)
    console.log(`statusText=${statusText} data=${JSON.stringify(data)}`)
}

async function queryGeocoding(address, language) {
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

    let location = data.results[0].geometry.location
    // console.log(`location=${JSON.stringify(location)}`)

    let addressComponents = data.results[0].address_components
    let administrative_area_level_1 = addressComponents
        .find(component => component.types.includes('administrative_area_level_1'))

    let locality = addressComponents
        .find(component => component.types.includes('locality'))

    let sublocality_level_1 = addressComponents
        .find(component => component.types.includes('sublocality_level_1'))

    let refinedAddress = `${administrative_area_level_1 ? administrative_area_level_1.long_name : ''}${locality ? ' ' + locality.long_name : ''}${sublocality_level_1 ? ' ' + sublocality_level_1.long_name : ''}`

    console.log(`refinedAddress=${refinedAddress}`)
    return {
        location: location,
        refinedAddress: refinedAddress
    }
}