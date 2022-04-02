const schema = require('../../model').schema;

const DiveSite = schema.DiveSite

const translator = require('../common/util/translator')
const {
    queryGeocoding,
    queryReverseGeocoding
} = require('../../controller/geocoding-client')

module.exports = {

    DiveCenter: {
        async diveSites(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveSites = await DiveSite.find({ _id: { $in: parent.diveSites } })
                .lean()

            return diveSites.map(diveSite => translator.translateOut(diveSite, languageCode))
        },

        async nearDiveSite(parent, args, context, info) {
            return await DiveSite.find({
                location: {
                    $near: {
                        // $maxDistance: 10000,
                        $geometry: {
                            type: "Point",
                            coordinates: [parent.longitude, parent.latitude]
                        }
                    }
                }
            })
                .limit(1)
        }
    },

    DivePoint: {
        async diveSite(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveSite = await DiveSite.findOne({ _id: parent.diveSiteId })
                .lean()

            return translator.translateOut(diveSite, languageCode)
        },
    },

    Diving: {
        async diveSites(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveSites = await DiveSite.find({ _id: { $in: parent.diveSites } })
                .lean()

            return diveSites.map(diveSite => translator.translateOut(diveSite, languageCode))
        },
    },

    Instructor: {
        async diveSites(parent, args, context, info) {
            let languageCode = context.languageCode
            let diveSites = await DiveSite.find({ _id: { $in: parent.diveSites } }).lean()
            return diveSites.map(diveSite => translator.translateOut(diveSite, languageCode))
        }
    },

    Query: {
        async getAllDiveSites(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveSiteList = await DiveSite.find()
                .lean()

            return diveSiteList.map(diveSite => translator.translateOut(diveSite, languageCode))
        },

        async getDiveSites(parent, args, context, info) {

            let languageCode = context.languageCode
            console.log(`query | getAllDiveSites: languageCode=${languageCode}`)

            console.log(`query | getAllDiveSites: args=${JSON.stringify(args)}`)
            let skip = args.skip
            let limit = args.limit

            let diveSites = await DiveSite.find(params)
                .skip(skip)
                .limit(limit)
                .lean()

            return diveSites.map(diveSite => translator.translateOut(diveSite, languageCode))
        },

        async getDiveSiteById(parent, args, context, info) {
            let languageCode = context.languageCode
            let diveSite = await DiveSite.findOne({ _id: args._id })
                .lean()

            return translator.translateOut(diveSite, languageCode)
        },

        async getDiveSiteByAddress(parent, args, context, info) {
            let languageCode = context.languageCode
            let diveSite = await DiveSite.findOne({ address: args.address })
                .lean()

            return translator.translateOut(diveSite, languageCode)
        },

        async getDiveSiteByUniqueName(parent, args, context, info) {
            let languageCode = context.languageCode
            let diveSite = await DiveSite.findOne({ uniqueName: args.uniqueName })
                .lean()

            return translator.translateOut(diveSite, languageCode)
        },

        async getDiveSitesNearby(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveSiteList = await DiveSite.find({
                $and: [
                    { latitude: { $gt: Math.min(args.lat1, args.lat2) } },
                    { longitude: { $gt: Math.min(args.lon1, args.lon2) } },
                    { latitude: { $lt: Math.max(args.lat1, args.lat2) } },
                    { longitude: { $lt: Math.max(args.lon1, args.lon2) } },
                ]
            })
                .limit(args.limit)
                .sort('-adminScore')
                .lean()

            return diveSiteList.map(diveSite => translator.translateOut(diveSite, languageCode))
        },

        async searchDiveSitesByName(parent, args, context, info) {

            let languageCode = context.languageCode
            console.log(`query | searchDiveSitesByName: args=${JSON.stringify(args)}`)

            let param = {
                $text: { $search: args.query }
            }

            console.log(`query | searchDiveSitesByName: param=${JSON.stringify(param)}`)

            let diveSiteList = await DiveSite.find(param)
                .lean()

            return diveSiteList.map(diveSite => translator.translateOut(diveSite, languageCode))
        },

    },

    Mutation: {
        async upsertDiveSite(parent, args, context, info) {
            console.log(`mutation | upsertDiveSite: args=${JSON.stringify(args)}`)

            let languageCode = context.languageCode

            let diveSite = null

            if (!args.input._id) {
                diveSite = new DiveSite(args.input)

            } else {
                diveSite = await DiveSite.findOne({ _id: args.input._id })
                Object.assign(diveSite, args.input)
                diveSite.updatedAt = Date.now()
            }

            diveSite.location.type = 'Point'
            diveSite.location.coordinates = [diveSite.longitude, diveSite.latitude]

            let geocoding = await queryReverseGeocoding(diveSite.latitude, diveSite.longitude, context.languageCode)
            if (geocoding) {
                diveSite.address = geocoding.refinedAddress
            }

            diveSite = translator.translateIn(diveSite, args.input, languageCode)
            await diveSite.save()

            let result = await DiveSite.findOne({ _id: diveSite._id })
                .lean()

            return translator.translateOut(result, languageCode)
        },
        async deleteDiveSiteById(parent, args, context, info) {
            let result = await DiveSite.deleteOne({ _id: args._id })
            console.log(`mutation | deleteDiveSiteById: result=${JSON.stringify(result)}`)
            return args._id
        },
    }
};