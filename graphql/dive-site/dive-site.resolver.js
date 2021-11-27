const schema = require('../../model').schema;

const DiveSite = schema.DiveSite

const translator = require('../common/util/translator')

module.exports = {

    DiveCenter: {
        async diveSites(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveSites = await DiveSite.find({ _id: { $in: parent.diveSites } })
                .lean()

            return diveSites.map(diveSite => translator.translateOut(diveSite, languageCode))
        },
    },

    DivePoint: {
        async diveSite(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveSite = await DiveSite.findOne({ _id: parent.diveSiteId })
                .lean()

            return translator.translateOut(diveSite, languageCode)
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