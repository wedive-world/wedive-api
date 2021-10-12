const schema = require('../../model').schema;

const DivePoint = schema.DivePoint
const DiveSite = schema.DiveSite
const Interest = schema.Interest

const translator = require('./util/translator')

module.exports = {

    DiveSite: {
        async interests(parent, args, context, info) {
            return await Interest.find({
                _id: {
                    $in: parent.interests
                }

            })
        },

        async images(parent, args, context, info) {
            return await Image.find({
                _id: {
                    $in: parent.images
                }
            })
        },

        async backgroundImages(parent, args, context, info) {
            return await Image.find({
                _id: {
                    $in: parent.backgroundImages
                }
            })
        },

        async divePoints(parent, args, context, info) {
            const countryCode = context.countryCode
            let resultList = await DivePoint.find({
                _id: {
                    $in: parent.divePoints
                }
            })

            return resultList.map(divePoint => translator.divePointTranslateOut(divePoint, countryCode))
        },
    },

    Query: {
        async getAllDiveSites(parent, args, context, info) {
    
            let countryCode = context.countryCode || 'ko'
            let diveSiteList = await DiveSite.find()
            return diveSiteList.map(diveSite => translator.diveSiteTranslateOut(diveSite, countryCode))
        },
        async getDiveSiteById(parent, args, context, info) {
            let countryCode = context.countryCode || 'ko'
            let diveSite = await DiveSite.find({ _id: args._id })

            return translator.diveSiteTranslateOut(diveSite, countryCode)
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
            return diveSiteList.map(diveSite => translator.diveSiteTranslateOut(diveSite, countryCode))
        },
        async searchDiveSitesByName(parent, args, context, info) {

            let countryCode = context.countryCode || 'ko'
            console.log(`query | searchDiveSite: args=${JSON.stringify(args)}`)

            let param = {
                $text: { $search: args.query }
            }

            console.log(`query | searchDiveSite: param=${JSON.stringify(param)}`)

            let diveSiteList = await DiveSite.find(param)
            return diveSiteList.map(diveSite => translator.diveSiteTranslateOut(diveSite, countryCode))
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

                Object.keys(args.input)
                    .filter(key => args.input[key] && typeof key == typeof args.input[key])
                    .forEach(key => { diveSite[key] = args.input[key] })

                diveSite.updatedAt = Date.now()
            }

            diveSite = translator.diveSiteTranslateIn(diveSite, args.input, countryCode)
            console.log(`mutation | diveSite: diveSite=${JSON.stringify(diveSite)}`)

            let result = await diveSite.save()
            let translated = translator.diveSiteTranslateOut(result, countryCode)
            console.log(`mutation | diveSite: translated=${JSON.stringify(translated)}`)
            return translated
        },
    }
};