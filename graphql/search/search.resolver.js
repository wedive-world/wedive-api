const {
    DiveSite,
    DivePoint,
    DiveCenter,
    DiveShop,
    Diving,
    Interest
} = require('../../model').schema

const translator = require('../common/util/translator')

module.exports = {
    Place: {
        __resolveType(place, context, info) {
            if (place.typeDef) {
                return place.typeDef
            } else if (place.diveSiteId) {
                return 'DivePoint'
            } else if (place.webPageUrl || place.email || place.phoneNumber || place.educationScore) {
                return 'DiveCenter'
            } else {
                return 'DiveSite'
            }
        }
    },

    Query: {
        async searchPlaces(parent, args, context, info) {
            console.log(`query | searchPlaces: args=${JSON.stringify(args)}`)
            let limit = args.limit
            let searchParams = args.searchParams

            let places = await searchPlaces(searchParams, limit, false)
            return places.map(place => translator.translateOut(place, context.languageCode))
        },

        async searchDivings(parent, args, context, info) {
            console.log(`query | searchDivings: args=${JSON.stringify(args)}`)
            let limit = args.limit
            let searchParams = args.searchParams

            let queryMongooseParam = createMongooseParamsByQuery(searchParams)
            let querySearchResult = await Diving.find(queryMongooseParam)
                .lean()
            // console.log(`query | searchDivings: querySearchResult=${JSON.stringify(querySearchResult, null, 2)}`)

            let interestSearchParams = await createMongooseParamsByInterest(searchParams)
            let interestSearchResult = interestSearchParams
                ? await Diving.find(interestSearchParams)
                    .lean()
                : []
            // console.log(`query | searchDivings: interestSearchResult=${JSON.stringify(interestSearchResult)}`)

            let placeIds = await searchPlaces(searchParams, limit, true)
            let placeSearchParams = createMongooseParams(searchParams)
            placeSearchParams['$and'].push(
                {
                    $or: [
                        { _id: { $in: placeIds } },
                        { diveSites: { $in: placeIds } },
                        { divePoints: { $in: placeIds } },
                        { diveCenters: { $in: placeIds } }
                    ]
                })
            let placeSearchResult = await Diving.find(placeSearchParams)
                .lean()
            // console.log(`query | searchDivings: placeSearchResult=${JSON.stringify(placeSearchResult, null, 2)}`)
            
            querySearchResult = JSON.parse(JSON.stringify(querySearchResult))
            interestSearchResult = JSON.parse(JSON.stringify(interestSearchResult))
            placeSearchResult = JSON.parse(JSON.stringify(placeSearchResult))

            let resultArray = []
            querySearchResult = querySearchResult.filter(diving => !resultArray.some(saved => diving._id == saved._id))
            resultArray = resultArray.concat(querySearchResult)
            interestSearchResult = querySearchResult.filter(diving => !resultArray.some(saved => diving._id == saved._id))
            resultArray = resultArray.concat(interestSearchResult)
            placeSearchResult = querySearchResult.filter(diving => !resultArray.some(saved => diving._id == saved._id))
            resultArray = resultArray.concat(placeSearchResult)

            // return Array.from(new Set(
            //     querySearchResult
            //         .concat(interestSearchResult)
            //         .concat(placeSearchResult)
            // ))
            return resultArray
        },
    },
}

async function searchPlaces(searchParams, limit, onlyIds) {

    let mongooseParams = createMongooseParamsByQuery(searchParams)
    let querySearchResult = await queryMongoosePlaces(mongooseParams, limit, onlyIds)

    let interestSearchParams = await createMongooseParamsByInterest(searchParams)
    let interestSearchResult = await queryMongoosePlaces(interestSearchParams, limit, onlyIds)

    return Array.from(new Set(
        querySearchResult.concat(interestSearchResult)
    ))
}

async function createMongooseParamsByInterest(searchParams) {

    if (!searchParams.query) {
        return null
    }

    let foundInterest = await Interest.find({ $text: { $search: searchParams.query } })
        .lean()
        .select('_id')
        .distinct('_id')

    if (!foundInterest || foundInterest.length == 0) {
        return null
    }

    // console.log(`search-resolver | createMongooseParamsByInterest: foundInterest=${JSON.stringify(foundInterest)}`)

    let interestSearchParams = createMongooseParams(searchParams)
    interestSearchParams['$and'].push({ interests: { $in: foundInterest } })
    return interestSearchParams
}

function createMongooseParamsByQuery(searchParams) {

    let mongooseParams = createMongooseParams(searchParams)

    if (searchParams && searchParams.query) {
        mongooseParams['$and'].push({ $text: { $search: searchParams.query } })
    }

    return mongooseParams
}

function createMongooseParams(searchParams) {

    let mongooseParams = {}

    if (searchParams) {
        mongooseParams['$and'] = []

        if (searchParams.divingTypes && searchParams.divingTypes.length > 0) {
            mongooseParams['$and'].push({ divingType: { $in: searchParams.divingTypes } })
        }

        if (searchParams.adminScore) {
            mongooseParams['$and'].push({ adminScore: { $gte: searchParams.adminScore } })
        }

        if (searchParams.waterEnvironmentScore) {
            mongooseParams['$and'].push({ waterEnvironmentScore: { $gte: searchParams.waterEnvironmentScore } })
        }

        if (searchParams.eyeSightScore) {
            mongooseParams['$and'].push({ eyeSightScore: { $gte: searchParams.eyeSightScore } })
        }

        if (searchParams.lat1 && searchParams.lng1 && searchParams.lat2 && searchParams.lng2) {
            mongooseParams['$and'].push({
                $and: [
                    { latitude: { $gte: Math.min(searchParams.lat1, searchParams.lat2) } },
                    { longitude: { $gte: Math.min(searchParams.lng1, searchParams.lng2) } },
                    { latitude: { $lte: Math.max(searchParams.lat1, searchParams.lat2) } },
                    { longitude: { $lte: Math.max(searchParams.lng1, searchParams.lng2) } },
                ]
            })
        }

        if (searchParams.interests && searchParams.interests.length > 0 && searchParams.interests[0].length > 0) {
            searchParams.interests.forEach(interestArray => mongooseParams['$and'].push({ interests: { $in: interestArray } }))
        }

        if (searchParams.startedAt) {
            mongooseParams['$and'].push({ startedAt: { $gte: searchParams.startedAt } })
        }

        if (searchParams.finishedAt) {
            mongooseParams['$and'].push({ finishedAt: { $lte: searchParams.startedAt } })
        }

        //   daysOf7: [Int]

        if (searchParams.divingStatus) {
            mongooseParams['$and'].push({ status: searchParams.divingStatus })
        }

        if (searchParams.peopleCountGte) {
            const key = `participants.${searchParams.peopleCountGte}`
            let param = {}
            param[key] = { $exist: true }
            mongooseParams['$and'].push(param)
        }

        if (searchParams.peopleCountLte) {
            const key = `participants.${searchParams.peopleCountLte + 1}`
            let param = {}
            param[key] = { $exist: false }
            mongooseParams['$and'].push(param)
        }

        if (searchParams.genderOnly) {
            mongooseParams['$and'].push({ 'participants.gender': { $elemMatch: searchParams.genderOnly } })
        }

        if (searchParams.daysLeft) {
            let date = new Date()
            date.setDate(date.getDate() + searchParams.daysLeft)
            mongooseParams['$and'].push({ startedAt: { $lte: date } })
        }

        if (searchParams.daysLte) {
            mongooseParams['$and'].push({ days: { $lte: searchParams.daysLte } })
        }

        if (searchParams.daysGte) {
            mongooseParams['$and'].push({ days: { $gte: searchParams.daysGte } })
        }

        if (searchParams.peopleLeft) {
            mongooseParams['$and'].push({ peopleLeft: { $gt: 0, $lte: searchParams.peopleLeft } })
        }

        if (searchParams.countryCodeEq) {
            mongooseParams['$and'].push({ countryCode: { $in: searchParams.countryCodeEq } })
        }

        if (searchParams.countryCodeNe) {
            mongooseParams['$and'].push({ countryCode: { $nin: searchParams.countryCodeNe } })
        }
    }

    return mongooseParams
}

async function queryMongoosePlaces(mongooseParams, limit, onlyIds) {

    if (!mongooseParams) {
        return []
    }

    console.log(`queryMongoosePlaces: mongooseParams=${JSON.stringify(mongooseParams)}`)
    if (onlyIds) {

        let divePoints = await DivePoint.find(mongooseParams)
            .sort('-adminScore')
            .limit(limit)
            .select(onlyIds ? '_id' : null)
            .distinct(onlyIds ? '_id' : null)
            .lean()

        let diveSites = await DiveSite.find(mongooseParams)
            .sort('-adminScore')
            .limit(limit)
            .select(onlyIds ? '_id' : null)
            .distinct(onlyIds ? '_id' : null)
            .lean()

        let diveCenters = await DiveCenter.find(mongooseParams)
            .sort('-adminScore')
            .limit(limit)
            .select(onlyIds ? '_id' : null)
            .distinct(onlyIds ? '_id' : null)
            .lean()

        let diveShops = await DiveShop.find(mongooseParams)
            .sort('-adminScore')
            .limit(limit)
            .select(onlyIds ? '_id' : null)
            .distinct(onlyIds ? '_id' : null)
            .lean()

        return diveCenters
            .concat(diveSites)
            .concat(divePoints)
            .concat(diveShops)

    } else {
        let divePoints = await DivePoint.find(mongooseParams)
            .sort('-adminScore')
            .limit(limit)
            .lean()

        let diveSites = await DiveSite.find(mongooseParams)
            .sort('-adminScore')
            .limit(limit)
            .lean()

        let diveCenters = await DiveCenter.find(mongooseParams)
            .sort('-adminScore')
            .limit(limit)
            .lean()

        let diveShops = await DiveShop.find(mongooseParams)
            .sort('-adminScore')
            .limit(limit)
            .lean()

        return diveCenters
            .concat(diveSites)
            .concat(divePoints)
            .concat(diveShops)
    }
}