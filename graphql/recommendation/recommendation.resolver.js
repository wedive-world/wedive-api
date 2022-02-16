const {
    Recommendation,
    DiveSite,
    DivePoint,
    DiveCenter,
    Diving,
    Instructor
} = require('../../model').schema;

const SearchResolver = require('../search/search.resolver')

module.exports = {
    Recommendation: {
        async previews(parent, args, context, info) {
            return await getPreviews(parent)
        }
    },

    Query: {
        async getReviewsByCurrentUser(parent, args, context, info) {
            console.log(`query | getReviewsByCurrentUser: context=${JSON.stringify(context)}`)

            let user = await User.findOne({ uid: context.uid }).lean()
            let recommendations = await Recommendation.find({ interests: { $in: user.interests } })
                .lean()

            return recommendations.map(async recommendation => { return await findPreviews(recommendation) })
        },

        async getAllRecommendations(parent, args, context, info) {
            console.log(`query | getAllRecommendations: context=${JSON.stringify(context)}`)
            return await Recommendation.find()
        },
    },

    Mutation: {
        async upsertRecommendation(parent, args, context, info) {
            console.log(`mutation | upsertRecommendation: args=${JSON.stringify(args)}`)

            if (args.input) {
                args.input.searchParams = JSON.stringify(args.input.searchParams)
            }

            let recommendation = null
            if (args.input._id) {
                recommendation = await Recommendation.findById(args.input._id)
            } else {
                recommendation = new Recommendation(args.input)
            }

            Object.assign(recommendation, args.input)

            await recommendation.save()
            return recommendation
        },

        async deleteRecommendation(parent, args, context, info) {
            console.log(`mutation | deleteRecommendation: args=${JSON.stringify(args)}`)

            await Recommendation.findByIdAndDelete(args._id)
            return {
                success: true
            }
        }
    },
};

async function findPreviews(recommendation) {
    switch (recommendation.recommendationType) {
        case 'interest':
            recommendation.preivews = await findPreviewsByInterest(
                recommendation.recommendationTargetType,
                recommendation.interests,
                recommendation.previewCount
            )
            return recommendataion
    }
}

async function findPreviewsByInterest(targetType, targetInterests, previewCount) {
    const model = getModel(targetType)
    return await model.find({ interests: { $in: targetInterests } })
        .limit(previewCount)
        .sort('-adminScore')
        .lean()
}

function getModel(targetType) {

    switch (targetType) {

        case 'diveCenter':
            return DiveCenter

        case 'divePoint':
            return DivePoint

        case 'diveSite':
            return DiveSite

        case 'diving':
            return Diving

        case 'instructor':
            return Instructor
    }
}

async function getPreviews(recommend) {
    switch (recommendation.recommendationType) {
        case 'new':
            return await getNewRecommendation(recommend)
        case 'interest':
            return await getInterestRecommendation(recommend)
        case 'search':
            return await getSearchRecommendation(recommend)

    }
}

async function getNewRecommendation(recommend) {
    return await getModel(recommend.recommendationTargetType)
        .find()
        .order('-createdAt')
        .limit(recommend.previewCount)
        .lean()
}

async function getInterestRecommendation(recommend) {
    return await getModel(recommend.recommendationTargetType)
        .find({ interests: recommend.interest })
        .order('-adminScore')
        .limit(recommend.previewCount)
        .lean()
}

async function getSearchRecommendation(recommend) {
    const searchParams = JSON.parse(recommend.searchParams)

    switch (recommend.targetType) {
        case 'diving':
            return await SearchResolver.Query.searchDivings(
                null,
                { limit: recommend.previewCount, searchParams: searchParams },
                null,
                null
            )
        case 'diveCenter':
        case 'diveSite':
        case 'divePoint':
            return await SearchResolver.Query.searchPlaces(
                null,
                { limit: recommend.previewCount, searchParams: searchParams },
                null,
                null
            )
    }
}