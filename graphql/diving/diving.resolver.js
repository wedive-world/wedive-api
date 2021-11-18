const schema = require('../../model').schema;

const Diving = schema.Diving

const DivePoint = schema.DivePoint
const DiveSite = schema.DiveSite
const DiveCenter = schema.DiveCenter

const Interest = schema.Interest
const Image = schema.Image

const translator = require('../common/util/translator')
const objectHelper = require('../common/util/object-helper')

module.exports = {

    Diving: {
        async hostUser(parent, args, context, info) {
            return await User.find({ _id: parent.hostUser })
                .lean()
        },

        async participants(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.interests } })
                .lean()
        },

        async interests(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.interests } })
                .lean()
        },

        async diveSites(parent, args, context, info) {
            const countryCode = context.countryCode
            let resultList = await DiveSite.find({ _id: { $in: parent.diveSites } })
            return resultList.map(diveSite => translator.translateOut(diveSite, languageCode))
        },

        async divePoints(parent, args, context, info) {
            const countryCode = context.countryCode
            let resultList = await DivePoint.find({ _id: { $in: parent.divePoints } })
            return resultList.map(divePoint => translator.translateOut(divePoint, languageCode))
        },

        async diveCenters(parent, args, context, info) {
            const countryCode = context.countryCode
            let resultList = await DiveCenter.find({ _id: { $in: parent.diveCenters } })
            return resultList.map(diveCenter => translator.translateOut(diveCenter, languageCode))
        },

        async images(parent, args, context, info) {
            return await Image.find({ _id: { $in: parent.images } })
                .lean()
        },
    },

    Query: {
        async getAllDivings(parent, args, context, info) {

            return await Diving.find()
                .lean()
        },

        async getDivingById(parent, args, context, info) {
            return await Diving.find({ _id: args._id })
                .lean()
        },

        async getDivingsByHostUserId(parent, args, context, info) {
            return await Diving.find({ hostUser: args.hostUserId })
                .lean()
        },
    },

    Mutation: {
        async upsertDiving(parent, args, context, info) {
            console.log(`mutation | upsertDiving: args=${JSON.stringify(args)}`)
            //TODO check host user

            let diving = null

            if (!args.input._id) {
                diving = new Diving(args.input)

            } else {
                diving = await Diving.findOne({ _id: args.input._id })

                Object.keys(args.input)
                    .filter(key => args.input[key] && typeof diving[key] == typeof args.input[key])
                    .forEach(key => { diving[key] = args.input[key] })

                diving.updatedAt = Date.now()
            }

            await diving.save()

            return diving
        },

        async deleteDivingById(parent, args, context, info) {
            let result = await Diving.deleteOne({ _id: args._id })
            console.log(`mutation | deleteDivingById: result=${JSON.stringify(result)}`)
            return args._id
        },

        async joinDiving(parent, args, context, info) {
            let diving = await Diving.findOne({ _id: args.input._id })
            console.log(`mutation | deleteDivingById: result=${JSON.stringify(result)}`)

            //TODO IMPL
            return {
                result: 'fail',
                reason: 'publicEnded'
            }
        },
    }
};