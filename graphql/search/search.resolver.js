const {
    DiveSite,
    DivePoint,
    DiveCenter,
    Diving,
    Interest
} = require('../../model').schema

const translator = require('../common/util/translator')

module.exports = {
    Place: {
        __resolveType(place, context, info) {
            if (place.diveSiteId) {
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

            let places = await searchPlaces(searchParams, limit)
            return places.map(place => translator.translateOut(place, context.languageCode))
        },

        async searchDivings(parent, args, context, info) {
            console.log(`query | searchDivings: args=${JSON.stringify(args)}`)
            let limit = args.limit
            let searchParams = args.searchParams

            let places = await searchPlaces(searchParams, limit)
            let placeIds = places.map(place => place._id)

            let mongooseParams = {
                $or: [
                    { _id: { $in: placeIds } },
                    { diveSites: { $in: placeIds } },
                    { divePoints: { $in: placeIds } },
                    { diveCenters: { $in: placeIds } }
                ]
            }

            if (searchParams) {
                mongooseParams['$or']['$and'] = []

                if (searchParams.interests && searchParams.interests.length > 0 && searchParams.interests[0].length > 0) {
                    searchParams.interests.forEach(interestArray => mongooseParams['$or']['$and'].push({ interests: { $in: interestArray } }))
                }

                if (searchParams.query) {
                    mongooseParams['$or']['$and'].push({ $text: { $search: searchParams.query } })
                }
            }

            return await Diving.find(mongooseParams)
        },
    },
}

async function searchPlaces(searchParams, limit) {

    let mongooseParams = {}

    if (searchParams) {
        mongooseParams['$and'] = []

        if (searchParams.query) {
            mongooseParams['$and'].push({ $text: { $search: searchParams.query } })

            let foundInterest = await Interest.find({ $text: { $search: searchParams.query } })
                .lean()

            if (foundInterest) {
                mongooseParams['$and'].push({ interests: { $in: foundInterest.map(interest => interest._id) } })
            }
        }

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
    }

    console.log(`mongooseParams=${JSON.stringify(mongooseParams)}`)

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

    return diveCenters
        .concat(diveSites)
        .concat(divePoints)
}