const schema = require('../../model').schema;

const DivePoint = schema.DivePoint
const DiveSite = schema.DiveSite
const Interest = schema.Interest
const Image = schema.Image

const translator = require('../common/util/translator')

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
            return resultList.map(divePoint => translator.translateOut(divePoint, languageCode))
        },

        async month1(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month1 } })
                .lean()
        },

        async month2(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month2 } })
                .lean()
        },

        async month3(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month3 } })
                .lean()
        },

        async month4(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month4 } })
                .lean()
        },

        async month5(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month5 } })
                .lean()
        },

        async month6(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month6 } })
                .lean()
        },

        async month7(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month7 } })
                .lean()
        },

        async month8(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month8 } })
                .lean()
        },

        async month9(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month9 } })
                .lean()
        },

        async month10(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month10 } })
                .lean()
        },

        async month11(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month11 } })
                .lean()
        },
        
        async month12(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.month12 } })
                .lean()
        },
    },

    Query: {
        async getAllDiveSites(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveSiteList = await DiveSite.find()
                .lean()

            return diveSiteList.map(diveSite => translator.translateOut(diveSite, languageCode))
        },
        async getDiveSiteById(parent, args, context, info) {
            let languageCode = context.languageCode
            let diveSite = await DiveSite.find({ _id: args._id })
                .lean()

            return translator.translateOut(diveSite, languageCode)
        },
        async getDiveSiteByAddress(parent, args, context, info) {
            let languageCode = context.languageCode
            let diveSite = await DiveSite.find({ address: args.address })
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

                Object.keys(args.input)
                    .filter(key => args.input[key] && typeof diveSite[key] == typeof args.input[key])
                    .forEach(key => { diveSite[key] = args.input[key] })

                diveSite.updatedAt = Date.now()
            }

            diveSite = translator.translateIn(diveSite, args.input, languageCode)
            await diveSite.save()

            return translator.translateOut(diveSite, languageCode)
        },
        async deleteDiveSiteById(parent, args, context, info) {
            let result = await DiveSite.deleteOne({ _id: args._id })
            console.log(`mutation | deleteDiveSiteById: result=${JSON.stringify(result)}`)
            return args._id
        },
    }
};