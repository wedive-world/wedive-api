const AWS = require('aws-sdk');

require('dotenv').config({ path: process.env.PWD + '/wedive-secret/s3-config.env' })
require('dotenv').config({ path: process.env.PWD + '/wedive-secret/aws-secret.env' })

const END_POINT = process.env.WATER_TEMPERATURE_LOG_BUCKET_END_POINT
const REGION = process.env.WATER_TEMPERATURE_LOG_BUCKET_REGION
const BUCKET_NAME = process.env.WATER_TEMPERATURE_LOG_BUCKET_NAME

console.log(`============ENV_LIST of image-resolver.js============`)
console.log(`pwd=${process.env.PWD}`)
console.log(`REGION=${REGION}`)
console.log(`BUCKET_NAME=${BUCKET_NAME}`)
console.log(`=====================================================`)

const s3 = new AWS.S3({
    region: REGION,
    accesKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const fs = require('fs')

const {
    User,
    Instructor,
    WaterTemperature
} = require('../../model').schema

const axios = require('axios').default
const cheerio = require("cheerio");

const log = console.log

const host = 'https://www.seatemperature.org'

module.exports = {
    Query: {
        async getCurrentUser(parent, args, context, info) {
            return await User.findOne({ uid: context.uid });
        },
    },

    Mutation: {
        async collectWaterTemperature(parent, args, context, info) {

            log(`mutation | collectWaterTemperature: args=${JSON.stringify(args)}`)
            await backupPrevLog()
            let result = await collectWaterTemperature()

            return {
                success: true,
                reason: result
            }
        },
    },

    DiveSite: {
        async waterTemperature(parent, args, context, info) {
            if (!parent.latitude || !parent.longitude) {
                return null
            }

            return await getNearWaterTemperature(parent.latitude, parent.longitude)
        }
    },
    DivePoint: {
        async waterTemperature(parent, args, context, info) {
            if (!parent.latitude || !parent.longitude) {
                return null
            }

            return await getNearWaterTemperature(parent.latitude, parent.longitude)
        }
    },
    DiveCenter: {
        async waterTemperature(parent, args, context, info) {
            if (!parent.latitude || !parent.longitude) {
                return null
            }

            return await getNearWaterTemperature(parent.latitude, parent.longitude)
        }
    },
};

async function getNearWaterTemperature(latitude, longitude) {
    let waterTemperatures = await WaterTemperature.find({
        location: {
            $near: {
                // $maxDistance: 10000,
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                }
            }
        }
    })
        .sort('-createdAt')
        .limit(1)

    if (!waterTemperatures || waterTemperatures.length == 0) {
        return null
    }

    return waterTemperatures[0]
}

async function collectWaterTemperature() {
    let result = ''
    let countryListHtml = await getCountryListHtml()
    let countryList = await extractCountryListFromHtml(countryListHtml)

    for (let country of countryList) {
        try {
            let countryDetailHtml = await getCountryDetailHtml(country.href)
            let cityList = await extractCityListFromHtml(countryDetailHtml)

            for (let city of cityList) {
                let cityHtml = await getCityDetailHtml(city.href)
                let waterTemperature = await extractWaterTemperature(cityHtml)
                waterTemperature.name = city.name

                await WaterTemperature.create(waterTemperature)
            }
        } catch (err) {
            const message = `water-temperature-resolver | collectWaterTemperature: country=${JSON.stringify(country)}, err=${err}`
            console.error(message)
            result += message
        }
    }

    return result
}

async function getCountryListHtml() {
    return await axios.get(`${host}/countries.htm`)
}

async function extractCountryListFromHtml(html) {
    // log(`html.data=${JSON.stringify(html.data)}`)
    const $ = cheerio.load(html.data);
    // const $countryUl = $('div#page div:nth-child(4) div div ul li')
    const $countryUl = $('div#page div.cell div.grid-x.grid-padding-x div#region-list ul li')

    let countryList = []

    $countryUl.each((i, elem) => {

        const name = $(elem).text().replace(" ", "")
        const href = $(elem).children('a').attr('href')
        // log(`html=${JSON.stringify($(elem).html())}`)
        // log(`text=${name}`)
        // log(`text=${href}`)

        countryList.push({
            name: name,
            href: href
        })
    })

    return countryList
}

async function getCountryDetailHtml(href) {
    return await axios.get(`${host}${href}`)
}

async function extractCityListFromHtml(html) {

    const $ = cheerio.load(html.data);
    const cityUl = $('div#page div#main div.acc-panel ul#location-list li')
    let cityList = []

    // log(`cityUl=${cityUl.html()}`)

    cityUl.each((i, elem) => {

        let name = $(elem).text().replace(" ", "")
        let href = $(elem).children('a').attr('href')
        // log(`html=${JSON.stringify($(elem).html())}`)
        // log(`text=${name}`)
        // log(`text=${href}`)

        if (!href) {
            href = $(elem).children('strong').children('a').attr('href')
        }

        cityList.push({
            name: name,
            href: href
        })
    })

    return cityList
}

async function getCityDetailHtml(href) {
    return await axios.get(`${host}${href}`)
}

async function extractWaterTemperature(html) {

    let result = {}

    const $ = cheerio.load(html.data);
    const $report = $('div#page div#main div.block-grid.large-up-2 div#report')
    result.currentSeaTemperature = $report.children('div#sea-temperature').text().replace(/[\r\n\t]+/g, '')

    const $currentWeather = $report.children('div#current-weather')
    result.weatherText = $currentWeather.children('div#weather-text').children('p#weather-current').text().replace(/[\r\n\t]+/g, '')
    result.temperatureC = result.weatherText.split('°C')[0]
    result.temperatureF = result.weatherText.split('/')[1].split('°F')[0].trim()
    result.weatherDescription = result.weatherText.split('(')[1].replace(')', '')
    result.weatherIcon = host + $currentWeather.children('div#weather-icon').children('img').attr('src')
    result.windSpeed = $currentWeather.children('div#wind-speed').children('p').text()
    result.humidity = $currentWeather.children('div#humidity').children('p').text()

    const $waterTemperatureTable = $('div#page div#main div table.striped-table tbody')
    temperatureDetail = {}
    $waterTemperatureTable.children('tr').each((i, tr) => {
        let keyName = null
        $(tr).children('td').each((j, td) => {
            if (j == 0) {
                keyName = $(td).children('strong').text()
                    .replace(' °C', 'C')
                    .replace(' °F', 'F')
                temperatureDetail[keyName] = []
            } else {
                temperatureDetail[keyName].push(Number($(td).text()))
            }
        })
    })

    result.temperatureDetail = temperatureDetail

    const $7tideForecastTable = $('div#page div#main section div table#tide-table')
    if ($7tideForecastTable) {
        let weekTideForecast = {
            daysOfWeek: [],
            tideForecasts: []
        }
        $7tideForecastTable.children('thead').children('tr').each((i, tr) => {
            $(tr).children('th').each((j, th) => {
                weekTideForecast.daysOfWeek.push($(th).text())
            })
        })
        $7tideForecastTable.children('tbody').children('tr').each((i, tr) => {
            $(tr).children('td').each((j, td) => {
                let dayTideForcast = []
                $(td).children('ul').children('li').each((k, li) => {
                    tideForecast = []
                    tideForecast.push($(li).children('strong').children('span').text())
                    tideForecast.push($(li).children('strong').contents().last().text().trim())
                    tideForecast.push($(li).contents().last().text().replace(/[{()}]/g, ''))
                    dayTideForcast.push(tideForecast)
                })
                weekTideForecast.tideForecasts.push(dayTideForcast)
            })
        })
        result.weekTideForecast = weekTideForecast
    }

    const $map = $('#map_block')
    const locationText = $map.text().split('(')[1].split(')')[0]
    result.latitude = Number(locationText.split(',')[0])
    result.longitude = Number(locationText.split(',')[1].trim())
    result.location = {
        type: 'Point',
        coordinates: [result.longitude, result.latitude]
    }

    return result
}

async function backupPrevLog() {

    var date = new Date();
    date.setDate(date.getDate() - 2);

    const searchParam = { createdAt: { $lte: date } }
    const countToBackup = await WaterTemperature.count(searchParam)
    const limit = 5000
    for await (let skip of asyncGenerator(limit, countToBackup)) {
        let waterTemperatures = await WaterTemperature.find(searchParam)
            .sort('createdAt')
            .limit(limit)
            .skip(skip)
            .lean()

        console.log(`${JSON.stringify(waterTemperatures, 0, 2)}`)
        let fileContent = JSON.stringify(waterTemperatures, 0, 2)
        waterTemperatures = null

        const now = new Date()
        const fileName = `water-temperature-log-${now}.log`
        await fs.writeFileSync(fileName, fileContent)
        let content = await fs.readFileSync(fileName)
        console.log(`file created! ${JSON.stringify(content, 0, 2)}`)
        fileContent = null
        // await uploadSingleFile(fileName)
        await fs.rmSync(fileName)
        console.log(`removed!`)
    }
}

async function uploadSingleFile(fileName) {

    var uploadParams = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        ACL: 'private',
        Body: fs.createReadStream(fileName),
    };

    try {
        let result = await s3.putObject(uploadParams).promise()
        console.log(`mutation | uploadSingleFile: result=${JSON.stringify(result.$response.data)}`)

    } catch (err) {
        console.log(`mutation | uploadSingleFile: putObject err=${err}}`)
    }
}

async function* asyncGenerator(limit, count) {
    let skip = 0;
    while (skip <= count) {
        yield skip;
        skip += limit
    }
}