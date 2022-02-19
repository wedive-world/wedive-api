const {
    Recommendation,
    DiveSite,
    DivePoint,
    DiveCenter,
    Diving,
    Instructor
} = require('../../model').schema;

const SearchResolver = require('../search/search.resolver')
const RECOMMEND_COUNT = 5

module.exports = {
    RecommendationPreview: {
        async __resolveType(obj, context, info) {
            if (obj.hostUser) {
                return 'Diving'
            } else if (obj.diveSiteId) {
                return 'DivePoint'
            } else if (obj.webPageUrl || obj.email || obj.phoneNumber || obj.educationScore) {
                return 'DiveCenter'
            } else if (obj.user) {
                return 'Instructor'
            } else {
                return 'DiveSite'
            }
        }
    },

    Recommendation: {
        async previews(parent, args, context, info) {
            return await getPreviews(parent)
        }
    },

    Query: {
        async getUserRecommendations(parent, args, context, info) {
            console.log(`query | getReviewsByCurrentUser: context=${JSON.stringify(context)}`)

            let user = await User.findOne({ uid: context.uid }).lean()
            let recommendations = await Recommendation.find({ interests: { $in: user.interests } })
                .lean()

            let seed = user.recommendationSeed

            let randomRecommendations = await Recommendation.find()
                .skip(seed)
                .limit(RECOMMEND_COUNT)
                .lean()

            let recommendsCount = await Recommendation.count()
            let nextSeed = (seed + RECOMMEND_COUNT) % recommendsCount
            await User.updateOne({ uid: context.uid }, { recommendSeed: nextSeed })

            recommendations = recommendations.concat(randomRecommendations)
            return recommendations
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
        },

        // async getUserRecommendations(parent, args, context, info) {
        //     let seed = await User.find({ uid: context.uid })
        //         .select('recommendationSeed')
        //         .lean()

        //     let recommendations = await Recommendation.find()
        //         .skip(seed)
        //         .limit(RECOMMEND_COUNT)
        //         .lean()

        //     let recommendsCount = await Recommendation.count()
        //     let nextSeed = (seed + RECOMMEND_COUNT) % recommendsCount
        //     await User.updateOne({ uid: context.uid }, { recommendSeed: nextSeed })

        //     return recommendations
        //     // .map(value => ({ value, sort: Math.random() }))
        //     // .sort((a, b) => a.sort - b.sort)
        // }

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
    switch (recommendation.type) {
        case 'interest':
            recommendation.preivews = await findPreviewsByInterest(
                recommendation.type,
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
    switch (recommend.type) {
        case 'new':
            return await getNewRecommendation(recommend)
        case 'interest':
            return await getInterestRecommendation(recommend)
        case 'search':
            return await getSearchRecommendation(recommend)

    }
}

async function getNewRecommendation(recommend) {
    return await getModel(recommend.targetType)
        .find()
        .sort('-createdAt')
        .limit(recommend.previewCount)
        .lean()
}

async function getInterestRecommendation(recommend) {
    console.log(`recommendation-resolver | getInterestRecommendation: recommend=${JSON.stringify(recommend)}`)
    return await getModel(recommend.targetType)
        .find({ interests: { $in: recommend.interests } })
        .sort('-adminScore')
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