const schema = require('../../model').schema;

const Diving = schema.Diving

const DivePoint = schema.DivePoint
const DiveSite = schema.DiveSite
const DiveCenter = schema.DiveCenter

const Interest = schema.Interest
const Image = schema.Image

const translator = require('../common/util/translator')

module.exports = {

    // Query: {
    //     async getAllDivings(parent, args, context, info) {

    //         return await Diving.find()
    //             .lean()
    //     },
    // },

    // Mutation: {
    //     async upsertDiving(parent, args, context, info) {
    //         console.log(`mutation | upsertDiving: args=${JSON.stringify(args)}`)
    //         //TODO check host user

    //         let diving = null

    //         if (!args.input._id) {
    //             diving = new Diving(args.input)

    //         } else {
    //             diving = await Diving.findOne({ _id: args.input._id })

    //             Object.keys(args.input)
    //                 .filter(key => args.input[key] && typeof diving[key] == typeof args.input[key])
    //                 .forEach(key => { diving[key] = args.input[key] })

    //             diving.updatedAt = Date.now()
    //         }

    //         await diving.save()

    //         return diving
    //     },
    // }
};