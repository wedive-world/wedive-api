const schema = require('../../model').schema;

const DiveSite = schema.DiveSite
const DivePoint = schema.DivePoint

const translator = require('../common/util/translator')

module.exports = {

    DiveCenter: {
        async divePoints(parent, args, context, info) {
            return await getDivePointsByIds(context.languageCode, parent.divePoints)
        },
    },

    DiveSite: {
        async divePoints(parent, args, context, info) {
            return await getDivePointsByIds(context.languageCode, parent.divePoints)
        },
    },

    Query: {
        async getAllDivePoints(parent, args, context, info) {

            let languageCode = context.languageCode
            console.log(`query | getAllDivePoints: languageCode=${languageCode}`)

            let divePoints = await DivePoint.find()
                .lean()
            return divePoints.map(divePoint => translator.translateOut(divePoint, languageCode))
        },
        async getDivePointById(parent, args, context, info) {

            let languageCode = context.languageCode
            console.log(`query | getDivePointById: languageCode=${languageCode}, args=${JSON.stringify(args)}`)

            let divePoint = await DivePoint.findOne({ _id: args._id })
                .lean()

            return translator.translateOut(divePoint, languageCode)
        },
        async getDivePointsNearBy(parent, args, context, info) {

            let languageCode = context.languageCode
            console.log(`query | getDivePointsNearBy: languageCode=${languageCode}, args=${JSON.stringify(args)}`)

            let divePoints = await DivePoint.find({
                $and: [
                    { latitude: { $gt: Math.min(args.lat1, args.lat2) } },
                    { longitude: { $gt: Math.min(args.lon1, args.lon2) } },
                    { latitude: { $lt: Math.max(args.lat1, args.lat2) } },
                    { longitude: { $lt: Math.max(args.lon1, args.lon2) } },
                ]
            })
                .lean()
            return divePoints.map(divePoint => translator.translateOut(divePoint, languageCode))
        },
        async searchDivePointsByName(parent, args, context, info) {

            let languageCode = context.languageCode
            console.log(`query | searchDivePointsByName: languageCode=${languageCode}, args=${JSON.stringify(args)}`)

            let divePoints = await DivePoint.find({ $text: { $search: args.query } })
                .lean()
            return divePoints.map(divePoint => translator.translateOut(divePoint, languageCode))
        },

    },

    Mutation: {

        async upsertDivePoint(parent, args, context, info) {

            let languageCode = context.languageCode
            console.log(`mutation | createDivePoint: languageCode=${languageCode}, args=${args}`)

            let divePoint = null

            if (!args.input._id) {
                divePoint = new DivePoint(args.input)

            } else {
                divePoint = await DivePoint.findOne({ _id: args.input._id })

                Object.keys(args.input)
                    .filter(key => args.input[key] && typeof divePoint[key] == typeof args.input[key])
                    .forEach(key => { divePoint[key] = args.input[key] })

                divePoint.updatedAt = Date.now()
            }

            divePoint = translator.translateIn(divePoint, args.input, languageCode)
            await divePoint.save()

            let diveSite = await DiveSite.findOne({ _id: args.input.diveSiteId })
            if (!diveSite.divePoints) {
                diveSite.divePoints = []
            }

            if (!diveSite.divePoints.includes(divePoint._id)) {
                diveSite.divePoints.push(divePoint._id)
            }

            await diveSite.save()

            return translator.translateOut(divePoint, languageCode)
        },

        async deleteDivePointById(parent, args, context, info) {
            let result = await DivePoint.deleteOne({ _id: args._id })
            console.log(`mutation | deleteDivePointById: result=${JSON.stringify(result)}`)
            return args._id
        },
    }
};

async function getDivePointsByIds(languageCode, ids) {
    let resultList = await DivePoint.find({ _id: { $in: ids } })
    return resultList.map(divePoint => translator.translateOut(divePoint, languageCode))
}