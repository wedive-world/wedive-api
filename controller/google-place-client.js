const axios = require('axios').default

require('dotenv').config({ path: process.env.PWD + '/wedive-secret/google-place-secret.env' })

const API_KEY = process.env.GOOGLE_PLACE_API

console.log(`============ENV_LIST of admin-resolver.js============`)
console.log(`pwd=${process.env.PWD}`)
console.log(`API_KEY=${API_KEY}`)
console.log(`=====================================================`)

module.exports.searchDiveResort = async () => {
        
}

this.searchDiveResort()

const sleep = (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

module.exports.queryDiveResortByLocation = async (lat, lng) => {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&query=${encodeURI('다이브 리조트')}&region=ko&location=${encodeURI(`${lat},${lng}`)}&radius=10000&key=${API_KEY}`

    const { status, statusText, data } = await axios.get((url))
    console.log(`statusText=${statusText} data=${JSON.stringify(data)}`)

    if (data.status != 'OK') {
        console.log(`google-place-client | searchDiveResort: failed!`)
        return null
    }

    let dataSize = 0
    dataSize += data.results.length

    let pageToken = data.next_page_token
    while (pageToken) {
        await sleep(1000)

        const nextPageUrl = `${url}&pagetoken=${encodeURI(pageToken)}`
        const { status, statusText, data } = await axios.get((nextPageUrl))
        console.log(`statusText=${statusText} data=${JSON.stringify(data)}`)
        if (data.status == 'INVALID_REQUEST') {
            await sleep(1000)
            continue
        }

        dataSize += data.results.length
        pageToken = data.next_page_token
    }

    console.log(`google-place-client | searchDiveResort: result=${JSON.stringify(dataSize)}`)

    return dataSize
}