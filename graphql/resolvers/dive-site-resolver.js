const schema = require('../../model').schema;

const DivePoint = schema.DivePoint
const DiveSite = schema.DiveSite
const Interest = schema.Interest

const translator = require('./util/translator')

const divePointResolver = require('./dive-point-resolver')

module.exports = {

    DiveSite: {
        async interests(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.interests } })
                .lean()
        },

        async images(parent, args, context, info) {
            return await Image.find({ _id: { $in: parent.images } })
                .lean()
        },

        async backgroundImages(parent, args, context, info) {
            return await Image.find({ _id: { $in: parent.backgroundImages } })
                .lean()
        },

        async divePoints(parent, args, context, info) {
            const countryCode = context.countryCode
            let resultList = await DivePoint.find({ _id: { $in: parent.divePoints } })
            return resultList.map(divePoint => translator.translateOut(divePoint, countryCode))
        },
    },

    Query: {
        async getAllDiveSites(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            let diveSiteList = await DiveSite.find()
                .lean()

            return diveSiteList.map(diveSite => translator.translateOut(diveSite, countryCode))
        },
        async getDiveSiteById(parent, args, context, info) {
            let countryCode = context.countryCode || 'ko'
            let diveSite = await DiveSite.find({ _id: args._id })
                .lean()

            return translator.translateOut(diveSite, countryCode)
        },
        async getDiveSitesNearby(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            let diveSiteList = await DiveSite.find({
                $and: [
                    { latitude: { $gt: Math.min(args.lat1, args.lat2) } },
                    { longitude: { $gt: Math.min(args.lon1, args.lon2) } },
                    { latitude: { $lt: Math.max(args.lat1, args.lat2) } },
                    { longitude: { $lt: Math.max(args.lon1, args.lon2) } },
                ]
            })
                .lean()

            return diveSiteList.map(diveSite => translator.translateOut(diveSite, countryCode))
        },
        async searchDiveSitesByName(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            console.log(`query | searchDiveSite: args=${JSON.stringify(args)}`)

            let param = {
                $text: { $search: args.query }
            }

            console.log(`query | searchDiveSite: param=${JSON.stringify(param)}`)

            let diveSiteList = await DiveSite.find(param)
                .lean()

            return diveSiteList.map(diveSite => translator.translateOut(diveSite, countryCode))
        },

    },

    Mutation: {
        async upsertDiveSite(parent, args, context, info) {
            console.log(`mutation | diveSite: args=${JSON.stringify(args)}`)

            let countryCode = context.countryCode || 'ko'

            let diveSite = null
            
            if (!args.input._id) {
                diveSite = new DiveSite(args.input)

            } else {
                diveSite = await DiveSite.findOne({ _id: args.input._id })
                    .lean()

                Object.keys(args.input)
                    .filter(key => args.input[key] && typeof key == typeof args.input[key])
                    .forEach(key => { diveSite[key] = args.input[key] })

                diveSite.updatedAt = Date.now()
            }

            diveSite = translator.translateIn(diveSite, args.input, countryCode)
            await diveSite.save()

            return translator.translateOut(diveSite, countryCode)
        },
        async deleteDiveSiteById(parent, args, context, info) {
            let result = await DiveSite.deleteOne({ _id: args._id })
            console.log(`mutation | deleteDiveSiteById: result=${JSON.stringify(result)}`)
            return args._id
        },
    }
};