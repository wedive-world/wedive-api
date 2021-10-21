const schema = require('../../model').schema;

const Highlight = schema.Highlight
const Interest = schema.Interest

const translator = require('./util/translator')

module.exports = {

    HighLight: {
        async interests(parent, args, context, info) {
            return await Interest.find({ _id: { $in: parent.interests } })
                .lean()
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
            console.log(`mutation | highlight: args=${JSON.stringify(args)}`)

            let countryCode = context.countryCode || 'ko'

            let highlight = null

            if (!args.input._id) {
                highlight = new Highlight(args.input)

            } else {
                highlight = await Highlight.findOne({ _id: args.input._id })
                    .lean()

                Object.keys(args.input)
                    .filter(key => args.input[key] && typeof key == typeof args.input[key])
                    .forEach(key => { highlight[key] = args.input[key] })

                highlight.updatedAt = Date.now()
            }

            highlight = translator.translateIn(highlight, args.input, countryCode)
            await highlight.save()

            return translator.translateOut(highlight, countryCode)
        },
        async deleteHighlightById(parent, args, context, info) {
            let result = await Highlight.deleteOne({ _id: args._id })
            console.log(`mutation | deleteHighlightById: result=${JSON.stringify(result)}`)
            return args._id
        },
    }
};