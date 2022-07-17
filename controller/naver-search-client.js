const axios = require('axios').default

require('dotenv').config({ path: process.env.PWD + '/wedive-secret/naver-api-secret.env' })

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET

module.exports.queryNaverPlace = async (query) => {
    const queryParams = {
        query: query
    }
    const url = `https://openapi.naver.com/v1/search/local.json?${require('querystring').stringify(queryParams)}`
    const headers = {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET
    }

    const { status, statusText, data } = await axios.get(url, { headers: headers })
    console.log(`url=${url} \nstatus=${status} statusText=${statusText} data=${JSON.stringify(data, null, 2)}`)

    if (status != '200') {
        console.log(`naver-search-client | queryNaverPlace: ${statusText}`)
        return null
    }

    return data
}