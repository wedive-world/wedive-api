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

    Diving: {
        async divePoints(parent, args, context, info) {
            return await getDivePointsByIds(context.languageCode, parent.divePoints)
        },
    },

    Instructor: {
        async divePoints(parent, args, context, info) {
            let languageCode = context.languageCode
            let divePoints = await DivePoint.find({ _id: { $in: parent.divePoints } }).lean()
            return divePoints.map(divePoint => translator.translateOut(divePoint, languageCode))
        }
    },

    Query: {
        async getDivePoints(parent, args, context, info) {

            let languageCode = context.languageCode
            //console.log(`query | getAllDivePoints: languageCode=${languageCode}`)

            console.log(`query | getAllDivePoints: args=${JSON.stringify(args)}`)
            let skip = args.skip
            let limit = args.limit
            
            let divePoints = await DivePoint.find()
                .skip(skip)
                .limit(limit)
                .lean()

            return divePoints.map(divePoint => translator.translateOut(divePoint, languageCode))
        },

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

        async getDivePointByUniqueName(parent, args, context, info) {

            let languageCode = context.languageCode
            console.log(`query | getDivePointByUniqueName: languageCode=${languageCode}, args=${JSON.stringify(args)}`)

            let divePoint = await DivePoint.findOne({ uniqueName: args.uniqueName })
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
            console.log(`mutation | createDivePoint: languageCode=${languageCode}, args=${JSON.stringify(args)}`)

            let divePoint = null

            if (!args.input._id) {
                divePoint = new DivePoint(args.input)

            } else {
                divePoint = await DivePoint.findOne({ _id: args.input._id })
                Object.assign(divePoint, args.input)
                divePoint.updatedAt = Date.now()
            }

            divePoint.location.type = 'Point'
            divePoint.location.coordinates = [divePoint.latitude, divePoint.longitude]

            divePoint = translator.translateIn(divePoint, args.input, languageCode)
            await divePoint.save()

            if (args.input.diveSiteId) {

                let diveSite = await DiveSite.findOne({ _id: args.input.diveSiteId })

                if (!diveSite.divePoints) {
                    diveSite.divePoints = []
                }
    
                if (!diveSite.divePoints.includes(divePoint._id)) {
                    diveSite.divePoints.push(divePoint._id)
                }
    
                await diveSite.populate('divePoints')
                scoringDiveSite(diveSite)
                await diveSite.save()
            }

            let result = await DivePoint.findOne({ _id: divePoint._id })
                .lean()

            return translator.translateOut(result, languageCode)
        },

        async deleteDivePointById(parent, args, context, info) {
            let divePoint = await DivePoint.findOne({ _id: args.input._id })

            let diveSite = await DiveSite.findOne({ _id: args.input.diveSiteId })

            if (!diveSite.divePoints) {
                diveSite.divePoints = []
            }

            if (diveSite.divePoints.includes(divePoint._id)) {
                const index = diveSite.divePoints.indexOf(divePoint._id)
                if (index > -1) {
                    diveSite.divePoints.splice(index, 1)
                }
            }

            await diveSite.populate('divePoints')
            diveSite = scoringDiveSite(diveSite)
            await diveSite.save()

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

function scoringDiveSite(diveSite) {

    let sumOfFlowRateScore = 0
    let sumOfWaterEnvironmentScore = 0
    let sumOfEyeSightScore = 0

    diveSite.divePoints.forEach(divePoint => {

        diveSite.minDepth = Math.min(diveSite.minDepth, divePoint.minDepth)
        diveSite.maxDepth = Math.max(diveSite.maxDepth, divePoint.maxDepth)
        diveSite.minSight = Math.min(diveSite.minSight, divePoint.minSight)
        diveSite.maxSight = Math.max(diveSite.maxSight, divePoint.maxSight)

        sumOfFlowRateScore += divePoint.flowRateScore
        sumOfWaterEnvironmentScore += divePoint.waterEnvironmentScore
        sumOfEyeSightScore += divePoint.eyeSightScore
    });

    let numOfDivePoints = diveSite.divePoints.length

    diveSite.flowRateScore = Math.round(sumOfFlowRateScore / numOfDivePoints)
    diveSite.waterEnvironmentScore = Math.round(sumOfWaterEnvironmentScore / numOfDivePoints)
    diveSite.eyeSightScore = Math.round(sumOfEyeSightScore / numOfDivePoints)
}