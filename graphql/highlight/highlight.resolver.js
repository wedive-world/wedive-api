const schema = require('../../model').schema;

const Highlight = schema.Highlight
const Interest = schema.Interest
const Image = schema.Image
const DivePoint = schema.DivePoint

const translator = require('../common/util/translator')

module.exports = {

    Highlight: {
        async interests(parent, args, context, info) {
            let languageCode = context.languageCode
            var interests = await Interest.find({ _id: { $in: parent.interests } })
                .lean()
            
            return interests.map(interest => translator.translateOut(interest, languageCode))
        },
        async images(parent, args, context, info) {
            return await Image.find({ _id: { $in: parent.images } })
                .lean()
        },
    },

    Query: {
    },

    Mutation: {
        async upsertHighlight(parent, args, context, info) {
            let languageCode = context.languageCode

            console.log(`mutation | highlight: languageCode=${languageCode} args=${JSON.stringify(args)}`)

            let highlight = null

            if (!args.input._id) {
                highlight = new Highlight(args.input)

            } else {
                highlight = await Highlight.findOne({ _id: args.input._id })

                Object.keys(args.input)
                    .filter(key => args.input[key] && typeof key == typeof args.input[key])
                    .forEach(key => { highlight[key] = args.input[key] })

                highlight.updatedAt = Date.now()
            }

            highlight = translator.translateIn(highlight, args.input, languageCode)
            await highlight.save()

            let divePoint = await DivePoint.findOne({ _id: args.input.divePointId })
            divePoint.highlights.push(highlight._id)
            await divePoint.save()

            return translator.translateOut(highlight, languageCode)
        },
        async deleteHighlightById(parent, args, context, info) {
            let result = await Highlight.deleteOne({ _id: args._id })
            console.log(`mutation | deleteHighlightById: result=${JSON.stringify(result)}`)
            return args._id
        },
    }
};