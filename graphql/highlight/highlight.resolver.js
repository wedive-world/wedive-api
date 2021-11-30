const schema = require('../../model').schema;

const Highlight = schema.Highlight
const Interest = schema.Interest
const Image = schema.Image
const DivePoint = schema.DivePoint

const translator = require('../common/util/translator')

module.exports = {

    DivePoint: {
        async highlights(parent, args, context, info) {
            return await getHightlights(context.languageCode, parent.highlights);
        },
    },

    DiveSite: {
        async highlights(parent, args, context, info) {
            return await getHightlights(context.languageCode, parent.highlights);
        },
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
                Object.assign(highlight, args.input)
                highlight.updatedAt = Date.now()
            }

            highlight = translator.translateIn(highlight, args.input, languageCode)
            await highlight.save()

            let divePoint = await DivePoint.findOne({ _id: args.input.divePointId })
            if (divePoint != null) {
                divePoint.highlights.push(highlight._id)
                await divePoint.save()
            }

            return translator.translateOut(highlight, languageCode)
        },
        async deleteHighlightById(parent, args, context, info) {
            let result = await Highlight.deleteOne({ _id: args._id })
            console.log(`mutation | deleteHighlightById: result=${JSON.stringify(result)}`)
            return args._id
        },
    }
};

async function getHightlights(languageCode, highlights) {
    let highlights = await Highlight.find({ _id: { $in: highlights } })
        .lean();
    return highlights.map(highlight => translator.translateOut(highlight, languageCode));
}
