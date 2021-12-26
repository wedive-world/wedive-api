const schema = require('../../model').schema;

const DiveCenter = schema.DiveCenter
const DiveSite = schema.DiveSite

const translator = require('../common/util/translator')

module.exports = {
    DiveSite: {
        async diveCenters(parent, args, context, info) {
            let languageCode = context.languageCode
            let diveCenters = await DiveCenter.find({ diveSites: { $in: parent._id } }).lean()
            return diveCenters.map(diveCenter => translator.translateOut(diveCenter, languageCode))
        }
    },

    DivePoint: {
        async diveCenters(parent, args, context, info) {
            let languageCode = context.languageCode
            let diveCenters = await DiveCenter.find({ divePoints: { $in: parent._id } }).lean()
            return diveCenters.map(diveCenter => translator.translateOut(diveCenter, languageCode))
        }
    },

    Diving: {
        async diveCenters(parent, args, context, info) {
            let languageCode = context.languageCode
            let diveCenters = await DiveCenter.find({ diveSites: { $in: parent._id } }).lean()
            return diveCenters.map(diveCenter => translator.translateOut(diveCenter, languageCode))
        }
    },

    Instructor: {
        async diveCenters(parent, args, context, info) {
            let languageCode = context.languageCode
            let diveCenters = await DiveCenter.find({ _id: { $in: parent.diveCenters } }).lean()
            return diveCenters.map(diveCenter => translator.translateOut(diveCenter, languageCode))
        }
    },

    Query: {
        // async ___DiveCenters(parent, args, context, info) { },
        async getAllDiveCenters(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveCenters = await DiveCenter.find()
                .lean()
            return diveCenters.map(diveCenter => translator.translateOut(diveCenter, languageCode))
        },

        async getDiveCenters(parent, args, context, info) {

            let languageCode = context.languageCode
            console.log(`query | getAllDiveCenters: languageCode=${languageCode}`)

            console.log(`query | getAllDiveCenters: args=${JSON.stringify(args)}`)
            let offset = args.offset ? args.offset : 100
            let limit = args.limit

            let params = offset ? {
                _id: { $gt: offset }
            } : {}

            let diveCenters = await DiveCenter.find(params)
                .limit(limit)
                .lean()

            return diveCenters.map(diveCenter => translator.translateOut(diveCenter, languageCode))
        },

        async getDiveCenterById(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveCenter = await DiveCenter.findOne({ _id: args._id })
                .lean()

            return translator.translateOut(diveCenter, languageCode)
        },

        async getDiveCenterByUniqueName(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveCenter = await DiveCenter.findOne({ uniqueName: args.uniqueName })
                .lean()

            return translator.translateOut(diveCenter, languageCode)
        },

        async getDiveCentersNearBy(parent, args, context, info) {

            let languageCode = context.languageCode
            let diveCenters = await DiveCenter.find({
                $and: [
                    { latitude: { $gt: Math.min(args.lat1, args.lat2) } },
                    { longitude: { $gt: Math.min(args.lon1, args.lon2) } },
                    { latitude: { $lt: Math.max(args.lat1, args.lat2) } },
                    { longitude: { $lt: Math.max(args.lon1, args.lon2) } },
                ]
            })
                .lean()

            return diveCenters.map(diveCenter => translator.translateOut(diveCenter, languageCode))
        },

        async searchDiveCentersByName(parent, args, context, info) {

            console.log(`query | searchDiveCentersByName: args=${JSON.stringify(args)}`)

            let languageCode = context.languageCode
            let diveCenters = await DiveCenter.find({ $text: { $search: args.query } })
                .lean()
            return diveCenters.map(diveCenter => translator.translateOut(diveCenter, languageCode))
        },

    },

    Mutation: {

        async upsertDiveCenter(parent, args, context, info) {

            console.log(`mutation | upsertDiveCenter: args=${args}`)
            let languageCode = context.languageCode

            let diveCenter = null

            if (!args.input._id) {
                diveCenter = new DiveCenter(args.input)

            } else {
                diveCenter = await DiveCenter.findOne({ _id: args.input._id })
                Object.assign(diveCenter, args.input)
                diveCenter.updatedAt = Date.now()
            }

            if (diveCenter.divePoints) {
                await diveCenter.populate('divePoints')
                diveCenter.divePoints.forEach(divePoint => {
                    if (!diveCenter.diveSites) {
                        diveCenter.diveSites = [];
                    }

                    if (diveCenter.diveSites.includes(divePoint.diveSiteId)) {
                        return;
                    }

                    diveCenter.diveSites.push(divePoint.diveSiteId)
                });
            }

            diveCenter = translator.translateIn(diveCenter, args.input, languageCode)
            await diveCenter.save()

            let result = await DiveCenter.findOne({ _id: diveCenter._id })
                .lean()

            return translator.translateOut(result, languageCode)
        },

        async deleteDiveCenterById(parent, args, context, info) {
            let result = await DiveCenter.deleteOne({ _id: args._id })
            console.log(`mutation | deleteDiveCenterById: result=${JSON.stringify(result)}`)
            return args._id
        },
    }
};