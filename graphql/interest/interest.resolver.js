const schema = require('../../model').schema;

const Interest = schema.Interest

const translator = require('../common/util/translator')
const objectHelper = require('../common/util/object-helper')

module.exports = {

    DiveCenter: {
        async interests(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.interests)
        },
    },

    DiveSite: {
        async interests(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.interests)
        },

        async month1(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month1)
        },

        async month2(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month2)
        },

        async month3(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month3)
        },

        async month4(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month4)
        },

        async month5(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month5)
        },

        async month6(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month6)
        },

        async month7(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month7)
        },

        async month8(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month8)
        },

        async month9(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month9)
        },

        async month10(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month10)
        },

        async month11(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month11)
        },

        async month12(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month12)
        },
    },

    DivePoint: {
        async interests(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.interests)
        },

        async month1(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month1)
        },

        async month2(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month2)
        },

        async month3(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month3)
        },

        async month4(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month4)
        },

        async month5(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month5)
        },

        async month6(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month6)
        },

        async month7(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month7)
        },

        async month8(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month8)
        },

        async month9(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month9)
        },

        async month10(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month10)
        },

        async month11(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month11)
        },

        async month12(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.month12)
        },
    },

    Highlight: {
        async interests(parent, args, context, info) {
            return await getInterestListByIds(context.languageCode, parent.interests)
        },
    },

    Query: {
        async getInterestById(parent, args, context, info) {
            let languageCode = context.languageCode
            console.log(`query | getInterestById: languagecode=${JSON.stringify(languageCode)} args=${JSON.stringify(args)}`)

            let interest = await Interest.findOne({ _id: args._id })
                .lean()

            return translator.translateOut(interest, languageCode)
        },

        async getInterestByUniqueName(parent, args, context, info) {
            let languageCode = context.languageCode
            console.log(`query | getInterestById: languagecode=${JSON.stringify(languageCode)} args=${JSON.stringify(args)}`)

            let interest = await Interest.findOne({ uniqueName: args.uniqueName })
                .lean()

            return translator.translateOut(interest, languageCode)
        },

        async getAllInterests(parent, args, context, info) {
            let languageCode = context.languageCode

            console.log(`query | getAllInterests: languagecode=${JSON.stringify(languageCode)}`)

            let interests = await Interest.find((args.type) ? { type: args.type } : {})
                .lean()

            return interests.map(interest => translator.translateOut(interest, languageCode))
        },

        async searchInterestsByName(parent, args, context, info) {

            let languageCode = context.languageCode
            console.log(`query | searchInterestsByName: args=${JSON.stringify(args)}`)

            let param = {
                $and: [
                    { $text: { $search: args.query } }
                ]
            }

            if (args.type) {
                param.$and.push({
                    type: args.type
                })
            }

            console.log(`query | searchInterest: param=${JSON.stringify(param)}`)

            let interests = await Interest.find(param)
                .lean()

            console.log(`query | searchInterest: result=${JSON.stringify(interests)}`)

            return interests.map(interest => translator.translateOut(interest, languageCode))
        }
    },

    Mutation: {
        async upsertInterest(parent, args, context, info) {

            console.log(`mutation | createInterest: args=${JSON.stringify(args)}`)

            let languageCode = context.languageCode

            let interest = null

            if (!args.input._id) {
                interest = new Interest(args.input)

            } else {
                interest = await Interest.findOne({ _id: args.input._id })
                objectHelper.updateObject(args.input, interest)
                interest.updatedAt = Date.now()
            }

            interest = translator.translateIn(interest, args.input, languageCode)
            await interest.save()

            let result = await Interest.findOne({ _id: interest._id })
                .lean()

            return translator.translateOut(result, languageCode)
        },

        async deleteInterestById(parent, args, context, info) {
            let result = await Interest.deleteOne({ _id: args._id })
            console.log(`mutation | deleteInterestById: result=${JSON.stringify(result)}`)
            return args._id
        },
    },
};

async function getInterestListByIds(languageCode, interestIds) {

    let interests = await Interest.find({ _id: { $in: interestIds } })
        .lean()

    return interests.map(interest => translator.translateOut(interest, languageCode))
}