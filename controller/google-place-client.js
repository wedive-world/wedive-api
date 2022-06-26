const axios = require('axios').default

require('dotenv').config({ path: process.env.PWD + '/wedive-secret/google-place-secret.env' })

const API_KEY = process.env.GOOGLE_PLACE_API

console.log(`============ENV_LIST of admin-resolver.js============`)
console.log(`pwd=${process.env.PWD}`)
console.log(`API_KEY=${API_KEY}`)
console.log(`=====================================================`)

const {
    DiveShop
} = require('../model/index').schema

const sleep = (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

module.exports.queryDiveResortByLocation = async (lat, lng, query) => {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
        // `fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry%2Cformatted_phone_number` +
        `query=${encodeURI(query)}&region=ko&location=${encodeURI(`${lat},${lng}`)}&radius=10000&key=${API_KEY}`

    const { status, statusText, data } = await axios.get(url, {
        headers: {
            'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4'
        }
    })

    if (data.status != 'OK') {
        console.log(`google-place-client | searchDiveResort: failed!`)
        return null
    }

    let dataSize = 0
    dataSize += data.results.length

    for (let placeResult of data.results) {
        let placeDetail = await queryPlaceDetailByPlaceId(placeResult.place_id)
        await upsertDiveShop(placeDetail)
        // console.log(`google-place-client | searchDiveResort: placeDetail=${JSON.stringify(placeDetail, null, 2)}`)
    }

    let pageToken = data.next_page_token
    while (pageToken) {
        await sleep(1000)

        const nextPageUrl = `${url}&pagetoken=${encodeURI(pageToken)}`
        const { status, statusText, data } = await axios.get((nextPageUrl))
        console.log(`google-place-client | searchDiveResort: statusText=${statusText} data=${JSON.stringify(data)}`)
        if (data.status == 'INVALID_REQUEST') {
            await sleep(1000)
            continue
        }

        for (let placeResult of data.results) {
            let placeDetail = await queryPlaceDetailByPlaceId(placeResult.place_id)
            await upsertDiveShop(placeDetail)
            // console.log(`google-place-client | searchDiveResort: placeDetail=${JSON.stringify(placeDetail, 2, null)}`)
        }

        dataSize += data.results.length
        pageToken = data.next_page_token
    }

    console.log(`google-place-client | searchDiveResort: result=${JSON.stringify(dataSize)}`)

    return dataSize
}

async function upsertDiveShop(placeDetail) {
    const diveShop = {
        uniqueName: placeDetail.place_id,
        placeProvider: 'google',
        placeProviderId: placeDetail.place_id,
        placeRating: placeDetail.rating,
        placeTypes: placeDetail.types,
        placeRatingsTotal: placeDetail.user_ratings_total,
        placeName: placeDetail.name,
        placeBusinessStatus: placeDetail.business_status,
        placeAddress: placeDetail.formatted_address,
        placePhoneNumber: placeDetail.formatted_phone_number,
        placeWebSite: placeDetail.website,
        latitude: placeDetail.geometry && placeDetail.geometry.location ? placeDetail.geometry.location.lat : null,
        longitude: placeDetail.geometry && placeDetail.geometry.location ? placeDetail.geometry.location.lng : null,
        location: placeDetail.geometry && placeDetail.geometry.location ? {
            type: 'Point',
            coordinates: [placeDetail.geometry.location.lng, placeDetail.geometry.location.lat]
        } : null,
        placeOpeningHours: placeDetail.opening_hours ? placeDetail.opening_hours.weekday_text : null
    }

    // console.log(JSON.stringify(diveShop, null, 2))

    let result = await DiveShop.findOneAndUpdate(
        { placeProviderId: diveShop.placeProviderId },
        diveShop,
        { upsert: true }
    )
    // console.log(`result=${result}`)

    // if (placeDetail.photos && placeDetail.photos.length > 0) {
    //     console.log(`start fetch photo!`)
    //     for (let photo of placeDetail.photos) {
    //         await fetchPhoto(photo.photo_reference)
    //     }
    // }
}

async function queryPlaceDetailByPlaceId(placeId) {

    console.log(`google-place-client | searchDiveResort: ${placeId}`)

    const url = `https://maps.googleapis.com/maps/api/place/details/json?` +
        `fields=name%2Cgeometry%2Ctypes%2Cformatted_phone_number%2Copening_hours%2Cprice_level%2Cwebsite%2Cformatted_address%2Crating%2Cuser_ratings_total%2Cbusiness_status%2Cplace_id%2Cphotos&` +
        `place_id=${placeId}&` +
        `key=${API_KEY}`

    const { status, statusText, data } = await axios.get(url, {
        headers: {
            'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4'
        }
    })
    // console.log(JSON.stringify(data, null, 2))

    return data.result
}

async function fetchPhoto(photoReference) {
    const url = `https://maps.googleapis.com/maps/api/place/photo` +
        `?maxwidth=640` +
        `&photo_reference=${photoReference}` +
        `&key=${API_KEY}`

    const { status, statusText, data } = await axios.get(url, {
        headers: {
            'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4'
        }
    })

    // console.log(`fetchPhoto: url=${url}`)
}